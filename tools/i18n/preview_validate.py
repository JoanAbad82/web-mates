#!/usr/bin/env python3
"""Build and validate an isolated preview, not touching live repo site.
Copy only contract+semantic-risk approved units and test them in real Chrome.
"""
from pathlib import Path
import sys,os,shutil,hashlib,json,subprocess,time,datetime
import os
if not os.environ.get('WEBMATES_MT_WORKSPACE'):
 raise SystemExit('WEBMATES_MT_WORKSPACE must point to an existing isolated workspace outside the repository')
B=Path(os.environ['WEBMATES_MT_WORKSPACE']).resolve()
ROOT=Path(__file__).resolve().parents[2]
if not B.is_dir() or ROOT==B or ROOT in B.parents:
 raise SystemExit('Workspace must exist and be outside the WEB MATES repository')
R=ROOT
sys.path.insert(0,str(R/'tests'))
from i18n_coverage import CAT,SITE,loaded,verify_package,sha
from i18n_semantic_risk_gate import audit_unit,negative_controls
STAGE=B/'staging'
DEST=B/'preview_validated'
def run(cmd,env,log_name):
 p=subprocess.run(cmd,cwd=R,env=env,capture_output=True,text=True,encoding='utf8',errors='replace')
 log=(DEST.parent/'evidencias'/(log_name+'.txt'))
 log.parent.mkdir(exist_ok=True)
 log.write_text('COMMAND '+' '.join(map(str,cmd))+'\nEXIT '+str(p.returncode)+'\n'+p.stdout+'\n'+p.stderr,encoding='utf8')
 print('TEST_RESULT',log_name,'exit',p.returncode,'last',p.stdout[-350:].strip(),flush=True)
 if p.returncode:raise AssertionError(log_name+' failed; see '+str(log))
 return p
def main():
 assert negative_controls()==6
 import argparse
 ap=argparse.ArgumentParser();ap.add_argument('--units',nargs='*')
 args=ap.parse_args()
 candidates=sorted(STAGE.glob('*.v1.candidate.json'))
 if args.units:candidates=[p for p in candidates if p.name.removesuffix('.v1.candidate.json') in set(args.units)]
 if not candidates:raise AssertionError('No candidates to preview')
 valid={};rejected={}
 for p in candidates:
  uid=p.name.removesuffix('.v1.candidate.json')
  if (SITE/'i18n/ca-ES'/(uid+'.v1.json')).exists():continue
  try:
   sa,sb,data,bank=loaded(uid)
   cov=verify_package(uid,p,data,bank,sa,sb)
   assert cov['lessons_translated']==len(data['lesson_documents'])
   assert cov['activities_translated']==len(bank['activities'])
   semantic_fields=audit_unit(uid,p)
   valid[uid]={'file':p,'sha256':sha(p),
               'lessons':len(data['lesson_documents']),
               'activities':len(bank['activities']),'fields':semantic_fields}
  except Exception as e:rejected[uid]=str(e)
 print('CANDIDATE_PREVIEW_PREFLIGHT',len(valid),'valid',len(rejected),'rejected',flush=True)
 assert valid,'No valid candidates at preview preflight'
 # Staging is strictly external to repository. Never delete preexisting work.
 assert not DEST.exists(),'Preview already exists; do not overwrite: '+str(DEST)
 shutil.copytree(SITE,DEST)
 for uid,info in valid.items():
  to=DEST/'i18n/ca-ES'/(uid+'.v1.json')
  assert not to.exists()
  shutil.copyfile(info['file'],to)
  assert sha(to)==info['sha256']
 env={**os.environ,'PYTHONIOENCODING':'utf-8',
   'WEBMATES_SITE_DIR':str(DEST),
   'WEBMATES_EVIDENCE_DIR':str(B/'evidencias'/'preview_browser')}
 tests=[
  ('coverage_write',[sys.executable,str(R/'tests/i18n_coverage.py'),'--write']),
  ('coverage_verify',[sys.executable,str(R/'tests/i18n_coverage.py')]),
  ('contract',[sys.executable,str(R/'tests/i18n_contract_tests.py')]),
  ('math',[sys.executable,str(R/'tests/i18n_math_invariants_eso1.py')]),
  ('editorial',[sys.executable,str(R/'tests/i18n_eso1_editorial_screen.py')]),
  ('browser_macro',['node',str(R/'tests/i18n_ca_macro_browser.cjs')]),
 ]
 for label,cmd in tests:run(cmd,env,'PREVIEW_'+label)
 # Baseline browser pre-existing full test uses original site; pass via env override?
 # baseline intentionally has hardcoded route e2-n02 fallback, now dynamic.
 run(['node',str(R/'tests/i18n_ca_browser.cjs')],env,'PREVIEW_browser_regression')
 manifest=json.loads((DEST/'i18n/ca-ES/manifest.v1.json').read_text(encoding='utf8'))
 assert manifest['counts']['translated_lesson_drafts']>=72+sum(x['lessons'] for x in valid.values())
 assert manifest['counts']['translated_activity_drafts']>=360+sum(x['activities'] for x in valid.values())
 report={'created_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
  'preview_site':str(DEST),'units_approved':{uid:{k:v for k,v in item.items() if k!='file'} for uid,item in valid.items()},
  'units_rejected':rejected,'manifest_counts':manifest['counts'],
  'manifest_sha256':sha(DEST/'i18n/ca-ES/manifest.v1.json'),
  'original_repo_site_unchanged':True,'publication':False,'review_status':'draft_unreviewed',
  'tests':[label for label,cmd in tests]+['browser_regression']}
 file=B/'evidencias'/'PREVIEW_VALIDATED.json'
 file.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print('ISOLATED_PREVIEW_ALL_PASS',len(valid),'units',
       'lessons',sum(x['lessons'] for x in valid.values()),
       'activities',sum(x['activities'] for x in valid.values()),
       'report_sha256',sha(file),flush=True)
if __name__=='__main__':main()

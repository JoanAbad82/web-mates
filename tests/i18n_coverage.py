#!/usr/bin/env python3
"""Deterministic ca-ES manifest/coverage/contract checker: --write updates manifest; default checks."""
from pathlib import Path
from hashlib import sha256
import json,sys,re
from i18n_math_guard import math_guard
R=Path(__file__).resolve().parents[1]
SITE=R/'site'
CAT=json.loads((SITE/'data/catalogo.json').read_text(encoding='utf8'))
OUT=SITE/'i18n/ca-ES/manifest.v1.json'
PENDING='pending_translation'
ALLOWED_LESSON={'title','objectives','content_blocks'}
ALLOWED_BLOCK={'body','alt','visual_spec'}
ALLOWED_ACTIVITY={'prompt','hint','explanation'}
def require(ok,msg):
 if not ok:raise AssertionError(msg)
def sha(p):return sha256(p.read_bytes()).hexdigest()
def loaded(unit):
 lower=unit.lower().replace('-','_')
 prefix='f1_' if unit=='E3-A02' else 'f3_'
 a=SITE/'data'/(prefix+lower+'.json')
 b=SITE/'data'/(prefix+lower+'_exercises.json')
 require(a.exists() and b.exists(),'Missing source '+unit)
 data=json.loads(a.read_text(encoding='utf8'))
 bank=json.loads(b.read_text(encoding='utf8'))
 require(data['unit_id']==bank['unit_id']==unit,'Source unit mismatch '+unit)
 return a,b,data,bank
def verify_package(unit,path,src_data,src_bank,src_a,src_b):
 p=json.loads(path.read_text(encoding='utf8'))
 require(p.get('schema')=='webmates.ca-ES.unit-overlay.v1' and p.get('locale')=='ca-ES'
  and p.get('unit_id')==unit and p.get('translation_status')=='draft_unreviewed'
  and re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+',p.get('version','')),'Wrong package identity')
 require(set(p)=={'schema','version','locale','unit_id','translation_status','source_files_sha256','lessons','activities'},'Unexpected package top level')
 expected_sources={
  'data/'+src_a.name:sha(src_a),
  'data/'+src_b.name:sha(src_b)
 }
 require(p['source_files_sha256']==expected_sources,'Original source hashes differ')
 lesson_map={x['lesson_id']:x for x in src_data['lesson_documents']}
 act_map={x['exercise_id']:x for x in src_bank['activities']}
 translated=set()
 for lid,text in p['lessons'].items():
  require(lid in lesson_map and set(text)==ALLOWED_LESSON,'Unknown lesson/unsafe keys '+lid)
  doc=lesson_map[lid]
  require(isinstance(text['title'],str) and text['title'].strip(),'Empty localized title '+lid)
  titles={l['lesson_id']:l['title'] for c in CAT['courses'] for u in c['units'] for l in u['lessons']}
  math_guard(titles[lid],text['title'],lid+':title')
  require(isinstance(text['objectives'],list) and len(text['objectives'])==len(doc['objectives']),'Objective mismatch '+lid)
  require(isinstance(text['content_blocks'],list) and len(text['content_blocks'])==len(doc['content_blocks']),'Block mismatch '+lid)
  for source,target in zip(doc['objectives'],text['objectives']):
   require(isinstance(target,str) and target.strip() and source!=target,'Untranslated objective '+lid)
   math_guard(source,target,lid+':objective')
  for source,target in zip(doc['content_blocks'],text['content_blocks']):
   require(set(target).issubset(ALLOWED_BLOCK) and isinstance(target.get('body'),str) and target['body'].strip()
      and target['body']!=source['body'],'Invalid untranslated content '+lid)
   math_guard(source['body'],target['body'],lid+':body')
   if 'alt' in target:
    require('alt' in source and isinstance(target['alt'],str),'Alt source mismatch '+lid)
    math_guard(source['alt'],target['alt'],lid+':alt')
   if 'visual_spec' in target:
    require(set(target['visual_spec'])=={'title'} and 'visual_spec' in source,'Visual unsafe field '+lid)
    math_guard(source['visual_spec']['title'],target['visual_spec']['title'],lid+':visual')
  translated.add(lid)
 for aid,text in p['activities'].items():
  require(aid in act_map and set(text)==ALLOWED_ACTIVITY,'Unknown exercise/unsafe fields '+aid)
  require(act_map[aid]['lesson_id'] in translated,'Orphan exercise translation '+aid)
  for k,v in text.items():
   require(isinstance(v,str) and v.strip() and v!=act_map[aid].get(k),'Untranslated exercise text '+aid)
   math_guard(act_map[aid][k],v,aid+':'+k)
 # Complete lesson requires ALL its original exercises fully translated.
 complete=[lid for lid in translated if all(ref in p['activities'] for ref in lesson_map[lid]['exercise_refs'])]
 return {'lessons_translated':len(complete),'activities_translated':len(p['activities']),
         'package_file':path.name,'sha256':sha(path),'draft_unreviewed':True}
def main():
 units=[];all_ids=set();ex_ids=set();sum_lessons=0;sum_activities=0
 translated_lessons=0;translated_activities=0
 all_source_hash={}
 for course in CAT['courses']:
  for u in course['units']:
   uid=u['unit_id'];require(uid not in all_ids,'Duplicate unit');all_ids.add(uid)
   src_a,src_b,data,bank=loaded(uid)
   src_l={x['lesson_id'] for x in data['lesson_documents']}
   catalog_l={x['lesson_id'] for x in u['lessons']}
   require(src_l==catalog_l,'Lesson ID mismatch '+uid)
   ids=[x['exercise_id'] for x in bank['activities']]
   require(len(ids)==len(set(ids)) and not (ex_ids & set(ids)),'Duplicate exercise ID '+uid)
   ex_ids.update(ids)
   require(all(x['lesson_id'] in src_l for x in bank['activities']),'Orphan exercise '+uid)
   sum_lessons+=len(src_l);sum_activities+=len(ids)
   all_source_hash[uid]=[sha(src_a),sha(src_b)]
   package_path=SITE/'i18n/ca-ES'/ (uid+'.v1.json')
   result=verify_package(uid,package_path,data,bank,src_a,src_b) if package_path.is_file() else None
   if result:
    translated_lessons+=result['lessons_translated'];translated_activities+=result['activities_translated']
   units.append({'unit_id':uid,'source_lessons':len(src_l),'source_activities':len(ids),
      'package':package_path.name if result else None,
      'draft_translated_lessons':result['lessons_translated'] if result else 0,
      'draft_translated_activities':result['activities_translated'] if result else 0,
      'review_status':'draft_unreviewed' if result else PENDING})
 require(len(units)==85 and sum_lessons==505 and sum_activities==2525,'Wrong canonical coverage')
 result={'schema':'webmates.ca-ES.manifest.v1','locale':'ca-ES','version':'1.0.0',
   'editorial_status':'draft_unreviewed_not_validated',
   'counts':{'units':85,'lessons':505,'activities':2525,'translated_lesson_drafts':translated_lessons,
    'translated_activity_drafts':translated_activities,'reviewed_lessons':0,'reviewed_activities':0},
   'units':units}
 serialized=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
 if '--write' in sys.argv:OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(serialized,encoding='utf8')
 else:require(OUT.is_file() and OUT.read_text(encoding='utf8')==serialized,'Manifest drift: run --write')
 print('CA_COVERAGE_PASS',json.dumps(result['counts']), 'manifest_sha256='+sha(OUT))
if __name__=='__main__':main()

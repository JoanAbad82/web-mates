#!/usr/bin/env python3
"""Prove ca-ES overlay rejects unsafe or incomplete contributors' changes."""
from pathlib import Path
import json,copy,tempfile
from i18n_coverage import loaded,verify_package
R=Path(__file__).resolve().parents[1]
a,b,data,bank=loaded('E1-N01')
package=R/'site/i18n/ca-ES/E1-N01.v1.json'
original=json.loads(package.read_text(encoding='utf8'))
positive=verify_package('E1-N01',package,data,bank,a,b)
assert positive['lessons_translated']==1 and positive['activities_translated']==5
passed=1
mutations={
 'answers_forbidden':lambda d:d['activities'][next(iter(d['activities']))].update({'answer':999}),
 'validator_forbidden':lambda d:d['activities'][next(iter(d['activities']))].update({'validator':'unsafe'}),
 'choices_forbidden':lambda d:d['activities'][next(iter(d['activities']))].update({'choices':['y','n']}),
 'lesson_id_unknown':lambda d:d['lessons'].__setitem__('UNKNOWN-L01',d['lessons'].pop('E1-N01-L01')),
 'exercise_id_unknown':lambda d:d['activities'].__setitem__('UNKNOWN-EX',d['activities'].pop(next(iter(d['activities'])))),
 'hash_mismatch':lambda d:d['source_files_sha256'].update({'data/f3_e1_n01.json':'0'*64}),
 'empty_prompt':lambda d:d['activities'][next(iter(d['activities']))].update({'prompt':''}),
 'missing_explanation':lambda d:d['activities'][next(iter(d['activities']))].pop('explanation'),
 'bad_status':lambda d:d.update({'translation_status':'validated'}),
 'wrong_locale':lambda d:d.update({'locale':'es-ES'})
}
with tempfile.TemporaryDirectory() as scratch:
 for name,mutate in mutations.items():
  d=copy.deepcopy(original)
  mutate(d)
  p=Path(scratch)/(name+'.json')
  p.write_text(json.dumps(d,ensure_ascii=False)+'\n',encoding='utf8')
  try:verify_package('E1-N01',p,data,bank,a,b)
  except (AssertionError,KeyError,TypeError):
   print('REJECT_PASS',name);passed+=1
  else:raise AssertionError('Unsafe mutation accepted: '+name)
print('I18N_CONTRACT_PASS',passed,'/',len(mutations)+1)

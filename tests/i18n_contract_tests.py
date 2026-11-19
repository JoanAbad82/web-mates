#!/usr/bin/env python3
"""Prove all published ca-ES packages cannot override mathematics, IDs or contracts."""
from pathlib import Path
import json,copy,tempfile
from i18n_coverage import CAT,SITE,loaded,verify_package
R=Path(__file__).resolve().parents[1]
passed=0
units=[u['unit_id'] for c in CAT['courses'] for u in c['units']
       if (SITE/'i18n/ca-ES'/(u['unit_id']+'.v1.json')).is_file()]
assert units,'No translated unit packages'
for unit_id in units:
 src_a,src_b,data,bank=loaded(unit_id)
 file=R/'site/i18n/ca-ES'/(unit_id+'.v1.json')
 original=json.loads(file.read_text(encoding='utf8'))
 pos=verify_package(unit_id,file,data,bank,src_a,src_b)
 assert pos['lessons_translated']==len(data['lesson_documents']) and pos['activities_translated']==len(bank['activities']),unit_id
 passed+=1
 def first_act(d):return d['activities'][next(iter(d['activities']))]
 def drop_first_lesson(d):
  key=next(iter(d['lessons']))
  d['lessons']['UNKNOWN-L01']=d['lessons'].pop(key)
 def drop_first_activity(d):
  key=next(iter(d['activities']))
  d['activities']['UNKNOWN-EX']=d['activities'].pop(key)
 def mutate_operator(d):
  for val in d['activities'].values():
   for symbol in ('+','<','×','÷'):
    if symbol in val['prompt']:
     val['prompt']=val['prompt'].replace(symbol,'?' if symbol=='+' else '+',1)
     return
  first_act(d)['prompt']=first_act(d)['prompt']+' +'
  return
 mutations={
  'answers_forbidden':lambda d:first_act(d).update({'answer':999}),
  'validator_forbidden':lambda d:first_act(d).update({'validator':'unsafe'}),
  'choices_forbidden':lambda d:first_act(d).update({'choices':['yes','no']}),
  'lesson_id_unknown':drop_first_lesson,
  'exercise_id_unknown':drop_first_activity,
  'hash_mismatch':lambda d:d['source_files_sha256'].update({'data/'+src_a.name:'0'*64}),
  'empty_prompt':lambda d:first_act(d).update({'prompt':''}),
  'missing_explanation':lambda d:first_act(d).pop('explanation'),
  'bad_status':lambda d:d.update({'translation_status':'validated'}),
  'wrong_locale':lambda d:d.update({'locale':'es-ES'}),
  'numeric_token_changed':lambda d:first_act(d).update({'prompt':first_act(d)['prompt']+' 999'}),
  'math_operator_changed':mutate_operator
 }
 with tempfile.TemporaryDirectory() as scratch:
  for name,mutate in mutations.items():
   d=copy.deepcopy(original);mutate(d)
   path=Path(scratch)/(unit_id+'-'+name+'.json')
   path.write_text(json.dumps(d,ensure_ascii=False)+'\n',encoding='utf8')
   try:verify_package(unit_id,path,data,bank,src_a,src_b)
   except (AssertionError,KeyError,TypeError):
    print('REJECT_PASS',unit_id,name);passed+=1
   else:raise AssertionError('Unsafe mutation accepted: '+unit_id+':'+name)
print('I18N_CONTRACT_PASS',passed,'/',13*len(units),'units',len(units))
assert passed==13*len(units)

#!/usr/bin/env python3
"""Independent text-completeness and obvious Spanish-residual checks for new ca-ES units."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
UIDS=('E1-N03','E1-N04','E1-N05','E1-P01','E1-M01','E1-G01')
# Conservative screen: not a substitute for review by a Catalan mathematics specialist.
ES_MARKER=re.compile(r'[¿¡]|\b(?:fracción|comprobación|datos utilizados|resultado|respuesta numérica|cuántos|cuánto|multiplicarlo|como número|seleccione|el número de|denominador común)\b',re.I)
checks=0
for uid in UIDS:
 k='f3_'+uid.lower().replace('-','_')
 source=json.loads((ROOT/'site/data'/(k+'.json')).read_text(encoding='utf8'))
 ex=json.loads((ROOT/'site/data'/(k+'_exercises.json')).read_text(encoding='utf8'))
 p=json.loads((ROOT/'site/i18n/ca-ES'/(uid+'.v1.json')).read_text(encoding='utf8'))
 orig_l={x['lesson_id']:x for x in source['lesson_documents']}
 orig_a={x['exercise_id']:x for x in ex['activities']}
 assert len(orig_l)==len(p['lessons'])==6
 assert len(orig_a)==len(p['activities'])==30
 for lid,t in p['lessons'].items():
  o=orig_l[lid]
  fields=[(lid+':title',t['title'])]
  fields.extend((lid+':objective',v) for v in t['objectives'])
  for s,block in zip(o['content_blocks'],t['content_blocks']):
   for key,val in block.items():
    if key=='visual_spec':fields.append((lid+':visual',val['title']))
    else:fields.append((lid+':'+key,val))
   assert block['body']!=s['body']
  for key,val in fields:
   assert isinstance(val,str) and val.strip(),key
   assert not ES_MARKER.search(val),(key,val)
   checks+=1
 for eid,t in p['activities'].items():
  o=orig_a[eid]
  assert set(t)=={'prompt','hint','explanation'}
  assert o['answer'] is not None
  for key,val in t.items():
   assert val.strip() and val!=o[key],(eid,key)
   assert not ES_MARKER.search(val),(eid,key,val)
   checks+=1
 print('EDITORIAL_DRAFT_SCREEN_PASS',uid,'lessons',6,'activities',30)
print('SPANISH_RESIDUAL_SCREEN_PASS',checks,'text-field checks (not linguistic sign-off)')

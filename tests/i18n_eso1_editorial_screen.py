#!/usr/bin/env python3
"""Independent text-completeness and obvious Spanish-residual checks for new ca-ES units."""
from pathlib import Path
import json,re
from i18n_coverage import CAT,SITE,loaded
ROOT=Path(__file__).resolve().parents[1]
UIDS=[u['unit_id'] for c in CAT['courses'] for u in c['units']
      if (SITE/'i18n/ca-ES'/(u['unit_id']+'.v1.json')).is_file()]
# Conservative screen: not a substitute for review by a Catalan mathematics specialist.
ES_MARKER=re.compile(r'[¿¡]|\b(?:fracción|comprobación|datos utilizados|resultado|respuesta numérica|cuántos|cuánto|multiplicarlo|como número|seleccione|el número de|denominador común)\b',re.I)
checks=0
for uid in UIDS:
 _a,_b,source,ex=loaded(uid)
 p=json.loads((SITE/'i18n/ca-ES'/(uid+'.v1.json')).read_text(encoding='utf8'))
 orig_l={x['lesson_id']:x for x in source['lesson_documents']}
 orig_a={x['exercise_id']:x for x in ex['activities']}
 assert len(orig_l)==len(p['lessons'])
 assert len(orig_a)==len(p['activities'])
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
 print('EDITORIAL_DRAFT_SCREEN_PASS',uid,'lessons',len(orig_l),'activities',len(orig_a))
print('SPANISH_RESIDUAL_SCREEN_PASS',checks,'text-field checks (not linguistic sign-off)')

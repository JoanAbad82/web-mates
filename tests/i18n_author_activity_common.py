"""Attach explicitly authored Catalan activity text keyed by canonical ID and source hash."""
from pathlib import Path
import json
from i18n_math_guard import math_guard
R=Path(__file__).resolve().parents[1]
def add_activities(uid, translations):
 key='f3_'+uid.lower().replace('-','_')
 bank=json.loads((R/'site/data'/(key+'_exercises.json')).read_text(encoding='utf8'))
 path=R/'site/i18n/ca-ES'/(uid+'.v1.json')
 pack=json.loads(path.read_text(encoding='utf8'))
 original=bank['activities']
 assert len(original)==30 and len(translations)==30 and len(pack['lessons'])==6
 assert pack['activities']=={},'No overwrites of existing translations'
 for i,a in enumerate(original):
  answer=translations[i]
  assert set(answer)=={'prompt','hint','explanation'},(uid,i)
  for k,v in answer.items():
   assert v.strip() and v!=a[k],(uid,i,k)
   math_guard(a[k],v,a['exercise_id']+':'+k)
  pack['activities'][a['exercise_id']]=answer
 assert len(pack['activities'])==30
 path.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print('CATALAN_ACTIVITY_PACKAGE_PASS',uid,'lessons',len(pack['lessons']),'activities',len(pack['activities']))

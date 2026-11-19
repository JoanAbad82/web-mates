"""Build one fully-authored ca-ES unit text package from source and explicit translations."""
from pathlib import Path
from hashlib import sha256
import json
from i18n_math_guard import math_guard
R=Path(__file__).resolve().parents[1]
def write_lessons(uid,translation):
 key='f3_'+uid.lower().replace('-','_')
 doc=R/'site/data'/(key+'.json')
 bank=R/'site/data'/(key+'_exercises.json')
 data=json.loads(doc.read_text(encoding='utf8'))
 lessons=data['lesson_documents']
 assert len(lessons)==6 and len(translation)==6
 pack={'schema':'webmates.ca-ES.unit-overlay.v1','version':'1.0.0','locale':'ca-ES',
       'unit_id':uid,'translation_status':'draft_unreviewed',
       'source_files_sha256':{'data/'+doc.name:sha256(doc.read_bytes()).hexdigest(),
                              'data/'+bank.name:sha256(bank.read_bytes()).hexdigest()},
       'lessons':{},'activities':{}}
 for d in lessons:
  suffix=d['lesson_id'].split('-')[-1]
  t=translation[suffix]
  assert set(t)=={'title','objectives','blocks','visual_title'}
  assert len(t['objectives'])==len(d['objectives'])==2
  assert len(t['blocks'])==len(d['content_blocks'])==6
  blocks=[]
  for source,target in zip(d['content_blocks'],t['blocks']):
   content={'body':target}
   math_guard(source['body'],target,d['lesson_id']+':body')
   if source['type']=='figure':
    if uid=='E1-N03':
     # Figure's alt repeats source caption and adds a generic semantic-table explanation.
     intro=target.split('. ')[0]
     alt=intro+'. Totes les dades d’aquesta representació també apareixen en una taula semàntica.'
    else:alt=target # Exact source figure alt is same as figure body.
    assert 'alt' in source and 'visual_spec' in source
    content['alt']=alt
    content['visual_spec']={'title':t['visual_title']}
    math_guard(source['alt'],alt,d['lesson_id']+':alt')
    math_guard(source['visual_spec']['title'],t['visual_title'],d['lesson_id']+':visual_title')
   blocks.append(content)
  for source,target in zip(d['objectives'],t['objectives']):
   math_guard(source,target,d['lesson_id']+':objective')
  pack['lessons'][d['lesson_id']]={'title':t['title'],'objectives':t['objectives'],
                                    'content_blocks':blocks}
 dest=R/'site/i18n/ca-ES'/(uid+'.v1.json')
 assert not dest.exists(),'Existing package must not be overwritten'
 dest.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print('TRANSLATED_LESSON_DRAFTS',uid,len(pack['lessons']))

#!/usr/bin/env python3
"""Catalan overlays E1: mathematical token, stable IDs and data invariants; not human semantic review."""
from pathlib import Path
from hashlib import sha256
import json,re,collections
R=Path(__file__).resolve().parents[1]
num=re.compile(r'(?<!\w)(?:-|−)?\d{1,3}(?:[ \u00a0]\d{3})+|(?<!\w)(?:-|−)?\d+(?!\w)')
operators=re.compile(r'[+×÷=<>−]')
def nums(s):return [v.replace(' ','').replace('\u00a0','') for v in num.findall(s)]
def invariant(src,dst,context):
 assert isinstance(dst,str) and dst.strip(),('missing',context)
 a,b=nums(src),nums(dst)
 if a!=b and context.endswith(':prompt'):
  m=re.search(r'posición de (10|100|1000) unidades',src)
  words={'10':'desenes','100':'centenes','1000':'milers'}
  if m and words[m.group(1)] in dst:
   a=list(a);a.remove(m.group(1))
 if a!=b:raise AssertionError((context,'numbers_changed',a,b))
 if operators.findall(src)!=operators.findall(dst):raise AssertionError((context,'operators_changed',src,dst))
 return 1
count=0
for uid in ('E1-N01','E1-N02'):
 suffix=uid.lower().replace('-','_')
 docfile=R/'site/data'/('f3_'+suffix+'.json')
 bankfile=R/'site/data'/('f3_'+suffix+'_exercises.json')
 doc=json.loads(docfile.read_text(encoding='utf8'))
 bank=json.loads(bankfile.read_text(encoding='utf8'))
 trans=json.loads((R/'site/i18n/ca-ES'/(uid+'.v1.json')).read_text(encoding='utf8'))
 assert trans['unit_id']==uid and trans['locale']=='ca-ES' and trans['translation_status']=='draft_unreviewed'
 assert trans['source_files_sha256']=={'data/'+docfile.name:sha256(docfile.read_bytes()).hexdigest(),
  'data/'+bankfile.name:sha256(bankfile.read_bytes()).hexdigest()}
 docs={x['lesson_id']:x for x in doc['lesson_documents']}
 acts={x['exercise_id']:x for x in bank['activities']}
 assert set(trans['lessons'])==set(docs)
 assert set(trans['activities'])==set(acts)
 mapping=collections.defaultdict(set)
 for lid,x in docs.items():
  t=trans['lessons'][lid]
  for i,(a,b) in enumerate(zip(x['objectives'],t['objectives'])):
   count+=invariant(a,b,lid+':objective:'+str(i));mapping[a].add(b)
  assert len(x['content_blocks'])==len(t['content_blocks'])
  for i,(a,b) in enumerate(zip(x['content_blocks'],t['content_blocks'])):
   for key in ('body','alt'):
    if key in b:
     count+=invariant(a[key],b[key],lid+':'+key+':'+str(i));mapping[a[key]].add(b[key])
   if 'visual_spec' in b:
    count+=invariant(a['visual_spec']['title'],b['visual_spec']['title'],lid+':visual:'+str(i))
  assert all(y in trans['activities'] for y in x['exercise_refs'])
 for eid,x in acts.items():
  t=trans['activities'][eid]
  assert set(t)=={'prompt','hint','explanation'}
  for k in t:
   count+=invariant(x[k],t[k],eid+':'+k);mapping[x[k]].add(t[k])
  if x['type']=='choice':
   assert x['answer'] in x['choices']
   count+=1
 assert all(len(v)==1 for v in mapping.values()),uid+' inconsistent repeated translation'
 print('UNIT_MATH_PASS',uid,'lessons',len(docs),'activities',len(acts))
print('MATH_INVARIANTS_PASS',count)

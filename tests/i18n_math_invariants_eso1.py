#!/usr/bin/env python3
"""All translated units: mathematical token, stable ID and original-data invariants; not semantic review."""
from pathlib import Path
from hashlib import sha256
import json,re,collections
from i18n_coverage import CAT,SITE,loaded
R=Path(__file__).resolve().parents[1]
num=re.compile(r'(?<!\w)(?:-|−)?\d{1,3}(?:[ \u00a0]\d{3})+|(?<!\w)(?:-|−)?\d+(?!\w)')
from i18n_math_guard import math_ops  # shared Unicode-aware mathematical-operator gate
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
 if math_ops(src)!=math_ops(dst):raise AssertionError((context,'operators_changed',src,dst))
 return 1
count=0
units=[u['unit_id'] for c in CAT['courses'] for u in c['units']
       if (SITE/'i18n/ca-ES'/(u['unit_id']+'.v1.json')).is_file()]
assert units,'No translated unit packages available'
for uid in units:
 docfile,bankfile,doc,bank=loaded(uid)
 trans=json.loads((SITE/'i18n/ca-ES'/(uid+'.v1.json')).read_text(encoding='utf8'))
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

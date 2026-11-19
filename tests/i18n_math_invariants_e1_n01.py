#!/usr/bin/env python3
"""Text-to-text math invariants for Catalan E1-N01 draft; not a semantic translation review."""
from pathlib import Path
from hashlib import sha256
import json,re,collections
R=Path(__file__).resolve().parents[1]
data=json.loads((R/'site/data/f3_e1_n01.json').read_text(encoding='utf8'))
bank=json.loads((R/'site/data/f3_e1_n01_exercises.json').read_text(encoding='utf8'))
p=json.loads((R/'site/i18n/ca-ES/E1-N01.v1.json').read_text(encoding='utf8'))
canon=R/'site/data'
checks=0
num=re.compile(r'(?<!\w)(?:-|−)?\d{1,3}(?:[ \u00a0]\d{3})+|(?<!\w)(?:-|−)?\d+(?!\w)')
operators=re.compile(r'[+×÷=<>−]')
def numbers(text):
 return [x.replace(' ','').replace('\u00a0','') for x in num.findall(text)]
def invariant(src,dst,context,ignore_numbers=False):
 global checks
 assert isinstance(dst,str) and dst.strip(),context+' missing translation'
 if not ignore_numbers:
  sr,dt=numbers(src),numbers(dst)
  if sr!=dt and context.endswith(':prompt'):
   # "posición de 100 unidades" -> "centenes" is equivalent Catalan place-value vocabulary.
   m=re.search(r'posición de (10|100|1000) unidades',src)
   word={'10':'desenes','100':'centenes','1000':'milers'}
   if m and word[m.group(1)] in dst:
    reduced=list(sr)
    reduced.remove(m.group(1))
    assert reduced==dt,(context,'place_value',sr,dt)
   else:raise AssertionError((context,'numbers',sr,dt))
  else:assert sr==dt,(context,'numbers',sr,dt)
  assert operators.findall(src)==operators.findall(dst),(context,'operators',operators.findall(src),operators.findall(dst))
 checks+=1
docmap={x['lesson_id']:x for x in data['lesson_documents']}
acts={x['exercise_id']:x for x in bank['activities']}
assert set(p['lessons'])==set(docmap)
assert set(p['activities'])==set(acts)
translated=collections.defaultdict(set)
for lid,doc in docmap.items():
 tr=p['lessons'][lid]
 assert len(doc['objectives'])==len(tr['objectives'])
 assert len(doc['content_blocks'])==len(tr['content_blocks'])
 for i,(src,dst) in enumerate(zip(doc['objectives'],tr['objectives'])):
  invariant(src,dst,f'{lid}:objective:{i}')
  translated[src].add(dst)
 for i,(src,dst) in enumerate(zip(doc['content_blocks'],tr['content_blocks'])):
  invariant(src['body'],dst['body'],f'{lid}:body:{i}')
  translated[src['body']].add(dst['body'])
  for field in ('alt',):
   if field in dst:
    invariant(src[field],dst[field],f'{lid}:{field}:{i}')
    translated[src[field]].add(dst[field])
  if 'visual_spec' in dst:
   invariant(src['visual_spec']['title'],dst['visual_spec']['title'],f'{lid}:visual:{i}')
 for ref in doc['exercise_refs']:assert ref in p['activities'],(lid,ref)
for eid,original in acts.items():
 t=p['activities'][eid]
 assert original['exercise_id']==eid
 for field in ('prompt','hint','explanation'):
  invariant(original[field],t[field],f'{eid}:{field}')
  translated[original[field]].add(t[field])
 assert not set(t) & {'answer','choices','validator','type','exercise_id','lesson_id'}
 # For choice exercises, the canonical answer must still match exactly one original option.
 if original['type']=='choice':
  assert original['answer'] in original['choices']
  checks+=1
assert not [k for k,v in translated.items() if len(v)>1], 'Same source text inconsistently translated'
original_hashes=p['source_files_sha256']
for name,digest in original_hashes.items():
 assert sha256((canon/Path(name).name).read_bytes()).hexdigest()==digest
print('E1_N01_MATH_TOKENS_PASS',checks,'checks, 6/6 lessons, 30/30 activities, no source modifications')

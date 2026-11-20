#!/usr/bin/env python3
"""Additional deterministic fidelity gate for ca-ES MT mathematical notation.
Checks candidates in external staging. Does not certify semantic equivalence.
"""
import argparse,json,collections,re,sys
from pathlib import Path
from i18n_coverage import CAT,SITE,loaded,verify_package
from i18n_math_guard import math_guard
# Symbols that must remain byte-identical in every math source and translation.
GLYPHS='|ΩαβγθπφδΣ∑ȳŷ̄̂λσμρνϕ∂∇∮≃≅⊆⊇∥⟂∝∴∵∎⬌∞∩∪∈∅⊂∫°₀₁₂₃₄₅₆₇₈₉⁰¹⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐᵑᵒᵖʳˢᵗᵘᵛʷˣʸᶻ'
SEMANTIC_RULES=[
 ('si y solo si',re.compile(r'si i només si|si, i només si',re.I)),
 ('si y únicamente si',re.compile(r'si i només si|si, i únicament si',re.I)),
 ('al menos',re.compile(r'almenys|com a mínim',re.I)),
 ('a lo sumo',re.compile(r'com a màxim|a tot estirar',re.I)),
 ('no negativ',re.compile(r'no negati|sense signe negatiu',re.I)),
 ('no nulo',re.compile(r'no nul|diferent de zero',re.I))
]
def assert_pair(source,target,ref):
 assert isinstance(source,str) and isinstance(target,str) and target.strip(),ref
 math_guard(source,target,ref)
 for ch in GLYPHS:
  if source.count(ch)!=target.count(ch):
   raise AssertionError(ref+' glyph '+repr(ch)+' '+str(source.count(ch))+' vs '+str(target.count(ch)))
 if '/' in source and source.count('/')!=target.count('/'):
  raise AssertionError(ref+' slash count changed')
 if re.search(r'\bcalcula y cuando\b',source,re.I) and not re.search(r'\bcalcula y quan\b',target,re.I):
  raise AssertionError(ref+' variable y translated as conjunction')
 if re.search(r'\b(?:variable|coordenada|valor de) y\b',source,re.I) and not re.search(r'\b(?:variable|coordenada|valor de|valor d[’\x27]|eix) y\b',target,re.I):
  raise AssertionError(ref+' named variable y missing')
 if source.count('||')!=target.count('||'):
  raise AssertionError(ref+' answer delimiter changed')
 if source.count('\n') and source.count('\n')!=target.count('\n'):
  raise AssertionError(ref+' line structure changed')
 low=source.lower()
 for span,pattern in SEMANTIC_RULES:
  if (re.search(r'\bno\s+negativ[oa]s?\b',source,re.I) if span=='no negativ' else bool(re.search(r'(?<!\w)'+re.escape(span)+r'(?!\w)',source,re.I))) and not pattern.search(target):
   raise AssertionError(ref+' risk phrase '+span)
 return True
def audit(uid,path):
 a,b,doc,bank=loaded(uid)
 data=json.loads(path.read_text(encoding='utf8'))
 verified=verify_package(uid,path,doc,bank,a,b)
 assert verified['lessons_translated']==len(doc['lesson_documents'])
 assert verified['activities_translated']==len(bank['activities'])
 titles={x['lesson_id']:x['title'] for c in CAT['courses'] for u in c['units'] for x in u['lessons']}
 originals={x['lesson_id']:x for x in doc['lesson_documents']}
 activities={x['exercise_id']:x for x in bank['activities']}
 total=0
 for lid,item in data['lessons'].items():
  origin=originals[lid]
  pairs=[(titles[lid],item['title'])]+list(zip(origin['objectives'],item['objectives']))
  for x,y in zip(origin['content_blocks'],item['content_blocks']):
   pairs.append((x['body'],y['body']))
   if 'alt' in y:pairs.append((x['alt'],y['alt']))
   if 'visual_spec' in y:pairs.append((x['visual_spec']['title'],y['visual_spec']['title']))
  for source,target in pairs:assert_pair(source,target,lid);total+=1
 for aid,fields in data['activities'].items():
  for key,target in fields.items():assert_pair(activities[aid][key],target,aid+':'+key);total+=1
 return total
def negative_tests():
 samples=[
 ('Si y solo si a=b, ocurre el caso','Si a=b, ocorre el cas'),
 ('La variable debe ser no negativa','La variable pot ser negativa'),
 ('P(A|B)=1/2','P(A,B)=1/2'),
 ('cov(X,Y)=Σ(xᵢ−x̄)(yᵢ−ȳ)/n','cov(X,Y)=(xᵢ−x̄)(yᵢ−ȳ)/n'),
 ('Al menos 7 casos','Fins a 7 casos'),
 ('La media es 2\n1. Primero\n2. Después','La mitjana és 2, primer i després'),
  ('Para y=2x+1, calcula y cuando x=3','Per y=2x+1, calcula i quan x=3'),
  ('Las entradas aᵢⱼ y aₙₙ son conocidas','Les entrades aᵢ j i ann són conegudes')
 ]
 for i,(s,t) in enumerate(samples):
  try:assert_pair(s,t,'NEG_'+str(i))
  except AssertionError:continue
  raise AssertionError('bad mutation accepted '+str(i))
 return len(samples)
def main():
 ap=argparse.ArgumentParser()
 ap.add_argument('--candidate-dir',type=Path,required=True)
 args=ap.parse_args()
 assert args.candidate_dir.is_dir()
 print('MATH_FIDELITY_NEGATIVE_CASES_PASS',negative_tests())
 passed={};rejected={}
 for file in sorted(args.candidate_dir.glob('*.v1.candidate.json')):
  uid=file.name.removesuffix('.v1.candidate.json')
  try:passed[uid]=audit(uid,file)
  except Exception as e:rejected[uid]=str(e)
 print('MATH_FIDELITY_RESULT',json.dumps({'passed_units':len(passed),'total_fields_checked':sum(passed.values()),
  'failing_units':rejected},ensure_ascii=False))
 if rejected:sys.exit(1)
if __name__=='__main__':main()

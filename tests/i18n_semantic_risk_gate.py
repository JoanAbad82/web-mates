#!/usr/bin/env python3
"""Deterministic ES->CA semantic-risk checks, not certification of translation quality.
Verifies source signatures, lexical math terminology, negation, and sample rejects.
Can audit isolated candidates before import to the site. No data or code changes.
"""
import argparse,json,re
from pathlib import Path
from i18n_coverage import CAT,SITE,loaded,verify_package
from i18n_math_guard import math_guard
TERM={
 'primos':(r'\bprimos?\b',r'\bprimers?\b'),
 'mediana':(r'\bmediana\b',r'\bmediana\b'),
 'aritmética':(r'\bmedia aritmética\b',r'\bmitjana aritmètica\b'),
 'raíz':(r'\braí(?:z|ces)\b',r'\barrels?\b'),
 'fracción':(r'\bfraccion(?:es)?\b|\bfracción\b',r'\bfraccion(?:s)?\b|\bfracció\b'),
 'frecuencia':(r'\bfrecuencia(?:s)?\b',r'\bfreqüència(?:s)?\b'),
 'probabilidad':(r'\bprobabilidad(?:es)?\b',r'\bprobabilitat(?:s)?\b'),
 'ángulo':(r'\bángulo(?:s)?\b',r'\bangles?\b'),
 'ecuación':(r'\becuaci(?:ón|ones)\b',r'\bequaci(?:ó|ons)\b'),
 'polinomio':(r'\bpolinomio(?:s)?\b',r'\bpolinomi(?:s)?\b'),
 'número primo':(r'\bnúmeros?\s+primos?\b',r'\bnombres?\s+primers?\b'),
 'cuadrado':(r'\bcuadrado(?:s)?\b',r'\bquadrat(?:s)?\b'),
 'negativo':(r'\bnegativ[oa]s?\b',r'\bnegati(?:u|va|us|ves)\b'),
 'positivo':(r'\bpositiv[oa]s?\b',r'\bpositi(?:u|va|us|ves)\b')
}
RESIDUAL=re.compile(r'[¿¡]|\b(?:cuánto|cuántos|cuál|cuáles|fracción|fracciones|ecuación|ecuaciones|ejercicio|enunciado|respuesta|elige|sustituye|sustituir|cuadrado|periódico|número|números|valores|promedio|tabla|datos|resultado|donde|mientras|porque|entonces|pero|después|antes|entero|enteros|izquierda|derecha|arriba|abajo|tiene|tienen|debería|siempre|solamente|alumnos|alumno|muestra|población|frecuencia|gráfica|gráfico|largo|ancho|siendo|resuelve|comprueba|disminuye|aumenta)\b',re.I)
def test_pair(src,dst,key):
 assert isinstance(src,str) and isinstance(dst,str) and dst.strip(),key
 math_guard(src,dst,key)
 assert src.count('||')==dst.count('||'),key+' reflection structure'
 assert not RESIDUAL.search(dst),key+' Spanish residue '+str(RESIDUAL.search(dst).group() if RESIDUAL.search(dst) else '')
 if re.search(r'\bno\b',src,re.I):
  assert re.search(r'\b(?:no|sense|mai|cap)\b',dst,re.I),key+' negation removed'
 if re.search(r'\bsin\b(?!\s+embargo\b)',src,re.I):
  assert re.search(r'\bsense\b',dst,re.I),key+' absent condition'
 for label,(es,ca) in TERM.items():
  if re.search(es,src,re.I) and not re.search(ca,dst,re.I):
   raise AssertionError(key+' terminology '+label)
 return True
def audit_unit(uid,filename):
 sa,sb,doc,bank=loaded(uid)
 complete=verify_package(uid,filename,doc,bank,sa,sb)
 assert complete['lessons_translated']==len(doc['lesson_documents'])
 assert complete['activities_translated']==len(bank['activities'])
 trans=json.loads(filename.read_text(encoding='utf8'))
 catalog_title={l['lesson_id']:l['title'] for c in CAT['courses'] for u in c['units'] for l in u['lessons']}
 originals={x['lesson_id']:x for x in doc['lesson_documents']}
 activities={x['exercise_id']:x for x in bank['activities']}
 fields=0
 for lid,t in trans['lessons'].items():
  orig=originals[lid]
  for a,b in [(catalog_title[lid],t['title']),*zip(orig['objectives'],t['objectives'])]:
   test_pair(a,b,lid);fields+=1
  for i,(o,b) in enumerate(zip(orig['content_blocks'],t['content_blocks'])):
   for k in ('body','alt'):
    if k in b:test_pair(o[k],b[k],lid+':'+k+str(i));fields+=1
   if 'visual_spec' in b:test_pair(o['visual_spec']['title'],b['visual_spec']['title'],lid+':visual');fields+=1
 for aid,t in trans['activities'].items():
  for k,b in t.items():test_pair(activities[aid][k],b,aid+':'+k);fields+=1
 return fields
def negative_controls():
 cases=[
  ('Los números primos son distintos','Els nombres cosins són diferents','primes mistranslated'),
  ('Calcula la mediana de los datos','Calcula la mitjana de les dades','median/mean ambiguity'),
  ('No se resta 4','Es resta 4','negation dropped'),
  ('3x+2=8','3x+2=9','wrong math'),
  ('¿Es función?||No','És funció?Sí','reflection structure dropped'),
  ('Un número vale 3','Un número val 3','Spanish residue')
 ]
 count=0
 for source,target,label in cases:
  try:test_pair(source,target,label)
  except AssertionError:count+=1
  else:raise AssertionError('Unsafe translation accepted '+label)
 return count
def main():
 arg=argparse.ArgumentParser()
 arg.add_argument('--candidate-dir',type=Path)
 arg.add_argument('--units',nargs='*')
 args=arg.parse_args()
 print('NEGATIVE_SEMANTIC_RISK_TESTS_PASS',negative_controls())
 known=[u['unit_id'] for c in CAT['courses'] for u in c['units']]
 if args.candidate_dir:
  files=sorted(args.candidate_dir.glob('*.v1.candidate.json'))
  mapping={p.name.replace('.v1.candidate.json',''):p for p in files}
 else:
  mapping={uid:SITE/'i18n/ca-ES'/(uid+'.v1.json') for uid in known
           if (SITE/'i18n/ca-ES'/(uid+'.v1.json')).exists()}
 if args.units:mapping={uid:mapping[uid] for uid in args.units if uid in mapping}
 passed={};failed={}
 for uid,file in mapping.items():
  assert uid in known,'Unknown unit '+uid
  try:passed[uid]=audit_unit(uid,file)
  except Exception as e:failed[uid]=str(e)
 print('SEMANTIC_RISK_GATE',json.dumps({'pass_units':len(passed),'fail_units':len(failed),
       'fields_checked':sum(passed.values()),'failing':failed},ensure_ascii=False))
 if failed:raise SystemExit(1)
if __name__=='__main__':main()

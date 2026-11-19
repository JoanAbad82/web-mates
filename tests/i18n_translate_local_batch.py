#!/usr/bin/env python3
"""Local-only Catalan draft translator, resumable and fail-closed by canonical unit.

No network requests except loopback Ollama. No external translation, account, or data
collection. This tool only writes candidates outside site/; NEVER publishes a machine draft.
It does NOT linguistically validate a draft. Source es-ES is immutable.
"""
import argparse,json,time,re,urllib.request,sys,hashlib
from pathlib import Path
from i18n_coverage import CAT,SITE,loaded,verify_package,sha
from i18n_math_guard import math_guard
MODEL='qwen2.5-coder:7b'
ROOT=Path(__file__).resolve().parents[1]
STAGE=ROOT.parent.parent/'F4_I18N_MACRO_20261119'/'staging'
STAGE.mkdir(parents=True,exist_ok=True)
PAT=re.compile(r'(?<!\w)[−-]?\d+(?:[.,]\d+)?|[+×÷=<>−%≈≠√²³]|(?<![lL])·|·(?![lL])')
MARK=re.compile(r'<WM_[A-Z]+>')
ES_RE=re.compile(r'[¿¡]|\b(?:fracción|ejercicio|respuesta|enunciado|cuánto|cuántos|porque|sustituye|resta ambos|el valor de|el primer|el segundo|cuál es|¿qué|mientras que|los datos|los números)\b',re.I)
def labels(n):
 for i in range(n):
  k=i;name=''
  while True:
   name=chr(65+k%26)+name;k=k//26-1
   if k<0:break
  yield '<WM_'+name+'>'
def mask(text):
 terms=[]
 names=labels(300)
 def sub(m):
  label=next(names);terms.append((label,m.group(0)));return label
 return PAT.sub(sub,text),terms
def unmask(text,terms):
 got=MARK.findall(text)
 expected=[label for label,value in terms]
 if got!=expected:raise ValueError('mathematical placeholders lost/reordered '+str((got,expected)))
 for label,value in terms:text=text.replace(label,value,1)
 return text
def call_model(masked,model,repair=False):
 prompt=(
  'Ets un corrector i traductor especialitzat en didàctica matemàtica de secundària a Catalunya. '
  'Tradueix els textos del castellà al català estàndard (ca-ES), amb terminologia matemàtica correcta. '
  'Mantén intactes totes les etiquetes del tipus <WM_A> i en el mateix ordre. '
  'No inventis informació, no afegeixis fórmules, no ometis condicions. '
  'Mantén el separador || de les preguntes de reflexió. '
  'Evita castellanismes; escriu un català natural. '
  'Retorna només un objecte JSON vàlid amb la propietat "translations", llista de '
  'cadenes traduïdes en el mateix ordre i quantitat que l’entrada. '
  'Exemples de traducció normativa: "¿Es suficiente?" -> "N’hi ha prou?"; '
  '"para x=2" -> "per a x=2"; "coincidan" -> "coincideixin"; '
  '"explica cómo" -> "explicar com"; "el patrón" -> "el patró". '
  'No barregis castellà i català en una frase. '
  +('ATENCIÓ: la traducció anterior tenia errors; refes-la completament en català correcte. ' if repair else '')
  +'Textos originals: '+json.dumps(masked,ensure_ascii=False)
 )
 data=json.dumps({'model':model,'prompt':prompt,'stream':False,'format':'json',
      'options':{'temperature':0,'num_predict':3000,'num_ctx':8192}}).encode('utf8')
 req=urllib.request.Request('http://127.0.0.1:11434/api/generate',
                           data=data,headers={'Content-Type':'application/json'})
 raw=json.load(urllib.request.urlopen(req,timeout=180))['response']
 obj=json.loads(raw)
 result=obj['translations']
 if not isinstance(result,list) or len(result)!=len(masked):raise ValueError('wrong JSON translation count')
 if not all(isinstance(x,str) for x in result):raise ValueError('non-string generated translation')
 return result
def translate_batch(pairs,model,repair=False):
 originals=[s for s,context in pairs]
 masked=[mask(s) for s in originals]
 responses=call_model([s for s,_ in masked],model,repair)
 output=[]
 for (source,context),(m,terms),result in zip(pairs,masked,responses):
  translated=unmask(result.strip(),terms)
  if not translated or translated==source:raise ValueError('empty or untranslated '+context)
  if translated.count('||')!=source.count('||'):raise ValueError('reflection delimiter changed '+context)
  if ES_RE.search(translated):raise ValueError('Spanish source residue '+context+' '+translated[:110])
  math_guard(source,translated,context)
  output.append(translated)
 return output
def translate_with_retries(pairs,model):
 try:return translate_batch(pairs,model)
 except (ValueError,AssertionError,KeyError,TimeoutError) as e:
  if len(pairs)>1:
   mid=len(pairs)//2
   return translate_with_retries(pairs[:mid],model)+translate_with_retries(pairs[mid:],model)
  source,context=pairs[0]
  try:return translate_batch(pairs,model,repair=True)
  except Exception as e2:raise RuntimeError('Translation rejected for '+context+': '+str(e2)) from e2
def catalog_titles():
 return {l['lesson_id']:l['title']
         for c in CAT['courses'] for u in c['units'] for l in u['lessons']}
TITLES=catalog_titles()
def make(unit,model,deadline):
 a,b,data,bank=loaded(unit)
 source_hash={'data/'+a.name:sha(a),'data/'+b.name:sha(b)}
 cache=STAGE/(unit+'.draft.cache.json')
 if cache.exists():
  state=json.loads(cache.read_text(encoding='utf8'))
  if state['source_files_sha256']!=source_hash:raise AssertionError('Source changed while translation checkpoint exists')
  dictionary=state['translations']
 else:dictionary={}
 expected={}
 for doc in data['lesson_documents']:
  lid=doc['lesson_id']
  fields=[('title',TITLES[lid])]
  fields+= [('objective_'+str(i),v) for i,v in enumerate(doc['objectives'])]
  for i,block in enumerate(doc['content_blocks']):
   fields.append(('body_'+str(i),block['body']))
   if 'alt' in block:fields.append(('alt_'+str(i),block['alt']))
   if 'visual_spec' in block and 'title' in block['visual_spec']:
    fields.append(('visual_'+str(i),block['visual_spec']['title']))
  for k,s in fields:expected[lid+':'+k]=s
 for act in bank['activities']:
  for k in ('prompt','hint','explanation'):expected[act['exercise_id']+':'+k]=act[k]
 # Ensure identical originals in a unit always produce the identical Catalan translation.
 seen={}
 for key,original in expected.items():
  if original not in seen:seen[original]=key
   # Checked below via mapping to first occurrence.
 todo=[(original,key) for original,key in [(s,k) for s,k in seen.items()] if key not in dictionary]
 print('UNIT_BEGIN',unit,'unique_string_count',len(seen),'already_translated',len(dictionary),'pending',len(todo),flush=True)
 for i in range(0,len(todo),5):
  if time.monotonic()>deadline:raise TimeoutError('Processing deadline reached before unit completion')
  part=todo[i:i+5]
  result=translate_with_retries(part,model)
  for (_,key),target in zip(part,result):dictionary[key]=target
  cache.write_text(json.dumps({'unit_id':unit,'source_files_sha256':source_hash,'model':model,
                               'translation_status':'draft_unreviewed',
                               'translations':dictionary},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 def translated(text):return dictionary[seen[text]]
 pack={'schema':'webmates.ca-ES.unit-overlay.v1','version':'1.0.0','locale':'ca-ES',
       'unit_id':unit,'translation_status':'draft_unreviewed','source_files_sha256':source_hash,
       'lessons':{},'activities':{}}
 for doc in data['lesson_documents']:
  lid=doc['lesson_id'];blocks=[]
  for block in doc['content_blocks']:
   content={'body':translated(block['body'])}
   if 'alt' in block:content['alt']=translated(block['alt'])
   if 'visual_spec' in block and 'title' in block['visual_spec']:
    content['visual_spec']={'title':translated(block['visual_spec']['title'])}
   blocks.append(content)
  pack['lessons'][lid]={'title':translated(TITLES[lid]),
      'objectives':[translated(x) for x in doc['objectives']],
      'content_blocks':blocks}
 for act in bank['activities']:
  pack['activities'][act['exercise_id']]={k:translated(act[k]) for k in ('prompt','hint','explanation')}
 dest=SITE/'i18n/ca-ES'/(unit+'.v1.json')
 if dest.exists():raise AssertionError('Refusing to overwrite a published unit package')
 draft=STAGE/(unit+'.candidate.json')
 draft.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 result=verify_package(unit,draft,data,bank,a,b)
 assert result['lessons_translated']==len(data['lesson_documents'])
 assert result['activities_translated']==len(bank['activities'])
 # Never publish raw drafts with obvious Spanish interrogative markers.
 print('UNIT_CANDIDATE_QUARANTINED',unit,'lessons',result['lessons_translated'],
       'activities',result['activities_translated'],'sha256',sha(draft),flush=True)
 return result
def main():
 parser=argparse.ArgumentParser()
 parser.add_argument('--model',default=MODEL)
 parser.add_argument('--max-seconds',type=int,default=420)
 parser.add_argument('--units',nargs='*')
 args=parser.parse_args()
 all_units=[u['unit_id'] for c in CAT['courses'] for u in c['units']]
 prior=args.units if args.units else [u for u in all_units if u.startswith('E1-')]+[u for u in all_units if not u.startswith('E1-')]
 units=[u for u in prior if u in all_units and not (SITE/'i18n/ca-ES'/(u+'.v1.json')).exists()]
 until=time.monotonic()+args.max_seconds
 passed=[];failed={}
 for unit in units:
  if time.monotonic()>=until:break
  try:make(unit,args.model,until);passed.append(unit)
  except TimeoutError as exc:failed[unit]=str(exc);break
  except Exception as exc:
   failed[unit]=str(exc)
   print('UNIT_QUARANTINED',unit,str(exc)[:350],flush=True)
 report={'source_repository':str(ROOT),'model':args.model,'staged_candidates_not_published':passed,
  'quarantined':failed,'published_units_by_script':[],
  'remaining_without_package':units,
  'local_only':True,'translation_status':'draft_unreviewed'}
 path=STAGE/'batch_execution_report.json'
 path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print('BATCH_SUMMARY',json.dumps({'candidates_staged':len(passed),'quarantined':len(failed),
  'not_published':len(report['remaining_without_package'])}),flush=True)
if __name__=='__main__':main()

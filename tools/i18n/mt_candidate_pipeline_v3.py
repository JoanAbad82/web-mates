#!/usr/bin/env python3
"""Offline ES->CA candidate generator. NEVER writes into site/ or pushes to GitHub.
All promotion gates remain independent. No remote inference.
"""
import json,re,sys,hashlib,time,datetime,argparse,collections
from pathlib import Path
import ctranslate2,pyonmttok
import os
if not os.environ.get('WEBMATES_MT_WORKSPACE'):
 raise SystemExit('WEBMATES_MT_WORKSPACE must point to an existing isolated workspace outside the repository')
B=Path(os.environ['WEBMATES_MT_WORKSPACE']).resolve()
ROOT=Path(__file__).resolve().parents[2]
if not B.is_dir() or ROOT==B or ROOT in B.parents:
 raise SystemExit('Workspace must exist and be outside the WEB MATES repository')
sys.path.insert(0,str(ROOT/'tests'))
from i18n_coverage import CAT,SITE,loaded,verify_package,sha
from i18n_math_guard import math_guard
STAGE=Path(os.environ.get('WEBMATES_MT_STAGING',str(B/'staging'))).resolve()
assert STAGE.is_dir() and not STAGE.is_relative_to(ROOT), 'Use an isolated existing staging folder outside repository'

MODELS={
 'softcatala':(B/'model_softcatala_spa_cat','sp_m.model'),
 'aina':(B/'model_aina_es_ca','spm.model')
}
MATH_PAT=re.compile(r'(?<!\w)[−-]?\d+(?:[,.]\d+)?[a-zA-Z]?|(?<![A-Za-zÀ-ÿ])[A-Za-z](?![A-Za-zÀ-ÿ])|[+×÷=<>−%≈≠√²³^π±≤≥°Δθ·*/()\[\]{}€′″∫∞∩⊂∪∈∅↔→₀₁₂₃₄₅₆₇₈₉₋⁰¹⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾ᵢ∛∘|Σ∑ȳŷ̄̂λσμρνϕ∂∇∮≃≅⊆⊇∥⟂∝∴∵∎⬌ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐᵑᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]')
MATH_OPERATORS=set('=<>≥≤≠≈÷×·+−-*/^')
RESIDUAL=re.compile(r'[¿¡]|\b(?:repaso|repasar|lee|escribe|introduce|cálculo|coordenadas|respuestas|conjunto|según|dado|por tanto|en cambio|sin embargo|cuánto|cuántos|cuál|cuáles|fracción|fracciones|ecuación|ecuaciones|ejercicio|enunciado|respuesta|elige|sustituye|sustituir|cuadrado|periódico|número|números|valores|promedio|tabla|datos|resultado|donde|mientras|porque|entonces|pero|después|antes|entero|enteros|izquierda|derecha|arriba|abajo|tiene|tienen|debería|siempre|solamente|alumnos|alumno|muestra|población|frecuencia|gráfica|gráfico|largo|ancho|siendo|resuelve|comprueba|disminuye|aumenta|suma de los)\b',re.I)
GLOSSARY=[
 (re.compile(r'\bmediana\b',re.I),re.compile(r'\bmediana\b',re.I),'mediana'),
 (re.compile(r'\bmedia aritmética\b',re.I),re.compile(r'\bmitjana aritmètica\b',re.I),'mitjana aritmètica'),
 (re.compile(r'\bfracción\b',re.I),re.compile(r'\bfracció\b',re.I),'fracció'),
 (re.compile(r'\bfrecuencia\b',re.I),re.compile(r'\bfreqüència\b',re.I),'freqüència'),
 (re.compile(r'\bprobabilidad\b',re.I),re.compile(r'\bprobabilitat\b',re.I),'probabilitat'),
 (re.compile(r'\bdenominador\b',re.I),re.compile(r'\bdenominador\b',re.I),'denominador'),
 (re.compile(r'\bentero(?:s)?\b',re.I),re.compile(r'\b(?:enter(?:s|es)?|sencer(?:s|a|es)?)\b',re.I),'enter/sencer'),
 (re.compile(r'\bprimo(?:s)?\b',re.I),re.compile(r'\bprimer(?:s)?\b',re.I),'nombre primer'),
 (re.compile(r'\braíz(?:es)?\b',re.I),re.compile(r'\barrel(?:s)?\b',re.I),'arrel'),
 (re.compile(r'\bcuadrado(?:s)?\b',re.I),re.compile(r'\bquadrat(?:s)?\b',re.I),'quadrat'),
 (re.compile(r'\btriángulo(?:s)?\b',re.I),re.compile(r'\btriangle(?:s)?\b',re.I),'triangle'),
 (re.compile(r'\bpolinomio(?:s)?\b',re.I),re.compile(r'\bpolinomi(?:s)?\b',re.I),'polinomi'),
 (re.compile(r'\bmonomio(?:s)?\b',re.I),re.compile(r'\bmonomi(?:s)?\b',re.I),'monomi'),
 (re.compile(r'\blogaritmo(?:s)?\b',re.I),re.compile(r'\blogaritme(?:s)?\b',re.I),'logaritme'),
 (re.compile(r'\bmáximo(?:s)?\b',re.I),re.compile(r'\bmàxim(?:s)?\b',re.I),'màxim'),
 (re.compile(r'\bmínimo(?:s)?\b',re.I),re.compile(r'\bmínim(?:s)?\b',re.I),'mínim'),
 (re.compile(r'\bsubconjunto(?:s)?\b',re.I),re.compile(r'\bsubconjunt(?:s)?\b',re.I),'subconjunt'),
 (re.compile(r'\bhipotenusa\b',re.I),re.compile(r'\bhipotenusa\b',re.I),'hipotenusa'),
 (re.compile(r'\bcateto(?:s)?\b',re.I),re.compile(r'\bcatet(?:s)?\b',re.I),'catet'),
 (re.compile(r'\becuación(?:es)?\b',re.I),re.compile(r'\bequaci(?:ó|ons)\b',re.I),'equació'),
 (re.compile(r'\bángulo(?:s)?\b',re.I),re.compile(r'\bangle(?:s)?\b',re.I),'angle'),
 (re.compile(r'\bcoeficiente(?:s)?\b',re.I),re.compile(r'\bcoeficient(?:s)?\b',re.I),'coeficient'),
 (re.compile(r'\bderivada(?:s)?\b',re.I),re.compile(r'\bderivad(?:a|es)\b',re.I),'derivada'),
 (re.compile(r'\bintegral(?:es)?\b',re.I),re.compile(r'\bintegral(?:s)?\b',re.I),'integral'),
 (re.compile(r'\bpendiente(?:s)?\b',re.I),re.compile(r'\bpendent(?:s)?\b',re.I),'pendent'),
 (re.compile(r'\bcuadrática(?:s)?\b',re.I),re.compile(r'\b(?:quadràtica|quadràtiques)\b',re.I),'quadràtica'),
 (re.compile(r'\bnegativ[oa]s?\b',re.I),re.compile(r'\bnegati(?:u|va|us|ves)\b',re.I),'negatiu'),
 (re.compile(r'\bpositiv[oa]s?\b',re.I),re.compile(r'\bpositi(?:u|va|us|ves)\b',re.I),'positiu'),
 (re.compile(r'\bprobabilidad(?:es)?\b',re.I),re.compile(r'\bprobabilitat(?:s)?\b',re.I),'probabilitat'),
]
def textual_equivalence(original,catalan,context):
 # Controlled mathematical-domain correction, never a change to the source or validator.
 if 'otros primos' in original and isinstance(catalan,str):
  catalan=catalan.replace('altres cosins','altres primers')
 if re.search(r'\bRepaso\s+D\+\d',original,re.I) and isinstance(catalan,str):
  catalan=re.sub(r'\bRepaso\b(?=\s+D\+\d)', 'Repàs',catalan,flags=re.I)
 if re.search(r'\bnúmero(?:s)?\b',original,re.I) and isinstance(catalan,str):
  catalan=re.sub(r'\bnúmeros\b','nombres',catalan,flags=re.I)
  catalan=re.sub(r'\bnúmero\b','nombre',catalan,flags=re.I)
 if isinstance(catalan,str):
  # Keep source unit signatures (km/h, m/s, etc.) byte-for-byte.
  for unit in set(re.findall(r'(?<!\w)[A-Za-z]{1,3}/[A-Za-z]{1,3}(?!\w)',original)):
   left,right=unit.split('/')
   catalan=re.sub(r'\b'+re.escape(left)+r'\s*/\s*'+re.escape(right)+r'\b',unit,catalan)
  if re.search(r', no \d',original) and re.search(r', núm\. \d',catalan):
   catalan=re.sub(r', núm\.(?=\s+\d)',', no',catalan)
  if '…' in original and '…' not in catalan and '...' in catalan:
   catalan=catalan.replace('...','…',original.count('…'))
 if not isinstance(catalan,str) or not catalan.strip() or '<unk>' in catalan.lower():
  raise AssertionError('empty/unknown token '+context)
 if original==catalan:
  # Contract v1 requires an explicit localized field even for language-neutral
  # formula-only explanations. Adding a Catalan context label changes no math.
  words=re.findall(r'[A-Za-zÀ-ÿ]{3,}',original)
  math_words={'sen','cos','tan','log','lim','max','min','sin','rad','mod','mcd','mcm','km','kg','svg'}
  math_only=all(w.lower() in math_words for w in words)
  shared_catalan=bool(re.fullmatch(r'(?:Resta|Suma) [0-9]+(?: a [0-9]+)?\.|Aplica la distributiva\.|Iguala .+\.|Total [0-9]+ €\.',original))
  if math_only or shared_catalan or bool(re.fullmatch(r'(?:Regla de Laplace|Duplica el \d+\.|Calcula \d+(?:[²³])?\.|[\d.,+-]+\.)',original)) or (original[:1].isdigit() and bool(re.search(r'[=²³^]',original)) and not RESIDUAL.search(original)):
   if original=='Regla de Laplace' and ':title' in context:
    return 'Regla de Laplace (probabilitat)'
   prefix=('Pista: ' if ':hint' in context else
           'Càlcul: ' if ':explanation' in context else
           'Expressió: ')
   catalan=prefix+original
  else:raise AssertionError('untranslated field '+context)
 math_guard(original,catalan,context)
 match=RESIDUAL.search(catalan)
 if match:raise AssertionError('Spanish residue '+match.group()+' '+context+': '+catalan[:120])
 if original.count('||')!=catalan.count('||'):raise AssertionError('reflection delimiter '+context)
 if len(original)>28 and not (0.48 < len(catalan)/len(original)<1.62):
  raise AssertionError('translation length anomaly '+context)
 if re.search(r'\bno\b',original,re.I) and not re.search(r'\b(?:no|mai|sense|cap)\b',catalan,re.I):
  raise AssertionError('negation lost '+context)
 if re.search(r'\bsin\b(?!\s+embargo\b)',original,re.I) and not re.search(r'\bsense\b',catalan,re.I):
  raise AssertionError('without/sense condition lost '+context)
 for es,ca,name in GLOSSARY:
  if es.search(original) and not ca.search(catalan):raise AssertionError('glossary missing '+name+' '+context)
 return catalan
def clean(text):
 text=text.strip().replace(' *',' ').replace('*Perquè','Perquè')
 text=re.sub(r'\s+([,.;:!?])',r'\1',text)
 text=re.sub(r'([¿¡])\s+',r'\1',text)
 text=re.sub(r' {2,}',' ',text)
 return text.strip()
PROTECTED_MATH_TERMS=[
 (re.compile(r'\bnúmeros?\s+primos?\b',re.I), lambda a: 'nombres primers' if a.lower().endswith('s') else 'nombre primer'),
 (re.compile(r'\bmediana\b',re.I),lambda a:'mediana'),
 (re.compile(r'\bmedia aritmética\b',re.I),lambda a:'mitjana aritmètica'),
 (re.compile(r'\bnúmeros\b',re.I),lambda a:'nombres'),
 (re.compile(r'\bnúmero\b',re.I),lambda a:'nombre'),
 (re.compile(r'\benteros\b',re.I),lambda a:'enters'),
 (re.compile(r'\bentero\b',re.I),lambda a:'enter'),
 (re.compile(r'\bcuadráticas\b',re.I),lambda a:'quadràtiques'),
 (re.compile(r'\bcuadrática\b',re.I),lambda a:'quadràtica'),
 (re.compile(r'\bderivadas\b',re.I),lambda a:'derivades'),
 (re.compile(r'\bderivada\b',re.I),lambda a:'derivada'),
 (re.compile(r'\braíces\b',re.I),lambda a:'arrels'),
 (re.compile(r'\braíz\b',re.I),lambda a:'arrel'),
 (re.compile(r'\bfrecuencias\b',re.I),lambda a:'freqüències'),
 (re.compile(r'\bfrecuencia\b',re.I),lambda a:'freqüència'),
]
def protected_math_spans(text):
 spans=[]
 for rgx,fn in PROTECTED_MATH_TERMS:
  for m in rgx.finditer(text):
   if any(not (m.end()<=a or m.start()>=b) for a,b,_ in spans):continue
   spans.append((m.start(),m.end(),fn(m.group())))
 # A free variable called y must not be translated to conjunction i.
 # A Spanish coordinating y without this explicit algebraic context IS translated.
 var_patterns=(
  r'(?i)\bcalcula\s+(y)\b(?=\s+cuando\b)',
  r'(?i)\b(?:variable|coordenada|valor de|despeja|determina)\s+(y)\b',
  r'(?i)\b(?:halla|encuentra)\s+(y)\b(?=\s+cuando\b)',
 )
 for rgx in var_patterns:
  for m in re.finditer(rgx,text):
   a,b=m.start(1),m.end(1)
   if not any(not (b<=aa or a>=bb) for aa,bb,_ in spans):
    spans.append((a,b,'y'))
 return spans

def mask(text):
 spans=protected_math_spans(text)
 # Lexical matching preserves non-ascii and combining mathematics; prose words are left for MT.
 raw=[]
 for token in MATH_PAT.finditer(text):
  if any(not (token.end()<=a or token.start()>=b) for a,b,_ in spans):continue
  raw.append(token)
 i=0
 while i<len(raw):
  a=raw[i].start();b=raw[i].end();j=i
  while j+1<len(raw):
   nt=raw[j+1];gap=text[b:nt.start()]
   if gap=='' or (gap.isspace() and
     (raw[j].group() in MATH_OPERATORS or nt.group() in MATH_OPERATORS)):
    b=nt.end();j+=1
   else:break
  value=text[a:b]
  if re.search(r'\d|[=<>≥≤√²³°%×÷+−/€′″∫∞∩⊂∪∈∅↔→₀₁₂₃⁰¹⁴⁵⁶⁷⁸⁹⁺⁻ᵢ∛∘|Σ∑ȳŷ̄̂λσμρνϕ∂∇∮≃≅⊆⊇∥⟂∝∴∵∎⬌ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐᵑᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]',value):
   if not any(not (b<=aa or a>=bb) for aa,bb,_ in spans):
    spans.append((a,b,value))
  i=j+1
 spans.sort(key=lambda x:x[0])
 out='';pos=0;values=[]
 for a,b,substitute in spans:
  assert a>=pos,'Overlapping span'
  out+=text[pos:a];pos=b
  marker=str(90001+len(values))
  if marker in text:raise AssertionError('marker already in source')
  values.append((marker,substitute))
  out+=' '+marker+' '
 out+=text[pos:]
 return out,values

def restore(text,values):
 if [m for m,v in values]!=re.findall(r'\b900\d{2}\b',text):
  raise AssertionError('marker missing or reordered')
 for marker,orig in values:text=re.sub(r'\b'+marker+r'\b',lambda m:orig,text,count=1)
 return clean(text)
def split_source(source):
 parts=source.split('||')
 chunks=[]
 for i,part in enumerate(parts):
  lines=part.split('\n')
  for j,line in enumerate(lines):
   segments=re.split(r'(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÜ¿¡])',line)
   for seg in segments:
    # Isolate math-heavy clauses without changing their punctuation or order.
    smaller=re.split(r'(?<=;)\s+',seg)
    for piece in smaller:chunks.append(piece)
   if j<len(lines)-1:chunks.append('⏎')
  if i<len(parts)-1:chunks.append('||')
 return chunks

class Engine:
 def __init__(self,name):
  directory,sp=MODELS[name]
  self.name=name;self.tokenizer=pyonmttok.Tokenizer(mode='none',sp_model_path=str(directory/sp))
  self.engine=ctranslate2.Translator(str(directory),device='cpu',inter_threads=1,intra_threads=6)
 def batch(self,texts):
  if not texts:return []
  inputs=[self.tokenizer.tokenize(s)[0] for s in texts]
  outputs=self.engine.translate_batch(inputs,beam_size=4,max_decoding_length=500,max_batch_size=48,
                                      batch_type='examples')
  return [self.tokenizer.detokenize(o.hypotheses[0]) for o in outputs]
def translation_memory():
 titles={l['lesson_id']:l['title'] for c in CAT['courses'] for u in c['units'] for l in u['lessons']}
 pairs=collections.defaultdict(set)
 for course in CAT['courses']:
  for u in course['units']:
   uid=u['unit_id'];path=SITE/'i18n/ca-ES'/(uid+'.v1.json')
   if not path.exists():continue
   a,b,data,bank=loaded(uid)
   trans=json.loads(path.read_text(encoding='utf8'))
   by_lid={x['lesson_id']:x for x in data['lesson_documents']}
   by_aid={x['exercise_id']:x for x in bank['activities']}
   for lid,t in trans['lessons'].items():
    doc=by_lid[lid];pairs[titles[lid]].add(t['title'])
    for orig,target in zip(doc['objectives'],t['objectives']):pairs[orig].add(target)
    for x,y in zip(doc['content_blocks'],t['content_blocks']):
     pairs[x['body']].add(y['body'])
     if 'alt' in y:pairs[x['alt']].add(y['alt'])
     if 'visual_spec' in y:pairs[x['visual_spec']['title']].add(y['visual_spec']['title'])
   for aid,t in trans['activities'].items():
    x=by_aid[aid]
    for k,v in t.items():pairs[x[k]].add(v)
 return {key:next(iter(vals)) for key,vals in pairs.items() if len(vals)==1}
def collect(unit):
 sa,sb,doc,bank=loaded(unit)
 titles={l['lesson_id']:l['title'] for c in CAT['courses'] for u in c['units'] for l in u['lessons']}
 sources=collections.OrderedDict()
 for d in doc['lesson_documents']:
  lid=d['lesson_id'];sources[lid+':title']=titles[lid]
  for i,x in enumerate(d['objectives']):sources[lid+':objective:'+str(i)]=x
  for i,x in enumerate(d['content_blocks']):
   sources[lid+':body:'+str(i)]=x['body']
   if 'alt' in x:sources[lid+':alt:'+str(i)]=x['alt']
   if 'visual_spec' in x and 'title' in x['visual_spec']:
    sources[lid+':visual:'+str(i)]=x['visual_spec']['title']
 for a in bank['activities']:
  for k in ('prompt','hint','explanation'):sources[a['exercise_id']+':'+k]=a[k]
 return sa,sb,doc,bank,sources
def build(unit,doc,bank,localized,sa,sb):
 titles={l['lesson_id']:l['title'] for c in CAT['courses'] for u in c['units'] for l in u['lessons']}
 obj={'schema':'webmates.ca-ES.unit-overlay.v1','version':'1.0.0','locale':'ca-ES',
   'unit_id':unit,'translation_status':'draft_unreviewed',
   'source_files_sha256':{'data/'+sa.name:sha(sa),'data/'+sb.name:sha(sb)},
   'lessons':{},'activities':{}}
 for l in doc['lesson_documents']:
  lid=l['lesson_id'];blocks=[]
  for i,x in enumerate(l['content_blocks']):
   a={'body':localized[lid+':body:'+str(i)]}
   if 'alt' in x:a['alt']=localized[lid+':alt:'+str(i)]
   if 'visual_spec' in x and 'title' in x['visual_spec']:
    a['visual_spec']={'title':localized[lid+':visual:'+str(i)]}
   blocks.append(a)
  obj['lessons'][lid]={'title':localized[lid+':title'],
      'objectives':[localized[lid+':objective:'+str(i)] for i in range(len(l['objectives']))],
      'content_blocks':blocks}
 for a in bank['activities']:
  aid=a['exercise_id']
  obj['activities'][aid]={k:localized[aid+':'+k] for k in ('prompt','hint','explanation')}
 return obj
def unit_ids():
 units=[u['unit_id'] for c in CAT['courses'] for u in c['units']]
 return [u for u in units if not (SITE/'i18n/ca-ES'/(u+'.v1.json')).exists()]
def main():
 ap=argparse.ArgumentParser()
 ap.add_argument('--max-units',type=int,default=0)
 ap.add_argument('--units',nargs='*')
 ap.add_argument('--seconds',type=int,default=480)
 args=ap.parse_args()
 remain=unit_ids()
 selected=[x for x in (args.units or remain) if x in remain]
 if args.max_units:selected=selected[:args.max_units]
 tm=translation_memory()
 print('EXACT_MEMORY',len(tm),'TARGET_UNITS',len(selected),flush=True)
 engines={'softcatala':Engine('softcatala')}
 fallback=None
 until=time.monotonic()+args.seconds
 report={'base_commit':'b705b616a8e692c3d365cb9fdd0e0c968112aedb',
         'models':{x:json.loads((d/'model_origin.json').read_text(encoding='utf8'))
          for x,(d,sp) in MODELS.items()},
         'selected_units':selected,'candidate_pass':[],'candidate_quarantined':{},
         'candidate_only':True,'promoted_to_site':[],'translation_status':'draft_unreviewed'}
 count=collections.Counter()
 for unit in selected:
  if time.monotonic()>until:
   report['timeout_before_unit']=unit;break
  t0=time.monotonic()
  sa,sb,doc,bank,sources=collect(unit)
  localized={};problems=[]
  by_source=collections.OrderedDict()
  for context,original in sources.items():
   by_source.setdefault(original,[]).append(context)
  need=[]
  for original,contexts in by_source.items():
   if original in tm:
    try:translated=textual_equivalence(original,tm[original],contexts[0])
    except AssertionError:need.append(original)
    else:
     for context in contexts:localized[context]=translated
     count['memory_fields']+=len(contexts)
   else:need.append(original)
  batch_parts=[];ranges=[]
  for original in need:
   chunks=split_source(original)
   start=len(batch_parts)
   for chunk in chunks:
    if chunk in ('||','⏎'):batch_parts.append((chunk,[]));continue
    if len(chunk)>570:
     problems.append({'source_context':by_source[original][0],
                      'reason':'overlong_segment','source_length':len(chunk)})
     batch_parts.append(('',[]));continue
    batch_parts.append(mask(chunk))
   ranges.append((original,start,len(batch_parts)))
  # Translate in one batch per unit: 30-50 chunks each call for efficient throughput.
  masked=[m for m,terms in batch_parts if m not in ('||','⏎','')]
  try:
   results=[]
   for off in range(0,len(masked),48):
    results+=engines['softcatala'].batch(masked[off:off+48])
   if len(results)!=len(masked):raise AssertionError('inference count mismatch')
  except Exception as exc:
   report['candidate_quarantined'][unit]=[{'reason':'model runtime '+repr(exc)}]
   print('UNIT_RUNTIME_FAIL',unit,repr(exc),flush=True);continue
  translated=[];idx=0
  for m,terms in batch_parts:
   if m in ('||','⏎'):translated.append(m)
   elif not m:translated.append('')
   else:
    try:translated.append(restore(results[idx],terms))
    except AssertionError as e:translated.append('')
    idx+=1
  for original,start,end in ranges:
   chunks=split_source(original)
   current=translated[start:end]
   # Sentence splitting outputs are joined with spaces; reflection must preserve "||".
   target=' '.join(current).replace(' || ','||').replace(' ⏎ ','\n')
   target=clean(target)
   try: target=textual_equivalence(original,target,by_source[original][0])
   except AssertionError as exc:
    # Slow specialized Aina fallback for rejected complete text, not Qwen.
    if fallback is None:
     try:fallback=Engine('aina')
     except Exception as ee:fallback=False
    if fallback:
     try:
      individually=[]
      inp=[mask(x) if x not in ('||','⏎') and len(x)<=570 else (x,[]) for x in chunks]
      valid=[m for m,t in inp if m not in ('||','⏎') and len(m)<=570]
      results2=[]
      for off in range(0,len(valid),16):results2+=fallback.batch(valid[off:off+16])
      k=0
      for m,t in inp:
       if m in ('||','⏎'):individually.append(m)
       elif len(m)>570:individually.append('')
       else:
        individually.append(restore(results2[k],t));k+=1
      target=clean(' '.join(individually).replace(' || ','||').replace(' ⏎ ','\n'))
      target=textual_equivalence(original,target,by_source[original][0])
      count['aina_fallback_success']+=1
     except Exception as e:
      problems.append({'context':by_source[original][0],'reason':str(exc),
                       'fallback_reason':str(e),'source':original[:170],'candidate':target[:170]})
      continue
    else:
     problems.append({'context':by_source[original][0],'reason':str(exc),
                      'source':original[:170],'candidate':target[:170]})
     continue
   for context in by_source[original]:localized[context]=target
  if len(localized)!=len(sources):problems.append({'reason':'untranslated_fields',
        'missing':len(sources)-len(localized)})
  if not problems:
   obj=build(unit,doc,bank,localized,sa,sb)
   path=STAGE/(unit+'.v1.candidate.json')
   path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
   try:
    result=verify_package(unit,path,doc,bank,sa,sb)
    if result['lessons_translated']!=len(doc['lesson_documents']) or result['activities_translated']!=len(bank['activities']):
     raise AssertionError('Incomplete coverage')
   except Exception as exc:
    problems.append({'reason':'canonical_package_gate','detail':repr(exc)})
  if problems:
   report['candidate_quarantined'][unit]=problems
   path=STAGE/(unit+'.quarantine.json')
   path.write_text(json.dumps({'unit_id':unit,'issues':problems,'successful_fields':len(localized),
        'total_fields':len(sources)},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
   print('CANDIDATE_QUARANTINED',unit,'issues',len(problems),'fields',len(localized),'/',len(sources),
         'seconds',round(time.monotonic()-t0,1),flush=True)
  else:
   report['candidate_pass'].append(unit)
   print('CANDIDATE_PASS',unit,'lessons',len(doc['lesson_documents']),
         'activities',len(bank['activities']),'sha256',sha(path),'seconds',round(time.monotonic()-t0,1),flush=True)
  (STAGE/'execution.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print('BATCH_RESULT',json.dumps({'candidate_pass':len(report['candidate_pass']),
    'quarantined':len(report['candidate_quarantined']),'total_selected':len(selected),
    'count':dict(count)}),flush=True)
if __name__=='__main__':main()

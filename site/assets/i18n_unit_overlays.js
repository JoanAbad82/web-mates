// Unit-level ca-ES text-only draft overlays: canonical es-ES data never modified.
// Only text properties are read; answers, choices, validators and IDs never overwritten.
export const localizedLessonIds=new Set();
const strings=new Map();
const loaded=new Set();
const pending=new Map();
let registryPromise=null;
let redraw=()=>{};
const permittedLessonKeys=new Set(['title','objectives','content_blocks']);
const permittedBlockKeys=new Set(['body','alt','visual_spec']);
const permittedActivityKeys=new Set(['prompt','hint','explanation']);
const exactly=(keys,allowed)=>keys.every(k=>allowed.has(k));
function merge(dict,source,target){
 if(typeof source!=='string'||typeof target!=='string'||!target.trim())throw Error('Invalid localized text');
 if(dict.has(source)&&dict.get(source)!==target)throw Error('Conflicting ca-ES translation within unit');
 dict.set(source,target);
}
export function translateUnitText(value){
 const raw=String(value);
 const parts=location.hash.slice(1).split('/').filter(Boolean);
 const unitId=parts[0]==='curso'&&parts[2]==='unidad'?parts[3]:null;
 const dict=strings.get(unitId);
 if(!dict)return raw;
 if(dict.has(raw))return dict.get(raw);
 // Source rendering sometimes prefixes numbered objectives or explanatory messages.
 const pieces=[...dict].filter(([src])=>src.length>=18&&raw.includes(src));
 if(!pieces.length)return raw;
 pieces.sort((a,b)=>b[0].length-a[0].length);
 let updated=raw;
 for(const [src,target] of pieces)updated=updated.split(src).join(target);
 return updated;
}
export function configureRedraw(fn){redraw=fn;}
async function manifest(){
 if(!registryPromise){
  registryPromise=fetch('./i18n/ca-ES/manifest.v1.json').then(async r=>{
   if(!r.ok)throw Error('Missing ca-ES manifest');
   const x=await r.json();
   if(x.schema!=='webmates.ca-ES.manifest.v1'||x.units.length!==85)throw Error('Invalid locale manifest');
   return {counts:x.counts, packages:new Map(x.units.filter(u=>u.package).map(u=>[u.unit_id,u.package]))};
  });
 }
 return registryPromise;
}
async function loadUnit(unitId){
 if(loaded.has(unitId))return false;
 const m=await manifest();
 const name=m.packages.get(unitId);
 if(!name)return false;
 if(!/^[A-Z0-9-]+\.v1\.json$/.test(name)||name.split('.')[0]!==unitId)throw Error('Unsafe translation package path');
 const url='./i18n/ca-ES/'+name;
 const file=await fetch(url);
 if(!file.ok)throw Error('Translation package missing '+unitId);
 const p=await file.json();
 if(p.schema!=='webmates.ca-ES.unit-overlay.v1'||p.unit_id!==unitId||p.locale!=='ca-ES'||
    p.translation_status!=='draft_unreviewed')throw Error('Unsupported translation package');
 const key=unitId.toLowerCase().replaceAll('-','_');
 const prefix=unitId==='E3-A02'?'f1_':'f3_';
 const [a,b]=await Promise.all([
   fetch('./data/'+prefix+key+'.json').then(r=>{if(!r.ok)throw Error('Missing canonical unit');return r.json()}),
   fetch('./data/'+prefix+key+'_exercises.json').then(r=>{if(!r.ok)throw Error('Missing canonical activities');return r.json()})
 ]);
 if(a.unit_id!==unitId||b.unit_id!==unitId)throw Error('Canonical unit mismatch');
 const unitStrings=new Map();
 const lessons=new Map(a.lesson_documents.map(d=>[d.lesson_id,d]));
 const acts=new Map(b.activities.map(x=>[x.exercise_id,x]));
 for(const [lid,translated] of Object.entries(p.lessons)){
  const doc=lessons.get(lid);
  if(!doc||!exactly(Object.keys(translated),permittedLessonKeys)||
      !Array.isArray(translated.objectives)||!Array.isArray(translated.content_blocks)||
      translated.objectives.length!==doc.objectives.length||
      translated.content_blocks.length!==doc.content_blocks.length)throw Error('Invalid ca-ES lesson overlay');
  const catalog=await catalogPromise;
  const originalTitle=catalog.get(lid);
  if(!originalTitle)throw Error('Missing canonical lesson title');
  merge(unitStrings,originalTitle,translated.title);
  doc.objectives.forEach((v,i)=>merge(unitStrings,v,translated.objectives[i]));
  doc.content_blocks.forEach((block,i)=>{
   const t=translated.content_blocks[i];
   if(!exactly(Object.keys(t),permittedBlockKeys)||!('body' in t))throw Error('Unexpected translation block key');
   merge(unitStrings,block.body,t.body);
   if(t.alt!==undefined){if(!block.alt)throw Error('Unexpected translation alt');merge(unitStrings,block.alt,t.alt);}
   if(t.visual_spec!==undefined){
    if(!block.visual_spec||!exactly(Object.keys(t.visual_spec),new Set(['title'])))throw Error('Unexpected visual override');
    merge(unitStrings,block.visual_spec.title,t.visual_spec.title);
   }
  });
  const expected=doc.exercise_refs||[];
  if(expected.length&&expected.every(x=>p.activities[x]&&Object.keys(p.activities[x]).length===3))
    localizedLessonIds.add(lid);
 }
 for(const [aid,t] of Object.entries(p.activities)){
  const x=acts.get(aid);
  if(!x||!exactly(Object.keys(t),permittedActivityKeys)||
      Object.keys(t).length!==3||!p.lessons[x.lesson_id])throw Error('Invalid activity translation');
  for(const k of permittedActivityKeys)merge(unitStrings,x[k],t[k]);
 }
 strings.set(unitId,unitStrings);
 loaded.add(unitId);redraw();
 return true;
}
let catalogPromise=Promise.resolve(new Map());
export function setCanonicalLessonTitles(catalog){
 catalogPromise=Promise.resolve(new Map(catalog.courses.flatMap(c=>
   c.units.flatMap(u=>u.lessons.map(l=>[l.lesson_id,l.title])))));
}
export function ensureUnitOverlay(unitId,locale='ca'){
 if(locale!=='ca')return Promise.resolve(false);
 if(loaded.has(unitId))return Promise.resolve(false);
 if(pending.has(unitId))return pending.get(unitId);
 const task=loadUnit(unitId).finally(()=>pending.delete(unitId));
 pending.set(unitId,task);
 return task;
}
export function loadLocaleManifest(){return manifest();}

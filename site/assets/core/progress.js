import {advanceReview,dayKey,dueItems,addCalendarDays,REVIEW_POLICY_VERSION} from './scheduler.js';
// F4-SEC: consentimiento explícito; v1 y v2 solo se guardan en este navegador.
// Los nombres de clave :v1 se mantienen por compatibilidad y borrado; v2 es versión del JSON.
export const STATE_VERSION='2.0.0';
export const RETENTION_POLICY_VERSION='f4-retention-v1.0.0';
export const RETENTION_DAYS=37; // D+30 máximo + siete días de margen editorial.
const LEGACY_VERSION='1.0.0';
export function keysForUnit(unitId){
 if(typeof unitId!=='string'||!/^[A-Za-z0-9_-]{3,90}$/.test(unitId))throw new TypeError('ID de unidad inválido');
 return Object.freeze({consent:'webmates:f2:'+unitId+':consent:v1',data:'webmates:f2:'+unitId+':state:v1'});
}
export const CONSENT_KEY=keysForUnit('E3-A02').consent;
export const DATA_KEY=keysForUnit('E3-A02').data;
const MAX_STATES=3000,MAX_BYTES=2_000_000;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const DATE_FORMAT=/^\d{4}-\d{2}-\d{2}$/;
const SAFE_ID=/^[A-Za-z0-9][A-Za-z0-9_:\-]{1,90}$/;
const blank=()=>Object.create(null);
const validDay=(value)=>{
 if(typeof value!=='string'||!DATE_FORMAT.test(value))return false;
 try{return addCalendarDays(value,0)===value;}catch(_){return false;}
};
const expiry=(day)=>addCalendarDays(day,RETENTION_DAYS);
function recordValid(v,id,latestDay){
 if(!v||typeof v!=='object'||Array.isArray(v)||v.exercise_id!==id||
   !SAFE_ID.test(v.lesson_id??'')||!SAFE_ID.test(v.concept_id??'')||
   !validDay(v.last_day)||!validDay(v.next_due)||
   v.last_day>latestDay||v.next_due>addCalendarDays(v.last_day,30)||
   !Number.isInteger(v.streak)||v.streak<0||v.streak>5||
   !Number.isInteger(v.attempt_count)||v.attempt_count<0||v.attempt_count>100000||
   typeof v.last_correct!=='boolean'||typeof v.last_assisted!=='boolean'||
   !Array.isArray(v.error_codes)||v.error_codes.length>3||
   !v.error_codes.every(x=>typeof x==='string'&&x.length<=80))return false;
 return true;
}
function decodeSnapshot(s,allowed,unitId,today){
 if(!s||typeof s!=='object'||Array.isArray(s)||
   ![STATE_VERSION,LEGACY_VERSION].includes(s.schema_version)||
   s.review_policy_version!==REVIEW_POLICY_VERSION||s.unit_id!==unitId||
   !s.items||typeof s.items!=='object'||Array.isArray(s.items))throw new Error('Esquema incompatible');
 const entries=Object.entries(s.items);
 if(entries.length>MAX_STATES)throw new Error('Demasiados registros');
 const latest=addCalendarDays(today,1); // reloj local: tolerancia máxima un día futuro.
 for(const [id,v] of entries){
   if(!allowed.has(id)||!recordValid(v,id,latest))throw new Error('Datos incompatibles o fechas inválidas');
 }
 let lastActivity,consentDay;
 const isLegacy=s.schema_version===LEGACY_VERSION;
 if(isLegacy){
   // v1 no guardaba fecha de consentimiento: solo se migran intentos fechados.
   if(!entries.length)throw new Error('Consentimiento v1 sin datos fechados');
   lastActivity=entries.map(([,v])=>v.last_day).sort().at(-1);
   consentDay=lastActivity; // estimación conservadora, sin inventar fecha de opt-in.
 }else{
   if(s.retention_policy_version!==RETENTION_POLICY_VERSION||
      !validDay(s.last_activity_day)||!validDay(s.consent_day)||
      s.last_activity_day>latest||s.consent_day>latest||
      s.last_activity_day<s.consent_day||
      entries.some(([,v])=>v.last_day>s.last_activity_day))throw new Error('Metadatos de conservación incompatibles');
   lastActivity=s.last_activity_day;
   consentDay=s.consent_day;
 }
 const kept=blank(),expired=[];
 for(const [id,v] of entries){
   if(today>expiry(v.last_day))expired.push(id);
   else kept[id]={
     exercise_id:v.exercise_id,lesson_id:v.lesson_id,concept_id:v.concept_id,
     last_day:v.last_day,next_due:v.next_due,streak:v.streak,
     attempt_count:v.attempt_count,last_correct:v.last_correct,
     last_assisted:v.last_assisted,error_codes:[...v.error_codes]
   };
 }
 return {kept,expired,consentDay,lastActivity,isLegacy,
   fullyExpired:today>expiry(lastActivity)};
}
export function createProgressStore({storage=null,allowedIds=[],unitId='E3-A02',now=()=>new Date()}={}){
 const allowed=new Set(allowedIds),items=blank(),keys=keysForUnit(unitId);
 let enabled=false,warning='',consentDay=null,lastActivity=null;
 const today=()=>dayKey(now());
 const snapshot=()=>({schema_version:STATE_VERSION,review_policy_version:REVIEW_POLICY_VERSION,
   retention_policy_version:RETENTION_POLICY_VERSION,unit_id:unitId,
   consent_day:consentDay,last_activity_day:lastActivity,items:{...items}});
 const clearMemory=()=>{for(const k of Object.keys(items))delete items[k];};
 function removeOwn(){
   if(!storage)return true;
   let ok=true;
   for(const key of [keys.data,keys.consent]){
     try{storage.removeItem(key);}catch(_){ok=false;}
   }
   return ok;
 }
 function writeSnapshot(){
   if(!enabled||!storage)return false;
   try{
     if(storage.getItem(keys.consent)!=='yes'){
       enabled=false;
       warning='El permiso de guardado fue retirado en otra pestaña. No se han escrito datos.';
       return false;
     }
     const data=JSON.stringify(snapshot());
     if(data.length>MAX_BYTES)throw new Error('Límite de almacenamiento');
     storage.setItem(keys.data,data);
     return true;
   }catch(_){
     enabled=false;
     warning='No se pudo guardar el estado local. El repaso continúa en memoria.';
     // No afirmar un opt-in válido si el archivo no puede escribirse.
     try{storage.removeItem(keys.consent);}catch(_){}
     return false;
   }
 }
 function expireNow(){
   const t=today();
   const expired=Object.keys(items).filter(k=>t>expiry(items[k].last_day));
   for(const k of expired)delete items[k];
   if(enabled&&lastActivity&&t>expiry(lastActivity)){
     enabled=false;clearMemory();
     const ok=removeOwn();
     consentDay=null;lastActivity=null;
     warning=ok?'El progreso local ha caducado tras 37 días sin actividad. Puedes volver a activar el guardado.':
       'El progreso ha caducado, pero no se confirmó el borrado. Elimínalo desde los datos del sitio.';
     return true;
   }
   if(expired.length&&enabled&&!writeSnapshot())warning='No se pudo guardar el borrado de registros caducados.';
   return expired.length>0;
 }
 // Restauración: no se ejecutan respuestas almacenadas, no se importan esquemas desconocidos.
 try{
   if(storage&&storage.getItem(keys.consent)==='yes'){
     const raw=storage.getItem(keys.data);
     if(!raw||raw.length>MAX_BYTES)throw new Error('Historial v1 sin fecha o demasiado grande');
     const result=decodeSnapshot(JSON.parse(raw),allowed,unitId,today());
     if(result.fullyExpired){
       const ok=removeOwn();
       warning=ok?'El progreso local caducó y se borró. El guardado requiere nueva autorización.':
         'El progreso caducó, pero el borrado no se pudo confirmar.';
     }else{
       consentDay=result.consentDay;lastActivity=result.lastActivity;
       Object.assign(items,result.kept);
       enabled=true;
       if((result.isLegacy||result.expired.length)&&!writeSnapshot()){
         enabled=false;clearMemory();consentDay=null;lastActivity=null;
         warning='No se pudo completar la migración o limpieza; no se importó el progreso. Puedes borrarlo manualmente.';
       }else if(result.isLegacy||result.expired.length){
         warning=result.isLegacy?'Historial anterior migrado y registros caducados descartados.':
           'Se eliminaron registros de ejercicios caducados.';
       }
     }
   }
 }catch(_){
   enabled=false;clearMemory();consentDay=null;lastActivity=null;
   warning='Historial local incompatible o sin fecha verificable; no se ha importado. Puedes borrarlo o volver a activar el guardado.';
   // Consentimiento huérfano: si no existe historial, eliminar solo estas dos claves.
   try{
     if(storage&&storage.getItem(keys.data)===null&&removeOwn())
       warning='El permiso antiguo no tenía historial fechado y se descartó. Puedes volver a activar el guardado.';
   }catch(_){}
 }
 return Object.freeze({
   get enabled(){expireNow();return enabled;},
   get warning(){return warning;},
   get count(){expireNow();return Object.keys(items).length;},
   getStates(){expireNow();return {...items};},
   snapshot(){expireNow();return JSON.parse(JSON.stringify(snapshot()));},
   get(id){expireNow();return own(items,id)?{...items[id]}:null;},
   due(date=today()){expireNow();return dueItems(items,date);},
   optIn(){
     expireNow();
     if(enabled)return true;
     if(!storage){warning='Este navegador no permite el guardado local.';return false;}
     try{
       // Conservar la práctica de esta sesión, descartando solo los ítems caducados.
       for(const k of Object.keys(items)){if(today()>expiry(items[k].last_day))delete items[k];}
       consentDay=today();lastActivity=consentDay;
       storage.setItem(keys.consent,'yes');
       enabled=true;
       if(!writeSnapshot())throw new Error('No se pudo escribir el estado');
       warning='';return true;
     }catch(_){
       enabled=false;consentDay=null;lastActivity=null;
       warning='No se ha podido activar el guardado. Solo se usa memoria temporal.';
       removeOwn();return false;
     }
   },
   record(item,event,date=today()){
     expireNow();
     if(!item||!allowed.has(item.exercise_id))throw new Error('ID de ejercicio no autorizado');
     if(!validDay(date)||date>addCalendarDays(today(),1))throw new RangeError('Fecha de intento inválida');
     const updated=advanceReview(items[item.exercise_id]??null,event,date);
     items[item.exercise_id]=updated;
     if(enabled){
       lastActivity=lastActivity&&lastActivity>date?lastActivity:date;
       writeSnapshot();
     }
     return {...updated};
   },
   clear(){
     clearMemory();
     try{storage?.removeItem(keys.data);}catch(_){
       warning='No se pudo borrar el archivo local de progreso.';return false;
     }
     // El consentimiento v1 se conserva hasta optOut, pero sin snapshot se pedirá nuevo opt-in al reiniciar.
     warning='';return true;
   },
   optOut(){
     enabled=false;clearMemory();consentDay=null;lastActivity=null;
     const ok=removeOwn();
     warning=ok?'':'El navegador no confirmó el borrado: comprueba los datos del sitio.';
     return ok;
   }
 });
}

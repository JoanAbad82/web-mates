import {validateAnswer} from './validator.js';
import {diagnose,remediation} from './diagnostics.js';
import {createProgressStore} from './progress.js';
import {dayKey,REVIEW_POLICY_VERSION} from './scheduler.js';
// F2 — motor reutilizable; las respuestas completas nunca se guardan.
export const ENGINE_VERSION='1.0.0';
export function createExerciseEngine({activities,docs=[],storage=null,unitId='E3-A02',now=()=>new Date()}={}){
 if(!Array.isArray(activities)||!activities.length)throw new TypeError('Actividades requeridas');
 // Conservar copia canónica interna: el llamante no puede alterar solución, tipo o tolerancia.
 const byId=new Map(activities.map(x=>{
   const answer=Array.isArray(x.answer)?Object.freeze([...x.answer]):x.answer;
   const choices=Array.isArray(x.choices)?Object.freeze([...x.choices]):x.choices;
   const misconception_codes=Array.isArray(x.misconception_codes)?Object.freeze([...x.misconception_codes]):x.misconception_codes;
   const canonical=Object.freeze({...x,answer,choices,misconception_codes});
   return [canonical.exercise_id,canonical];
 }));
 if(byId.size!==activities.length)throw new Error('IDs duplicados');
 const lessons=new Map(docs.map(x=>[x.lesson_id,x]));
 const progress=createProgressStore({storage,allowedIds:[...byId.keys()],unitId,now});
 const session=new Map();
 const pendingAssistance=new Set();
 const get=(id)=>session.get(id)||{tries:0,hadError:false,helpUsed:false,lastCorrect:false};
 function assist(item){
   if(!byId.has(item?.exercise_id))return false;
   pendingAssistance.add(item.exercise_id);
   return true;
 }
 function submit(item,raw,{hintUsed=false,solutionViewed=false}={}){
   const canonical=byId.get(item?.exercise_id);
   if(!canonical||item?.lesson_id!==canonical.lesson_id)throw new Error('Ejercicio fuera del banco autorizado');
   const verdict=validateAnswer(canonical,raw);
   const diagnostic=diagnose(canonical,verdict,lessons.get(canonical.lesson_id));
   if(!verdict.valid)return {...verdict,diagnostic,repair:remediation(diagnostic),recorded:false};
   const before=get(canonical.exercise_id);
   const helped=Boolean(pendingAssistance.has(canonical.exercise_id)||hintUsed||solutionViewed);
   pendingAssistance.delete(canonical.exercise_id);
   session.set(canonical.exercise_id,{
     tries:before.tries+1,hadError:before.hadError||!verdict.correct,
     helpUsed:helped,lastCorrect:verdict.correct
   });
   const evidence={
     exercise_id:canonical.exercise_id,
     lesson_id:canonical.lesson_id,
     correct:verdict.correct,
     hint_used:helped,
     attempted_at:now().toISOString(),
     review_policy_version:REVIEW_POLICY_VERSION,
     error_codes:diagnostic.errorCodes
   };
   const state=progress.record(canonical,{...evidence,concept_id:lessons.get(canonical.lesson_id)?.concept_ids?.[0]||canonical.lesson_id},dayKey(now()));
   return {...verdict,diagnostic,repair:remediation(diagnostic),recorded:true,
     state,evidence};
 }
 const sessionErrors=()=>[...byId.values()].filter(a=>get(a.exercise_id).hadError);
 const due=()=>progress.due(dayKey(now())).map(x=>byId.get(x.exercise_id)).filter(Boolean);
 function reviewDeck(fallback=[]){
   const dueItems=due();
   if(dueItems.length)return {items:dueItems,kind:'due'};
   const errors=sessionErrors();
   if(errors.length)return {items:errors,kind:'errors'};
   return {items:fallback,kind:'mixed'};
 }
 return Object.freeze({
   unitId,progress,assist,submit,reviewDeck,sessionErrors,due,
   sessionState:id=>({...get(id)}),
   resetSession:()=>{session.clear();pendingAssistance.clear();},
   getItem:id=>byId.get(id)||null,
   metadata:{engineVersion:ENGINE_VERSION,policyVersion:REVIEW_POLICY_VERSION}
 });
}

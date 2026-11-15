// F2 — diagnóstico prudente. Un resultado incorrecto no demuestra una causa concreta.
export const DIAGNOSTIC_VERSION='1.0.0';
export function diagnose(item,verdict,lesson=null){
 if(!verdict.valid){
   return Object.freeze({category:'formato',errorCodes:['formato'],possibleCauses:[],
     prerequisiteIds:[],message:'Revisa el formato de la respuesta.'});
 }
 if(verdict.correct){
   return Object.freeze({category:'ninguno',errorCodes:[],possibleCauses:[],
     prerequisiteIds:[],message:'Respuesta correcta.'});
 }
 const possibleCauses=Array.isArray(item?.misconception_codes)?
   item.misconception_codes.filter(x=>typeof x==='string').slice(0,3):[];
 const prerequisiteIds=Array.isArray(lesson?.prerequisites)?
   lesson.prerequisites.filter(x=>typeof x==='string').slice(0,4):[];
 return Object.freeze({
   category:'resultado_no_coincide',
   errorCodes:['resultado_no_coincide'],
   possibleCauses,
   prerequisiteIds,
   message:'La respuesta no coincide. Revisa operaciones y comprueba sustituyendo en el enunciado.'
 });
}
export function remediation(diagnostic){
 if(diagnostic.category==='formato')return {kind:'formato',text:'Consulta el ejemplo de formato; no se ha contado como error matemático.'};
 if(diagnostic.category==='resultado_no_coincide'){
   const id=diagnostic.prerequisiteIds[0]??null;
   return {kind:'posible_refuerzo',lessonId:id,
     text:id?('Si este procedimiento te cuesta, puedes repasar '+id+'. No se ha diagnosticado una causa específica.'):'Revisa un ejemplo guiado y comprueba tu cálculo.'};
 }
 return {kind:'ninguno',text:''};
}

// F2 — política determinista y orientativa: D+1, D+3, D+7, D+14, D+30.
// La cadencia es una elección editorial experimental, NO una eficacia garantizada.
export const REVIEW_POLICY_VERSION='f2-spaced-v1.0.0';
export const REVIEW_INTERVALS=Object.freeze([1,3,7,14,30]);
const DAY_RE=/^\d{4}-\d{2}-\d{2}$/;
export function dayKey(date=new Date()){
 if(!(date instanceof Date)||!Number.isFinite(date.getTime()))throw new TypeError('Fecha inválida');
 return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}
export function addCalendarDays(day,count){
 if(!DAY_RE.test(day)||!Number.isInteger(count)||count<0||count>365)throw new RangeError('Día/intervalo inválido');
 const [y,m,d]=day.split('-').map(Number);
 const origin=new Date(Date.UTC(y,m-1,d));
 if(origin.toISOString().slice(0,10)!==day)throw new RangeError('Día inexistente');
 origin.setUTCDate(origin.getUTCDate()+count);
 return origin.toISOString().slice(0,10);
}
export function isDue(state,day=dayKey()){
 return Boolean(state&&DAY_RE.test(state.next_due||'')&&state.next_due<=day);
}
function safeInt(n){return Number.isSafeInteger(n)&&n>=0?n:0;}
export function advanceReview(previous, event, date=dayKey()){
 if(!event||typeof event.correct!=='boolean'||typeof event.hint_used!=='boolean')throw new TypeError('Evidencia inválida');
 if(!DAY_RE.test(date))throw new TypeError('Día de intento inválido');
 const assisted=event.hint_used===true;
 const prevStreak=Math.min(5,safeInt(previous?.streak));
 let streak=prevStreak, nextDue=previous?.next_due??null;
 if(!event.correct||assisted){
   streak=0;
   nextDue=addCalendarDays(date,1);
 }else if(!previous||!nextDue||date>=nextDue){
   // Nunca avanzar niveles por repetir varias veces el mismo día antes del vencimiento.
   streak=Math.min(5,prevStreak+1);
   nextDue=addCalendarDays(date,REVIEW_INTERVALS[streak-1]);
 }
 return Object.freeze({
   exercise_id:event.exercise_id,
   lesson_id:event.lesson_id,
   concept_id:event.concept_id,
   last_day:date,
   next_due:nextDue,
   streak,
   attempt_count:Math.min(100000,safeInt(previous?.attempt_count)+1),
   last_correct:event.correct,
   last_assisted:assisted,
   error_codes:event.correct?[]:(Array.isArray(event.error_codes)?event.error_codes.slice(0,3):[])
 });
}
export function dueItems(states,day=dayKey()){
 return Object.values(states??{}).filter(x=>isDue(x,day))
   .sort((a,b)=>a.next_due.localeCompare(b.next_due)||a.exercise_id.localeCompare(b.exercise_id));
}

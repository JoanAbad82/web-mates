// F2 — validador numérico puro. Sin eval, sin red, sin almacenamiento.
// Contrato F2-Validator 1.0.0; los tipos no soportados fallan en cerrado.
const SCALAR=/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;
const FRACTION=/^[+-]?\d+\/[1-9]\d*$/;
export const VALIDATOR_VERSION='1.0.0';
export function parseScalar(input){
 const s=String(input??'').trim().replace(/\u2212/g,'-');
 if(!s||s.length>40)return null;
 if(FRACTION.test(s)){
   const [n,d]=s.split('/').map(Number),value=n/d;
   return Number.isFinite(value)?value:null;
 }
 if(!SCALAR.test(s))return null;
 const value=Number(s.replace(',','.'));
 return Number.isFinite(value)?value:null;
}
export function parseRoots(raw){
 const s=String(raw??'').trim();
 if(!s||s.length>90)return null;
 const parts=s.includes(';')?s.split(';'):s.split(',');
 if(parts.length!==2)return null;
 const parsed=parts.map(parseScalar);
 return parsed.every(x=>x!==null)?parsed.sort((a,b)=>a-b):null;
}
export function validateAnswer(item,raw){
 if(!item||!['numeric','roots','choice'].includes(item.type)){
   return {valid:false,correct:false,reason:'tipo'};
 }
 if(item.type==='choice'){
   if(typeof raw!=='string'||!Array.isArray(item.choices)||!item.choices.includes(raw))
     return {valid:false,correct:false,reason:'formato'};
   return {valid:true,correct:raw===item.answer};
 }
 const tolerance=Number.isFinite(item.tolerance)&&item.tolerance>=0?item.tolerance:1e-9;
 if(item.type==='numeric'){
   const value=parseScalar(raw);
   if(value===null)return {valid:false,correct:false,reason:'formato'};
   return {valid:true,correct:typeof item.answer==='number'&&Math.abs(value-item.answer)<=tolerance};
 }
 const values=parseRoots(raw);
 if(!values)return {valid:false,correct:false,reason:'formato'};
 const expected=Array.isArray(item.answer)?[...item.answer].sort((a,b)=>a-b):[];
 return {valid:true,correct:expected.length===2&&expected.every((e,i)=>Number.isFinite(e)&&Math.abs(values[i]-e)<=tolerance)};
}

// F3 ola 3 — puntos cartesianos e intervalos, SVG estático y tabla HTML accesible.
// Solo datos declarativos del contenido editorial. Sin código de estudiante ni servicios remotos.
const NS='http://www.w3.org/2000/svg';
function elem(tag,text){const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);return e;}
const sv=tag=>document.createElementNS(NS,tag);
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const present=x=>Number.isInteger(x)?String(x):String(Number(x.toFixed(3)));
function line(svg,x1,y1,x2,y2,color,width=1.5){
 const l=sv('line');for(const [k,v] of Object.entries({x1,y1,x2,y2}))l.setAttribute(k,String(v));
 l.setAttribute('stroke',color);l.setAttribute('stroke-width',String(width));svg.append(l);return l;
}
function mark(svg,x,y,r,color,filled=true){
 const c=sv('circle');c.setAttribute('cx',String(x));c.setAttribute('cy',String(y));
 c.setAttribute('r',String(r));c.setAttribute('stroke',color);c.setAttribute('stroke-width','2.6');
 c.setAttribute('fill',filled?color:'#102538');svg.append(c);
}
function text(svg,x,y,label,anchor='middle'){
 const n=sv('text');n.setAttribute('x',String(x));n.setAttribute('y',String(y));
 n.setAttribute('text-anchor',anchor);n.setAttribute('font-size','12');
 n.setAttribute('fill','#d9e8f6');n.textContent=String(label);svg.append(n);
}
function table(headers,rows,caption){
 const t=elem('table');t.className='f3-graph-table';t.append(elem('caption',caption));
 const h=elem('thead'),tr=elem('tr');
 for(const col of headers){const th=elem('th',col);th.scope='col';tr.append(th)}h.append(tr);
 const b=elem('tbody');for(const values of rows){const r=elem('tr');for(const value of values)r.append(elem('td',value));b.append(r);}
 t.append(h,b);return t;
}
function shell(alt,title,height=214){
 const wrap=elem('figure');wrap.className='f3-function-graph f3-concept-visual';
 const svg=sv('svg');svg.setAttribute('viewBox','0 0 320 '+height);
 svg.setAttribute('width','320');svg.setAttribute('height',String(height));svg.setAttribute('role','img');
 svg.setAttribute('aria-label',alt||title);svg.setAttribute('class','f3-graph-svg');
 wrap.append(svg,elem('figcaption',title||alt));return {wrap,svg};
}
function plotPoints(spec,alt){
 const pts=spec.points;
 if(!Array.isArray(pts)||pts.length<2||pts.length>16||
   !pts.every(p=>Array.isArray(p)&&p.length===2&&p.every(finite)))return null;
 const {wrap,svg}=shell(alt,spec.title||'Puntos ordenados');
 const xmin=Math.min(0,...pts.map(x=>x[0]))-1,xmax=Math.max(0,...pts.map(x=>x[0]))+1;
 const ymin=Math.min(0,...pts.map(x=>x[1]))-1,ymax=Math.max(0,...pts.map(x=>x[1]))+1;
 const px=x=>38+(x-xmin)/(xmax-xmin)*264,py=y=>180-(y-ymin)/(ymax-ymin)*155;
 line(svg,38,py(0),302,py(0),'#9cbaca');line(svg,px(0),23,px(0),180,'#9cbaca');
 text(svg,300,py(0)-6,'x','end');text(svg,px(0)+9,30,'y','start');
 for(const [x,y] of pts){mark(svg,px(x),py(y),3.8,'#ffca75');}
 text(svg,px(0),199,'0');text(svg,44,209,'x: '+present(xmin),'start');
 text(svg,297,209,present(xmax),'end');
 wrap.append(table(['Coordenada x','Coordenada y'],pts.map(p=>[present(p[0]),present(p[1])]),
  'Tabla de pares ordenados (alternativa a los puntos del plano)'));
 return wrap;
}
function compare(x,op,threshold){
 switch(op){case '<':return x<threshold;case '<=':return x<=threshold;
 case '>':return x>threshold;case '>=':return x>=threshold;default:return false;}
}
function numberLine(spec,alt){
 if(!finite(spec.threshold)||!['<','<=','>','>=','between'].includes(spec.operator))return null;
 if(spec.operator==='between'&&(!finite(spec.upper)||spec.upper<=spec.threshold))return null;
 const a=spec.threshold,b=spec.operator==='between'?spec.upper:a;
 const left=a-2,right=b+2;
 const px=x=>28+(x-left)/(right-left)*264;
 const {wrap,svg}=shell(alt,spec.title||'Intervalo de valores',140);
 const y=63,color='#74d6ff';
 line(svg,28,y,292,y,'#a0b9cc',2);
 const arrow=sv('path');arrow.setAttribute('d','M 292 63 L 283 59 L 283 67 Z');arrow.setAttribute('fill','#a0b9cc');svg.append(arrow);
 const from=spec.operator==='<'||spec.operator==='<='?28:px(a);
 const to=spec.operator==='>'||spec.operator==='>='?292:px(b);
 line(svg,from,y,to,y,color,5);
 const loInc=spec.operator==='between'?Boolean(spec.lower_inclusive):spec.operator==='<='||spec.operator==='>=';
 mark(svg,px(a),y,5.5,color,loInc);
 if(spec.operator==='between')mark(svg,px(b),y,5.5,color,Boolean(spec.upper_inclusive));
 text(svg,px(a),92,present(a));if(spec.operator==='between')text(svg,px(b),92,present(b));
 text(svg,27,112,present(left),'start');text(svg,293,112,present(right),'end');
 let sample=[a-1,a,a+1,b,b+1];
 if(spec.operator==='between')sample=[a-1,a,a+1,b-1,b,b+1];
 sample=[...new Set(sample)].sort((u,v)=>u-v);
 const respects=x=>{
  let match=spec.operator==='between'?
    ((spec.lower_inclusive?x>=a:x>a)&&(spec.upper_inclusive?x<=b:x<b)):
    compare(x,spec.operator,a);
  if(spec.domain==='integers')match=match&&Number.isInteger(x);
  if(spec.domain==='nonnegative_integer')match=match&&Number.isInteger(x)&&x>=0;
  return match;
 };
 wrap.append(table(['Número','¿Pertenece a la solución?'],sample.map(x=>[present(x),respects(x)?'Sí':'No']),
    'Tabla de pertenencia (alternativa al intervalo de la recta)'));
 return wrap;
}
export function renderConceptVisual(spec,alt){
 if(!spec||typeof spec!=='object')return null;
 if(spec.kind==='point_plot')return plotPoints(spec,alt);
 if(spec.kind==='number_line')return numberLine(spec,alt);
 return null;
}

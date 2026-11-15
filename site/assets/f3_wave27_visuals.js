// WEB MATES F3-27: local, deterministic visuals with accessible exact HTML tables.
// No eval, no external assets, no runtime scripts derived from student input.
import {renderWave25InferenceVisual} from './f3_wave25_inference.js';
const NS='http://www.w3.org/2000/svg';
const P={bg:'#16394f',light:'#d5e9f4',accent:'#ffcf95',green:'#a6e8b9',muted:'#9dc1d5'};
function elem(tag,value){
 const e=document.createElement(tag);
 if(value!==undefined)e.textContent=String(value);
 return e;
}
function snode(parent,tag,attrs={},value){
 const e=document.createElementNS(NS,tag);
 for(const [name,v] of Object.entries(attrs))e.setAttribute(name,String(v));
 if(value!==undefined)e.textContent=String(value);
 parent.append(e);return e;
}
function line(svg,x1,y1,x2,y2,color=P.light,weight=1.5){
 snode(svg,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':weight,'stroke-linecap':'round'});
}
function text(svg,x,y,t,color=P.light,size=11){
 snode(svg,'text',{x,y,fill:color,'text-anchor':'middle','font-size':size},t);
}
function circle(svg,cx,cy,r,color=P.green){
 snode(svg,'circle',{cx,cy,r,fill:color,stroke:P.light,'stroke-width':1});
}
function drawPowers(svg,spec){
 const vs=spec.model.values;
 if(!vs.length||vs.some(v=>!Number.isFinite(v)||Math.abs(v)>30))return false;
 const min=Math.min(...vs),max=Math.max(...vs),span=Math.max(1,max-min);
 line(svg,31,127,290,127,P.light,2);
 for(let i=0;i<vs.length;i++){
  const x=40+240*(vs[i]-min)/span;
  line(svg,x,119,x,136,P.accent,2);
  circle(svg,x,127,5,P.green);
  text(svg,x,100,String(spec.model.labels[i]).slice(0,13),P.accent,11);
  text(svg,x,158,'n='+vs[i],P.light,10);
 }
 text(svg,160,199,'Eje lineal en el exponente n de 10^n',P.muted,10);
 text(svg,160,218,'No es escala lineal de las magnitudes',P.muted,10);
 return true;
}
function drawSimilarity(svg,spec){
 const a=spec.model.values;
 if(a.length!==2||a.some(v=>!Number.isFinite(v)||v<=0))return false;
 const max=Math.max(...a);
 for(let i=0;i<2;i++){
  const x=30+i*149,w=100*a[i]/max,h=98*a[i]/max,y=175;
  snode(svg,'polygon',{points:x+','+y+' '+(x+w)+','+y+' '+(x+w/2)+','+(y-h),
   fill:'none',stroke:i?P.green:P.accent,'stroke-width':2.5});
  line(svg,x,y,x+w,y,i?P.green:P.accent,3);
  text(svg,x+w/2,y+20,spec.model.labels[i]+' = '+a[i],P.light,10);
  text(svg,x+w/2,y-h-12,i?'Imagen semejante':'Figura inicial',P.muted,10);
 }
 text(svg,160,220,'Base y altura escaladas con la misma razón',P.muted,10);
 return true;
}
function drawTransform(svg,spec){
 const a=spec.model.values;
 if(a.length!==4||a.some(v=>!Number.isFinite(v)||Math.abs(v)>6))return false;
 const map=(x,y)=>[160+17*x,115-17*y];
 for(let i=-5;i<=5;i++){
  line(svg,160+17*i,24,160+17*i,199,P.muted,.4);
  line(svg,68,115+17*i,251,115+17*i,P.muted,.4);
 }
 line(svg,68,115,252,115,P.light,2);
 line(svg,160,24,160,201,P.light,2);
 const [sx,sy]=map(a[0],a[1]),[ex,ey]=map(a[2],a[3]);
 line(svg,sx,sy,ex,ey,P.accent,2);
 circle(svg,sx,sy,5,P.green);circle(svg,ex,ey,6,P.accent);
 text(svg,sx+2,sy-12,'P('+a[0]+','+a[1]+')',P.green,10);
 text(svg,ex-4,ey+19,"P'("+a[2]+','+a[3]+')',P.accent,10);
 text(svg,160,224,'Coordenadas cartesianas; transformación en tabla',P.muted,10);
 return true;
}
function drawSolid(svg,spec){
 const [r,h]=spec.model.values;
 if(!Number.isFinite(r)||!Number.isFinite(h)||r<=0||h<=0)return false;
 const cx=160,top=70,bot=175,rx=48,ry=16;
 snode(svg,'ellipse',{cx,cy:top,rx,ry,fill:'none',stroke:P.green,'stroke-width':2.5});
 line(svg,cx-rx,top,cx-rx,bot,P.light,2.5);
 line(svg,cx+rx,top,cx+rx,bot,P.light,2.5);
 snode(svg,'path',{d:'M '+(cx-rx)+' '+bot+' A '+rx+' '+ry+' 0 0 0 '+(cx+rx)+' '+bot,fill:'none',stroke:P.green,'stroke-width':2.5});
 snode(svg,'path',{d:'M '+(cx-rx)+' '+bot+' A '+rx+' '+ry+' 0 0 1 '+(cx+rx)+' '+bot,fill:'none',stroke:P.muted,'stroke-dasharray':'4 4'});
 line(svg,cx,top,cx+rx,top,P.accent,2);
 text(svg,cx+29,top-7,'r='+r,P.accent,11);
 text(svg,cx+75,120,'h='+h,P.light,12);
 text(svg,160,217,'Cilindro recto ideal: V=πr²h',P.muted,11);
 return true;
}
function tabulate(figure,spec){
 const t=elem('table');t.className='f3-data-table';
 t.append(elem('caption','Datos exactos y advertencias · '+spec.title));
 const head=elem('thead'),h=elem('tr');
 for(const x of ['Magnitud / supuesto','Valor / condición']){
  const cell=elem('th',x);cell.scope='col';h.append(cell);
 }
 head.append(h);t.append(head);
 const body=elem('tbody');
 for(const [name,val] of spec.rows){
  const tr=elem('tr'),th=elem('th',name);th.scope='row';
  tr.append(th,elem('td',val));body.append(tr);
 }
 t.append(body);figure.append(t);
}
export function renderWave27Visual(spec,alt){
 if(!spec||spec.render_family!=='wave27'||!spec.model||!Array.isArray(spec.model.labels)||
 !Array.isArray(spec.model.values)||spec.model.labels.length!==spec.model.values.length||
 !Array.isArray(spec.rows)||spec.rows.length<3||spec.rows.length>12||
 !spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(x=>typeof x==='string'))||
 typeof spec.title!=='string')return null;
 if(['bars','normal'].includes(spec.kind)){
  const prior=renderWave25InferenceVisual({...spec,render_family:'wave25'},alt);
  if(prior){prior.classList.add('f3-wave27');prior.setAttribute('data-wave','27');}
  return prior;
 }
 const fn={powers:drawPowers,similarity:drawSimilarity,transform:drawTransform,solid:drawSolid}[spec.kind];
 if(!fn)return null;
 const f=elem('figure');f.className='f3-function-graph f3-wave27';
 const svg=document.createElementNS(NS,'svg');
 svg.setAttribute('viewBox','0 0 320 235');
 svg.setAttribute('role','img');svg.setAttribute('class','f3-graph-svg');
 svg.setAttribute('aria-label',alt||spec.title);
 snode(svg,'rect',{x:0,y:0,width:320,height:235,rx:8,fill:P.bg});
 if(!fn(svg,spec))return null;
 f.append(svg,elem('figcaption',spec.title));
 tabulate(f,spec);
 return f;
}

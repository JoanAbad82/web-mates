// F3-29: deterministic local vector/finance diagrams + exact accessible tables.
// No execution of learner inputs, network requests or third-party assets.
const NS='http://www.w3.org/2000/svg';
const C={bg:'#163a50',axis:'#d8eaf5',muted:'#adc9d9',point:'#b4f0bb',accent:'#ffd09d'};
function html(tag,value){const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);return n;}
function el(s,tag,attrs={},value){
 const n=document.createElementNS(NS,tag);
 for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));
 if(value!==undefined)n.textContent=String(value);
 s.append(n);return n;
}
function line(s,x1,y1,x2,y2,color=C.axis,width=2,dash){
 const at={x1,y1,x2,y2,stroke:color,'stroke-width':width,'stroke-linecap':'round'};
 if(dash)at['stroke-dasharray']=dash;
 return el(s,'line',at);
}
function text(s,x,y,value,color=C.axis,size=10){
 return el(s,'text',{x,y,fill:color,'font-size':size,'text-anchor':'middle'},value);
}
function circle(s,x,y,color=C.point,r=5){return el(s,'circle',{cx:x,cy:y,r,fill:color,stroke:C.axis,'stroke-width':1});}
function axes(s){
 line(s,155,145,267,172,C.axis,1.8);
 line(s,155,145,69,180,C.axis,1.8);
 line(s,155,145,155,24,C.axis,1.8);
 text(s,280,176,'x',C.axis,12);text(s,59,190,'y',C.axis,12);text(s,155,17,'z',C.axis,12);
}
function project(x,y,z,k){return [155+20*k*x-12*k*y,145+6*k*x+5*k*y-22*k*z];}
function plotVectors(s,spec){
 const a=spec.model.values;
 if(a.length!==6||a.some(x=>!Number.isFinite(x)))return false;
 axes(s);
 const scale=1/Math.max(1,Math.max(...a.map(Math.abs))/4);
 for(let n=0;n<2;n++){
  const vals=a.slice(n*3,n*3+3),p=project(...vals,scale);
  line(s,155,145,p[0],p[1],n===0?C.point:C.accent,3);
  circle(s,p[0],p[1],n===0?C.point:C.accent,5);
  text(s,p[0]+17,p[1]-10,n===0?'u':'v',n===0?C.point:C.accent,12);
 }
 text(s,160,211,'Proyección isométrica ilustrativa de vectores R³',C.muted,10);
 text(s,160,225,'Coordenadas exactas en tabla; no medir ángulos del dibujo',C.muted,9);
 return true;
}
function plane(s,x,y,color){
 const pts=x+','+y+' '+(x+92)+','+(y+17)+' '+(x+142)+','+(y-11)+' '+(x+50)+','+(y-28);
 el(s,'polygon',{points:pts,fill:'none',stroke:color,'stroke-width':2.5});
}
function plotPointPlane(s,spec){
 const v=spec.model.values;
 if(v.length!==3||v.some(x=>!Number.isFinite(x)))return false;
 plane(s,85,165,C.axis);
 circle(s,169,70,C.point,6);line(s,169,70,169,146,C.accent,2.5,'5 4');
 circle(s,169,146,C.accent,4);
 text(s,193,64,'P',C.point,12);text(s,216,119,'distancia',C.accent,10);
 text(s,160,210,'Pie perpendicular representado esquemáticamente',C.muted,10);
 text(s,160,224,'Plano y punto exactos en tabla, dibujo no a escala',C.muted,9);
 return true;
}
function plotPlanes(s,spec){
 const a=spec.model.values;
 if(a.length!==2||a.some(x=>!Number.isFinite(x)))return false;
 plane(s,84,174,C.axis);plane(s,84,110,C.point);
 line(s,163,96,163,161,C.accent,2.4,'5 4');
 text(s,220,130,'distancia normal',C.accent,10);
 text(s,160,210,'Dos planos paralelos esquemáticos',C.muted,11);
 text(s,160,226,'La separación exacta y condiciones están en tabla',C.muted,9);
 return true;
}
function plotProjection(s,spec){
 const v=spec.model.values;
 if(v.length!==3||v.some(x=>!Number.isFinite(x)))return false;
 axes(s);
 const k=1/Math.max(1,Math.max(...v.map(Math.abs))/4);
 const q=project(...v,k),foot=project(v[0],0,0,k);
 line(s,155,145,q[0],q[1],C.point,3);line(s,155,145,foot[0],foot[1],C.accent,3);
 line(s,q[0],q[1],foot[0],foot[1],C.axis,2,'4 3');
 circle(s,q[0],q[1],C.point,5);circle(s,foot[0],foot[1],C.accent,5);
 text(s,q[0]+16,q[1]-9,'v',C.point,12);text(s,foot[0]+13,foot[1]+14,'proy',C.accent,10);
 text(s,160,210,'Componente sobre eje x y residual',C.muted,10);
 text(s,160,225,'Componentes exactas y verificación en tabla',C.muted,9);
 return true;
}
function plotFinance(s,spec){
 const a=spec.model.values;
 if(a.length<2||a.length>6||a.some(v=>!Number.isFinite(v)||v<0))return false;
 const lo=Math.min(...a),hi=Math.max(...a),span=Math.max(.01,hi-lo);
 const xs=a.map((_,i)=>45+i*230/Math.max(1,a.length-1));
 const ys=a.map(v=>175-100*(v-lo)/span);
 line(s,35,29,35,191,C.axis,1.7);line(s,35,191,289,191,C.axis,1.7);
 for(let i=0;i<a.length;i++){
  if(i>0)line(s,xs[i-1],ys[i-1],xs[i],ys[i],C.accent,2.5);
  circle(s,xs[i],ys[i],C.point,5);
  const label=String(spec.model.labels[i]);
  text(s,xs[i],212,label.length>12?label.slice(0,11)+'…':label,C.muted,9);
  text(s,xs[i],Math.max(17,ys[i]-11),String(Math.round(a[i]*10000)/10000),C.accent,10);
 }
 text(s,160,230,'Datos sintéticos; eje de periodos o escenarios',C.muted,10);
 return true;
}
function table(fig,spec){
 const t=html('table');t.className='f3-data-table';
 t.append(html('caption','Datos, supuestos y valores de referencia · '+spec.title));
 const head=html('thead'),row=html('tr');
 for(const title of ['Magnitud / condición','Valor / límite']){
  const th=html('th',title);th.scope='col';row.append(th);
 }
 head.append(row);t.append(head);
 const body=html('tbody');
 for(const [label,value]of spec.rows){
  const tr=html('tr'),th=html('th',label);th.scope='row';tr.append(th,html('td',value));body.append(tr);
 }
 t.append(body);fig.append(t);
}
export function renderWave29Visual(spec,alt){
 if(!spec||spec.render_family!=='wave29'||!spec.model||
 !Array.isArray(spec.model.labels)||!Array.isArray(spec.model.values)||
 spec.model.labels.length!==spec.model.values.length||!Array.isArray(spec.rows)||
 spec.rows.length<3||spec.rows.length>12||
 !spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(v=>typeof v==='string'))||
 typeof spec.title!=='string')return null;
 const draw={vectors3d:plotVectors,pointplane:plotPointPlane,
 parallelplanes:plotPlanes,projection3d:plotProjection,finance:plotFinance}[spec.kind];
 if(!draw)return null;
 const f=html('figure');f.className='f3-function-graph f3-wave29';
 const svg=document.createElementNS(NS,'svg');
 svg.setAttribute('viewBox','0 0 320 240');
 svg.setAttribute('class','f3-graph-svg');svg.setAttribute('role','img');
 svg.setAttribute('aria-label',alt||spec.title);
 el(svg,'rect',{x:0,y:0,width:320,height:240,rx:8,fill:C.bg});
 if(!draw(svg,spec))return null;
 f.append(svg,html('figcaption',spec.title));table(f,spec);return f;
}

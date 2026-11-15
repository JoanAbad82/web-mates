// WEB MATES F3-28 · deterministic, local SVG with accessible HTML table.
// Input is static, versioned lesson data. Never execute student expressions.
import {renderWave27Visual} from './f3_wave27_visuals.js';
const NS='http://www.w3.org/2000/svg';
const K={bg:'#183c50',axis:'#daeaf4',accent:'#ffc894',point:'#b5efbe',muted:'#a6c4d5'};
function html(tag,val){const e=document.createElement(tag);if(val!==undefined)e.textContent=String(val);return e;}
function svgEl(svg,tag,attributes={},value){
 const e=document.createElementNS(NS,tag);
 for(const [k,v]of Object.entries(attributes))e.setAttribute(k,String(v));
 if(value!==undefined)e.textContent=String(value);svg.append(e);return e;
}
function line(g,x1,y1,x2,y2,color=K.axis,w=2){
 svgEl(g,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':w,'stroke-linecap':'round'});
}
function txt(g,x,y,value,color=K.axis,size=11){
 svgEl(g,'text',{x,y,fill:color,'font-size':size,'text-anchor':'middle'},value);
}
function pt(g,x,y,color=K.point,r=5){svgEl(g,'circle',{cx:x,cy:y,r,fill:color,stroke:K.axis,'stroke-width':1});}
function numberline(g,sp){
 const a=sp.model.values;
 if(!a.length||a.length>8||a.some(x=>!Number.isFinite(x)))return false;
 const min=Math.min(...a),max=Math.max(...a),span=Math.max(.0001,max-min),x=v=>39+242*(v-min)/span;
 line(g,26,122,296,122,K.axis,2.3);
 svgEl(g,'polygon',{points:'296,122 288,118 288,126',fill:K.axis});
 for(let i=0;i<a.length;i++){
  const px=x(a[i]);line(g,px,116,px,128,K.accent,2);pt(g,px,122,K.point,4);
  txt(g,px,102,sp.model.labels[i],K.accent,10);
  txt(g,px,151,String(Number(a[i].toFixed(3))),K.axis,9);
 }
 txt(g,160,193,'Puntos de referencia, no intervalos sombreados',K.muted,10);
 txt(g,160,212,'Inclusión de extremos: consultar tabla',K.muted,10);
 return true;
}
function plane(g,sp){
 const a=sp.model.values;
 if(a.length!==2||a.some(x=>!Number.isFinite(x)||Math.abs(x)>50))return false;
 const lim=Math.max(5,Math.ceil(Math.max(Math.abs(a[0]),Math.abs(a[1]))+1));
 const s=76/lim,orig=[155,118],map=(x,y)=>[orig[0]+s*x,orig[1]-s*y];
 for(let k=-4;k<=4;k++){line(g,orig[0]+k*17,36,orig[0]+k*17,205,K.muted,.35);line(g,75,orig[1]+k*17,237,orig[1]+k*17,K.muted,.35);}
 line(g,73,118,239,118,K.axis,2);line(g,155,34,155,205,K.axis,2);
 const [x,y]=map(a[0],a[1]);line(g,orig[0],orig[1],x,y,K.accent,2.7);
 pt(g,x,y,K.point,6);txt(g,Math.min(286,Math.max(36,x+24)),Math.max(22,y-12),'('+a[0]+','+a[1]+')',K.accent,11);
 txt(g,160,224,'Ejes cartesianos; valores exactos en tabla',K.muted,10);
 return true;
}
function triangle(g,sp){
 const a=sp.model.values;
 if(a.length!==2||a.some(v=>!Number.isFinite(v)||v<=0))return false;
 const max=Math.max(...a),dx=150*a[0]/max,dy=117*a[1]/max,bx=60,by=180;
 const verts=bx+','+by+' '+(bx+dx)+','+by+' '+bx+','+(by-dy);
 svgEl(g,'polygon',{points:verts,fill:'none',stroke:K.point,'stroke-width':2.5});
 line(g,bx,by,bx+17,by,K.accent,1.5);line(g,bx+17,by,bx+17,by-17,K.accent,1.5);line(g,bx+17,by-17,bx,by-17,K.accent,1.5);
 txt(g,bx+dx/2,by+21,sp.model.labels[0]+' = '+a[0],K.accent,10);
 txt(g,bx-13,by-dy/2,sp.model.labels[1]+' = '+a[1],K.accent,10);
 txt(g,160,220,'Lados perpendiculares, proporciones ilustrativas',K.muted,10);
 return true;
}
function tabular(f,sp){
 const t=html('table');t.className='f3-data-table';
 t.append(html('caption','Datos exactos, símbolos y condiciones · '+sp.title));
 const thead=html('thead'),h=html('tr');
 for(const v of ['Magnitud / condición','Resultado o supuesto']){const th=html('th',v);th.scope='col';h.append(th);}
 thead.append(h);t.append(thead);
 const body=html('tbody');
 for(const [label,val] of sp.rows){const tr=html('tr'),th=html('th',label);th.scope='row';tr.append(th,html('td',val));body.append(tr);}
 t.append(body);f.append(t);
}
export function renderWave28Visual(spec,alt){
 if(!spec||spec.render_family!=='wave28'||!spec.model||!Array.isArray(spec.model.labels)||
 !Array.isArray(spec.model.values)||spec.model.labels.length!==spec.model.values.length||
 !Array.isArray(spec.rows)||spec.rows.length<3||spec.rows.length>12||
 !spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(v=>typeof v==='string'))||
 typeof spec.title!=='string')return null;
 if(['bars','powers'].includes(spec.kind)){
  const f=renderWave27Visual({...spec,render_family:'wave27'},alt);
  if(f){f.classList.add('f3-wave28');f.setAttribute('data-wave','28');}
  return f;
 }
 const draw={numberline,plane,triangle}[spec.kind];
 if(!draw)return null;
 const f=html('figure');f.className='f3-function-graph f3-wave28';
 const svg=document.createElementNS(NS,'svg');
 svg.setAttribute('viewBox','0 0 320 235');
 svg.setAttribute('class','f3-graph-svg');svg.setAttribute('role','img');svg.setAttribute('aria-label',alt||spec.title);
 svgEl(svg,'rect',{x:0,y:0,width:320,height:235,rx:8,fill:K.bg});
 if(!draw(svg,spec))return null;
 f.append(svg,html('figcaption',spec.title));tabular(f,spec);return f;
}

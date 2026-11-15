// WEB MATES F3-25. Visuales declarativos y tablas semánticas: sin eval ni red.
// El SVG es solo apoyo visual; los datos exactos y las advertencias están en HTML.
const NS='http://www.w3.org/2000/svg';
const COLORS={bg:'#16394f',line:'#c6dfed',bars:'#a2e6ba',accent:'#ffcb8d',muted:'#8eb4c9'};
const el=(name,txt)=>{const e=document.createElement(name);if(txt!==undefined)e.textContent=String(txt);return e;};
function svgNode(parent,tag,attrs={},txt){
  const e=document.createElementNS(NS,tag);
  for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
  if(txt!==undefined)e.textContent=String(txt);
  parent.append(e);return e;
}
function line(svg,x1,y1,x2,y2,stroke=COLORS.line,width=1.5){
  return svgNode(svg,'line',{x1,y1,x2,y2,stroke,'stroke-width':width,'stroke-linecap':'round'});
}
function caption(svg,x,y,txt,color=COLORS.line,size=11){
  return svgNode(svg,'text',{x,y,fill:color,'font-size':size,'text-anchor':'middle'},txt);
}
function drawBars(svg,m){
  const count=m.values.length,hi=Math.max(1,...m.values),start=28,step=270/count;
  line(svg,20,190,302,190);
  for(let i=0;i<count;i++){
    const val=m.values[i];
    if(typeof val!=='number'||!Number.isFinite(val)||val<0)return false;
    const height=125*val/hi,width=Math.max(7,Math.min(40,step*0.60));
    const x=start+i*step+(step-width)/2,y=190-height;
    svgNode(svg,'rect',{x,y,width,height,fill:COLORS.bars,rx:3});
    caption(svg,x+width/2,Math.max(19,y-8),Number(val.toFixed(3)).toString(),COLORS.accent,9);
    caption(svg,x+width/2,207,(m.labels[i]||'').slice(0,12),COLORS.line,10);
  }
  caption(svg,160,228,'Magnitudes del ejemplo sintético; tabla de cifras exactas',COLORS.muted,9);
  return true;
}
function drawSample(svg,m){
  if(m.values.length!==12)return false;
  caption(svg,160,30,'Selección ilustrativa: elementos de un marco',COLORS.line,12);
  for(let i=0;i<12;i++){
    const x=45+(i%6)*46,y=72+Math.floor(i/6)*65;
    const selected=m.values[i]===1;
    if(![0,1].includes(m.values[i]))return false;
    svgNode(svg,'circle',{cx:x,cy:y,r:16,fill:selected?COLORS.bars:COLORS.bg,
      stroke:COLORS.line,'stroke-width':1.5});
    caption(svg,x,y+4,m.labels[i],selected?COLORS.bg:COLORS.line,11);
  }
  caption(svg,160,209,'Verde = seleccionado en el dibujo, no en muestra real',COLORS.muted,10);
  caption(svg,160,227,'No está dibujado a escala de N: consultar tabla',COLORS.muted,9);
  return true;
}
function drawTree(svg,m){
  if(m.values.length!==3||m.values.some(v=>typeof v!=='number'||v<0||v>1))return false;
  const [a,b,c]=m.values;
  const orig=[45,120],mid1=[145,63],mid2=[145,180];
  line(svg,orig[0],orig[1],mid1[0],mid1[1],COLORS.accent,2.5);
  line(svg,orig[0],orig[1],mid2[0],mid2[1],COLORS.bars,2.5);
  caption(svg,72,74,'P(A)='+a,COLORS.accent,10);
  caption(svg,72,177,'P(¬A)='+(1-a).toFixed(3).replace(/0+$/,'').replace(/\.$/,''),COLORS.bars,9);
  line(svg,mid1[0],mid1[1],272,39,COLORS.accent,2);
  line(svg,mid1[0],mid1[1],272,91,COLORS.muted,2);
  line(svg,mid2[0],mid2[1],272,153,COLORS.bars,2);
  line(svg,mid2[0],mid2[1],272,202,COLORS.muted,2);
  caption(svg,220,36,'P(B|A)='+b,COLORS.accent,10);
  caption(svg,220,83,'P(¬B|A)',COLORS.muted,10);
  caption(svg,224,149,'P(B|¬A)='+c,COLORS.bars,10);
  caption(svg,221,197,'P(¬B|¬A)',COLORS.muted,10);
  caption(svg,160,230,'Las rutas conjuntas se obtienen multiplicando',COLORS.line,9);
  return true;
}
function drawNormal(svg,m){
  if(m.values.length!==3)return false;
  const [mu,sigma,threshold]=m.values;
  if(![mu,sigma,threshold].every(Number.isFinite)||sigma<=0)return false;
  const xplot=x=>30+(x-(mu-4*sigma))/(8*sigma)*260;
  const yplot=x=>184-125*Math.exp(-.5*((x-mu)/sigma)**2);
  line(svg,25,184,295,184);line(svg,160,44,160,194,COLORS.muted,1);
  let path='';
  for(let i=0;i<=160;i++){
    const x=mu+sigma*(-4+i/20),sx=xplot(x),sy=yplot(x);
    path+=(i?'L':'M')+sx.toFixed(2)+' '+sy.toFixed(2)+' ';
  }
  svgNode(svg,'path',{d:path,fill:'none',stroke:COLORS.bars,'stroke-width':2.8});
  const tx=Math.max(30,Math.min(290,xplot(threshold)));
  line(svg,tx,184,tx,yplot(threshold),COLORS.accent,2);
  caption(svg,160,202,'μ='+mu+'; σ='+sigma,COLORS.line,11);
  caption(svg,160,220,'Umbral corregido '+threshold+'; probabilidad aproximada',COLORS.muted,10);
  return true;
}
function dataTable(figure,spec){
  const table=el('table');table.className='f3-data-table';
  table.append(el('caption','Datos exactos y condiciones · '+spec.title));
  const head=el('thead'),header=el('tr');
  for(const h of ['Magnitud o supuesto','Valor o advertencia']){
    const cell=el('th',h);cell.scope='col';header.append(cell);
  }
  head.append(header);table.append(head);
  const body=el('tbody');
  for(const [key,value] of spec.rows){
    const row=el('tr');const a=el('th',key);a.scope='row';
    const b=el('td',value);row.append(a,b);body.append(row);
  }
  table.append(body);figure.append(table);
}
export function renderWave25InferenceVisual(spec,alt){
  if(!spec||spec.render_family!=='wave25'||typeof spec.title!=='string'||
    !['bars','sample','tree','normal'].includes(spec.kind)||
    !spec.model||!Array.isArray(spec.model.labels)||!Array.isArray(spec.model.values)||
    spec.model.labels.length!==spec.model.values.length||
    !Array.isArray(spec.rows)||spec.rows.length<3||spec.rows.length>12||
    !spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(v=>typeof v==='string')))return null;
  const figure=el('figure');figure.className='f3-function-graph f3-wave25-inference';
  const svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox','0 0 320 235');
  svg.setAttribute('role','img');svg.setAttribute('class','f3-graph-svg');
  svg.setAttribute('aria-label',alt||spec.title);
  svgNode(svg,'rect',{x:0,y:0,width:320,height:235,rx:8,fill:COLORS.bg});
  const method={bars:drawBars,sample:drawSample,tree:drawTree,normal:drawNormal}[spec.kind];
  if(!method(svg,spec.model))return null;
  figure.append(svg,el('figcaption',spec.title));
  dataTable(figure,spec);
  return figure;
}

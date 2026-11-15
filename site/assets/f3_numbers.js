// F3 ola 4 · modelos numéricos editoriales, SVG estáticos y alternativa HTML.
const NS="http://www.w3.org/2000/svg";
const el=(tag,txt)=>{const x=document.createElement(tag);if(txt!==undefined)x.textContent=String(txt);return x};
const svgEl=tag=>document.createElementNS(NS,tag);
function shape(tag,attrs,parent,text){const n=svgEl(tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=String(text);parent.append(n);return n}
function figure(alt,title,height){
 const wrap=el('figure');wrap.className='f3-function-graph f3-number-visual';
 const svg=svgEl('svg');svg.setAttribute('viewBox','0 0 320 '+height);svg.setAttribute('class','f3-graph-svg');
 svg.setAttribute('role','img');svg.setAttribute('aria-label',alt||title);wrap.append(svg);
 wrap.append(el('figcaption',title||alt));return {wrap,svg};
}
function table(headers,rows,caption){
 const t=el('table');t.className='f3-graph-table';t.append(el('caption',caption));
 const thd=el('thead'),head=el('tr');
 headers.forEach(h=>{const th=el('th',h);th.scope='col';head.append(th)});thd.append(head);
 const b=el('tbody');rows.forEach(row=>{const tr=el('tr');row.forEach(v=>tr.append(el('td',v)));b.append(tr)});
 t.append(thd,b);return t;
}
const numeric=v=>typeof v==='number'&&Number.isFinite(v);
const f=v=>Number.isInteger(v)?String(v):v.toLocaleString('es-ES',{maximumFractionDigits:3});
function fractionBar(spec,alt){
 const n=spec.numerator,d=spec.denominator;
 if(!Number.isInteger(n)||!Number.isInteger(d)||d<1||d>40||n<0||n>d)return null;
 const {wrap,svg}=figure(alt,spec.title||'Partes de una unidad',140);
 const width=274,cell=width/d;
 for(let i=0;i<d;i++){
  shape('rect',{x:23+i*cell,y:30,width:cell,height:55,fill:i<n?'#6dc8f2':'#1c354a',
   stroke:'#c0d4e4','stroke-width':1},svg);
 }
 shape('text',{x:160,y:112,'font-size':15,'text-anchor':'middle',fill:'#e5f3fc'},svg,n+'/'+d);
 wrap.append(table(['Tomadas','Total','Fracción exacta'],[[n,d,n+'/'+d]],
   'Alternativa textual exacta de la barra de fracciones; cada parte es igual a las demás.'));
 return wrap;
}
function grid(spec,alt){
 const p=spec.percent;
 if(!numeric(p)||p<0||p>100)return null;
 const {wrap,svg}=figure(alt,spec.title||'Porcentaje de una unidad',258);
 const full=Math.floor(p),rest=p-full,cell=19,startX=65,startY=13;
 for(let i=0;i<100;i++){
  let fill='#1c354a';
  if(i<full)fill='#6dc8f2';
  const cx=startX+(i%10)*cell,cy=startY+Math.floor(i/10)*cell;
  shape('rect',{x:cx,y:cy,width:cell-2,height:cell-2,
    rx:1,fill,stroke:'#49647c','stroke-width':0.5},svg);
  if(i===full&&rest>0){
    shape('rect',{x:cx,y:cy,width:(cell-2)*rest,height:cell-2,
      fill:'#ffc976',stroke:'none'},svg);
  }
 }
 shape('text',{x:160,y:226,'font-size':15,'text-anchor':'middle',fill:'#edf7fe'},svg,f(p)+' %');
 wrap.append(table(['Porcentaje','Razón sobre 100','Decimal'],[[f(p)+' %',f(p)+'/100',f(p/100)]],
   'Equivalencia exacta del porcentaje; una celda parcialmente coloreada indica aproximación visual'));
 return wrap;
}
function relation(spec,alt){
 const pairs=spec.pairs;
 if(!Array.isArray(pairs)||pairs.length<2||pairs.length>18||
   !pairs.every(p=>Array.isArray(p)&&p.length===2&&p.every(numeric)))return null;
 const {wrap,svg}=figure(alt,spec.title||'Tabla de dependencia',210);
 const left=Math.min(0,...pairs.map(p=>p[0])),right=Math.max(0,...pairs.map(p=>p[0]));
 const bot=Math.min(0,...pairs.map(p=>p[1])),top=Math.max(0,...pairs.map(p=>p[1]));
 const dx=right-left||1,dy=top-bot||1;
 const x=v=>35+(v-left)/dx*254,y=v=>174-(v-bot)/dy*145;
 shape('line',{x1:35,y1:174,x2:289,y2:174,stroke:'#c6d6e5','stroke-width':1.5},svg);
 shape('line',{x1:35,y1:18,x2:35,y2:174,stroke:'#c6d6e5','stroke-width':1.5},svg);
 const sorted=[...pairs].sort((a,b)=>a[0]-b[0]);
 if(spec.continuous===true){
  shape('polyline',{points:sorted.map(p=>x(p[0])+','+y(p[1])).join(' '),
    fill:'none',stroke:'#75cbf5','stroke-width':2.3},svg);
 }
 for(const p of pairs)shape('circle',{cx:x(p[0]),cy:y(p[1]),r:3.5,fill:'#ffc976'},svg);
 shape('text',{x:35,y:194,'text-anchor':'start','font-size':11,fill:'#e6f5ff'},svg,f(left));
 shape('text',{x:289,y:194,'text-anchor':'end','font-size':11,fill:'#e6f5ff'},svg,f(right));
 shape('text',{x:12,y:25,'font-size':11,fill:'#e6f5ff'},svg,f(top));
 wrap.append(table([spec.x_label||'Entrada',spec.y_label||'Salida'],
   pairs.map(p=>p.map(f)),'Tabla de valores exactos, alternativa a la representación de puntos'));
 return wrap;
}
export function renderNumberVisual(spec,alt){
 if(!spec||typeof spec!=='object')return null;
 if(spec.kind==='fraction_bar')return fractionBar(spec,alt);
 if(spec.kind==='hundred_grid')return grid(spec,alt);
 if(spec.kind==='relation_table')return relation(spec,alt);
 return null;
}

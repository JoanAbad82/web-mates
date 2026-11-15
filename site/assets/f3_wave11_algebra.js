// F3-11: identidades algebraicas, raíces, desigualdades y sistemas con tabla semántica exacta.
const NS='http://www.w3.org/2000/svg';
const palette={axis:'#a7d7ef',accent:'#f7d292',line:'#b2e3c2',ink:'#f4f9fc',base:'#1b3d56'};
const box=(tag,content)=>{const e=document.createElement(tag);if(content!==undefined)e.textContent=String(content);return e;};
function svg(svg,tag,a={},txt){
 const e=document.createElementNS(NS,tag);
 for(const [key,val] of Object.entries(a))e.setAttribute(key,String(val));
 if(txt!==undefined)e.textContent=String(txt);
 svg.append(e);return e;
}
function line(svg,x,y,X,Y,color=palette.axis,thick=1.7,dash=false){
 return svgElLine(svg,{x1:x,y1:y,x2:X,y2:Y,stroke:color,'stroke-width':thick,...(dash?{'stroke-dasharray':'4 4'}:{})});
}
function svgElLine(svg,a){return globalSvgElement(svg,'line',a);}
function globalSvgElement(parent,name,attrs){const e=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));parent.append(e);return e;}
function text(svg,x,y,t,sz=11,color=palette.ink){
 return globalSvgText(svg,{x,y,fill:color,'font-size':sz,'text-anchor':'middle'},t);
}
function globalSvgText(s,a,value){const e=globalSvgElement(s,'text',a);e.textContent=String(value);return e;}
function table(figure,spec){
 const t=box('table');t.className='f3-graph-table';
 t.append(box('caption','Alternativa tabular exacta: '+spec.title));
 const header=box('thead'),tr=box('tr');
 for(const name of ['Elemento','Valor exacto, condición o interpretación']){
  const th=box('th',name);th.scope='col';tr.append(th);
 }
 header.append(tr);t.append(header);
 const tbody=box('tbody');
 for(const values of spec.rows){
  const tr=box('tr');values.forEach(v=>tr.append(box('td',v)));tbody.append(tr);
 }
 t.append(tbody);figure.append(t);
}
function numberline(s,marks,captionText){
 const y=125,x0=40,x1=282;
 line(s,x0,y,x1,y,palette.axis,2.7);
 line(s,x1-9,y-4,x1,y,palette.axis);line(s,x1-9,y+4,x1,y,palette.axis);
 const m=marks.filter(Number.isFinite);if(!m.length)return false;
 const lower=Math.min(-1,...m)-1,upper=Math.max(4,...m)+1;
 for(const v of m){
  const x=x0+(v-lower)/(upper-lower)*(x1-x0);
  line(s,x,y-9,x,y+9,palette.accent,2.5);
  svg(s,'circle',{cx:x,cy:y,r:4.1,fill:palette.accent});
  text(s,x,y+26,String(v),12,palette.ink);
 }
 text(s,160,36,captionText||'Valores y exclusiones del eje real',11,palette.accent);
 text(s,160,192,'Los intervalos y extremos exactos figuran en la tabla',11);
 return true;
}
function tile(s,spec){
 const rect=(x,y,w,h,fill)=>svg(s,'rect',{x,y,width:w,height:h,fill,stroke:palette.axis,'stroke-width':1.8});
 const big=125,x=71,y=54,band=35;
 rect(x,y,big,big,'#376e8f');
 rect(x+big,y,band,big,'#5a8c9d');
 rect(x,y+big,big,band,'#5a8c9d');
 rect(x+big,y+big,band,band,'#9b7850');
 text(s,130,124,'x²',15);
 text(s,214,122,'cx',12);
 text(s,132,203,'cx',12);
 text(s,214,203,'c²',12);
 text(s,164,31,'Identidad: área de cuatro regiones',12,palette.accent);
 return true;
}
function system(s,spec){
 const OX=157,OY=143,SCALE=17;
 line(s,35,OY,287,OY,palette.axis,1.6);
 line(s,OX,224,OX,25,palette.axis,1.6);
 text(s,287,OY-7,'x');text(s,OX+11,22,'y');
 let lines=spec.lines;
 if(!Array.isArray(lines)||lines.length<1)return false;
 for(let i=0;i<lines.length;i++){
  const [m,n]=lines[i];
  if(![m,n].every(Number.isFinite))return false;
  const x1=-6.5,x2=6.5,y1=m*x1+n,y2=m*x2+n;
  line(s,OX+SCALE*x1,OY-SCALE*y1,OX+SCALE*x2,OY-SCALE*y2,i?palette.accent:palette.line,2.5);
 }
 for(const [name,x,y] of spec.points||[]){
  if(typeof name!=='string'||![x,y].every(Number.isFinite))return false;
  svg(s,'circle',{cx:OX+SCALE*x,cy:OY-SCALE*y,r:4,fill:palette.accent});
  text(s,OX+SCALE*x+15,OY-SCALE*y-8,name);
 }
 text(s,160,237,'Gráfica esquemática: usar tabla para valores exactos',10);
 return true;
}
function domain(s,spec){
 const marks=spec.marks.length?spec.marks:(spec.points||[]).map(p=>p[1]);
 return numberline(s,marks,'Excluir ceros de denominadores y verificar dominio');
}
function symbolic(s,spec){return numberline(s,spec.marks||[],'Ecuación, raíces o restricciones');}
export function renderWave11AlgebraVisual(spec,alt){
 if(!spec||typeof spec.kind!=='string'||typeof spec.title!=='string'||!Array.isArray(spec.rows)||
    spec.rows.length<3||spec.rows.length>12||!spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(x=>typeof x==='string')))return null;
 if(!Array.isArray(spec.marks)||!Array.isArray(spec.lines)||!Array.isArray(spec.points))return null;
 const fig=box('figure');fig.className='f3-function-graph f3-wave11-algebra';
 const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 320 245');
 s.setAttribute('class','f3-graph-svg');s.setAttribute('role','img');
 s.setAttribute('aria-label',alt||spec.title);
 fig.append(s,box('figcaption',spec.title));
 let okay=false;
 if(spec.kind==='algebra_tiles')okay=tile(s,spec);
 else if(spec.kind==='system_lines')okay=system(s,spec);
 else if(spec.kind==='rational_hole'||spec.kind==='restrictions'||spec.kind==='domain')okay=domain(s,spec);
 else if(['factor_table','roots','number_line','logic'].includes(spec.kind))okay=symbolic(s,spec);
 if(!okay)return null;
 table(fig,spec);return fig;
}

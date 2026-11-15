// F3-7: diagramas geométricos de datos declarativos con tabla exacta accesible.
const NS='http://www.w3.org/2000/svg';
const node=(tag,value)=>{const el=document.createElement(tag);if(value!==undefined)el.textContent=String(value);return el};
function ink(parent,tag,attrs={},content){
 const e=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
 if(content!==undefined)e.textContent=String(content);
 parent.append(e);return e;
}
const colors={line:'#bfe6fb',fill:'#397d9d',outline:'#d3efff',highlight:'#ffe3a4',text:'#edf8ff',background:'#19364c'};
function frame(title,alt,height=195){
 const fig=node('figure');fig.className='f3-function-graph f3-wave7-geometry';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 '+height);
 svg.setAttribute('class','f3-graph-svg');svg.setAttribute('role','img');svg.setAttribute('aria-label',alt||title);
 fig.append(svg,node('figcaption',title));return {fig,svg};
}
function table(spec){
 const t=node('table');t.className='f3-graph-table';t.append(node('caption','Datos exactos y alternativa textual: '+spec.title));
 const th=node('thead'),row=node('tr');
 for(const text of ['Elemento o magnitud','Valor o interpretación']){const h=node('th',text);h.scope='col';row.append(h)}
 th.append(row);t.append(th);
 const body=node('tbody');
 for(const [l,r] of spec.rows){const tr=node('tr');tr.append(node('td',l),node('td',r));body.append(tr)}
 t.append(body);return t;
}
function text(svg,x,y,s,options={}){
 const a={'x':x,'y':y,'font-size':options.size||12,'text-anchor':options.anchor||'middle',fill:options.fill||colors.text};
 return ink(svg,'text',a,s);
}
function segment(svg,x1,y1,x2,y2,color=colors.outline,width=2){
 ink(svg,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':width,'stroke-linecap':'round'});
}
function polygon(svg,points,fill=colors.fill){
 ink(svg,'polygon',{points,fill,stroke:colors.outline,'stroke-width':2});
}
function bars(svg,rows){
 rows.forEach(([left,right],i)=>{
  const y=15+i*39;
  ink(svg,'rect',{x:12,y,width:296,height:32,rx:6,fill:colors.background,stroke:colors.outline});
  text(svg,21,y+21,String(left).slice(0,29),{anchor:'start',size:11});
  text(svg,300,y+21,String(right).slice(0,31),{anchor:'end',size:11,fill:colors.highlight});
 });
}
function diagram(spec,alt){
 const type=spec.kind,rows=spec.rows;
 if(!Array.isArray(rows)||!rows.length||rows.length>12||!rows.every(x=>Array.isArray(x)&&x.length===2&&x.every(t=>typeof t==='string'&&t.length<110)))return null;
 const simple=['unit_bar','method_choice'].includes(type);
 const {fig,svg}=frame(spec.title,alt,simple?rows.length*39+30:220);
 if(simple){bars(svg,rows);fig.append(table(spec));return fig;}
 if(type==='measure_band'){
  const n=Number(spec.value),step=Number(spec.resolution);
  if(!Number.isFinite(n)||!Number.isFinite(step)||step<=0)return null;
  ink(svg,'rect',{x:22,y:78,width:276,height:45,rx:8,fill:colors.background,stroke:colors.outline});
  ink(svg,'rect',{x:101,y:90,width:118,height:22,rx:3,fill:colors.fill,stroke:colors.highlight});
  segment(svg,160,70,160,141,colors.highlight,2);
  text(svg,160,53,'Medida declarada '+n);
  text(svg,101,157,String(Number((n-step/2).toFixed(8))),{size:11});
  text(svg,219,157,String(Number((n+step/2).toFixed(8))),{size:11});
  text(svg,160,190,'Banda de redondeo, no precisión instrumental',{size:10});
 }else if(type==='scale_bar'){
  const scale=spec.scale;
  if(!Number.isInteger(scale)||scale<=0)return null;
  text(svg,160,40,'1 : '+scale,{size:19,fill:colors.highlight});
  ink(svg,'rect',{x:55,y:76,width:210,height:30,rx:3,fill:colors.fill,stroke:colors.outline});
  segment(svg,55,72,55,122);segment(svg,265,72,265,122);
  text(svg,160,149,'Razón dibujo / realidad',{size:14});
  text(svg,160,181,'Usar las mismas unidades antes de dividir',{size:11});
 }else if(type==='rectangle'){
  const {width:w,height:h}=spec;
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return null;
  const s=Math.min(235/w,120/h),ww=w*s,hh=h*s,x=(320-ww)/2,y=48;
  ink(svg,'rect',{x,y,width:ww,height:hh,fill:colors.fill,stroke:colors.outline,'stroke-width':2});
  text(svg,160,y+hh+24,w+' unidades',{fill:colors.highlight});
  text(svg,Math.max(20,x-21),y+hh/2,h+' u.',{size:10});
 }else if(type==='angle'){
  const degrees=spec.degrees;
  if(!Number.isFinite(degrees)||degrees<=0||degrees>=180)return null;
  const cx=95,cy=165,r=115,rad=degrees*Math.PI/180;
  segment(svg,cx,cy,cx+r,cy);
  segment(svg,cx,cy,cx+r*Math.cos(rad),cy-r*Math.sin(rad));
  ink(svg,'circle',{cx,cy,r:4,fill:colors.highlight});
  ink(svg,'path',{d:'M '+(cx+46)+' '+cy+' A 46 46 0 0 0 '+(cx+46*Math.cos(rad))+' '+(cy-46*Math.sin(rad)),
   fill:'none',stroke:colors.highlight,'stroke-width':2});
  text(svg,165,82,degrees+'°',{size:17,fill:colors.highlight});
 }else if(type==='triangle'){
  const base=Number(spec.base||spec.sides?.[1]||10),height=Number(spec.height||spec.sides?.[0]||6);
  if(!Number.isFinite(base)||!Number.isFinite(height)||base<=0||height<=0)return null;
  const scale=Math.min(218/base,140/height),width=base*scale,h=height*scale,x=48,y=174;
  polygon(svg,`${x},${y} ${x+width},${y} ${x},${y-h}`);
  segment(svg,x,y-12,x+12,y-12);segment(svg,x+12,y-12,x+12,y);
  text(svg,x+width/2,201,'base: '+base,{fill:colors.highlight});
  text(svg,26,y-h/2,'altura: '+height,{size:10});
 }else if(type==='circle'){
  const r=Number(spec.radius);
  if(!Number.isFinite(r)||r<=0)return null;
  ink(svg,'circle',{cx:160,cy:113,r:82,fill:colors.fill,stroke:colors.outline,'stroke-width':2});
  segment(svg,160,113,242,113,colors.highlight,3);
  segment(svg,78,113,242,113,colors.outline,1);
  ink(svg,'circle',{cx:160,cy:113,r:3,fill:colors.highlight});
  text(svg,199,102,'r = '+r,{fill:colors.highlight,size:12});
  text(svg,160,213,'d = '+2*r,{size:12});
 }else if(type==='composite'){
  const outer=spec.outer,hole=spec.hole;
  if(!Array.isArray(outer)||!Array.isArray(hole)||!outer.every(Number.isFinite)||!hole.every(Number.isFinite)||hole[0]>=outer[0]||hole[1]>=outer[1])return null;
  const w=235,h=145,x=42,y=25;
  ink(svg,'rect',{x,y,width:w,height:h,fill:colors.fill,stroke:colors.outline,'stroke-width':2});
  const innerW=w*(hole[0]/outer[0]),innerH=h*(hole[1]/outer[1]),xi=x+(w-innerW)/2,yi=y+(h-innerH)/2;
  ink(svg,'rect',{x:xi,y:yi,width:innerW,height:innerH,fill:colors.background,stroke:colors.highlight,'stroke-width':2});
  text(svg,160,204,'Zona sombreada = exterior − hueco',{size:11});
 }else if(type==='similar_triangles'){
  const a=spec.first,b=spec.second;
  if(!Array.isArray(a)||!Array.isArray(b)||a.length!==3||b.length!==3)return null;
  polygon(svg,'20,171 100,171 20,111');
  polygon(svg,'145,171 305,171 145,51');
  text(svg,69,202,a.join(' / '),{size:11,fill:colors.highlight});
  text(svg,226,202,b.join(' / '),{size:11,fill:colors.highlight});
  text(svg,160,30,'Correspondencia por lados homólogos',{size:11});
 }else if(type==='right_triangle'){
  const {a,b,c}=spec;
  if(![a,b,c].every(Number.isFinite)||a<=0||b<=0||c<=0||Math.abs(a*a+b*b-c*c)>1e-8)return null;
  const scale=Math.min(220/a,140/b),w=a*scale,h=b*scale,x=45,y=175;
  polygon(svg,`${x},${y} ${x+w},${y} ${x},${y-h}`);
  segment(svg,x,y-12,x+12,y-12);segment(svg,x+12,y-12,x+12,y);
  text(svg,x+w/2,204,'a = '+a,{fill:colors.highlight});
  text(svg,26,y-h/2,'b = '+b,{size:10});
  text(svg,x+w/2+16,y-h/2,'c = '+c,{fill:colors.highlight});
  text(svg,160,22,'Ángulo recto en el vértice inferior izquierdo',{size:10});
 }else return null;
 fig.append(table(spec));return fig;
}
export function renderGeometryVisual(spec,alt){
 if(!spec||typeof spec!=='object'||typeof spec.kind!=='string'||typeof spec.title!=='string')return null;
 return diagram(spec,alt);
}

// WEB MATES F3-12: figuras declarativas de matrices/sistemas y geometría 3D.
// Sin red, eval, código generado ni dependencia de respuestas de estudiantes.
const NS='http://www.w3.org/2000/svg';
const c={background:'#15364d',line:'#b8deee',ink:'#f4f9ff',accent:'#f7cd86',green:'#a9e4bd'};
function html(tag,value){const el=document.createElement(tag);if(value!==undefined)el.textContent=String(value);return el;}
function draw(s,name,attrs={},text){
 const e=document.createElementNS(NS,name);
 for(const [key,v] of Object.entries(attrs))e.setAttribute(key,String(v));
 if(text!==undefined)e.textContent=String(text);
 s.append(e);return e;
}
function line(s,x,y,X,Y,color=c.line,width=2,dash=false){
 return draw(s,'line',{x1:x,y1:y,x2:X,y2:Y,stroke:color,'stroke-width':width,'stroke-linecap':'round',...(dash?{'stroke-dasharray':'4 3'}:{})});
}
function text(s,x,y,value,size=12,color=c.ink){
 return draw(s,'text',{x,y,'font-size':size,'text-anchor':'middle',fill:color},value);
}
function table(fig,spec){
 const t=html('table');t.className='f3-graph-table';
 t.append(html('caption','Alternativa tabular exacta: '+spec.title));
 const head=html('thead');const row=html('tr');
 for(const key of ['Concepto o elemento','Dato exacto y condición']){
  const h=html('th',key);h.scope='col';row.append(h);
 }
 head.append(row);t.append(head);
 const body=html('tbody');
 for(const pair of spec.rows){const tr=html('tr');pair.forEach(v=>tr.append(html('td',v)));body.append(tr);}
 t.append(body);fig.append(t);
}
function matrix(s,spec){
 draw(s,'rect',{x:18,y:12,width:284,height:222,rx:8,fill:c.background});
 text(s,160,31,'Matrices: posiciones fila × columna',13,c.accent);
 const entries=[['a₁₁','a₁₂'],['a₂₁','a₂₂']];
 const left=105,top=70,w=55,h=47;
 for(let i=0;i<2;i++)for(let j=0;j<2;j++){
  const x=left+j*w,y=top+i*h;
  draw(s,'rect',{x,y,width:w-4,height:h-4,fill:i===j?'#426b7d':'#305567',stroke:c.line,'stroke-width':1,rx:4});
  text(s,x+(w-4)/2,y+27,entries[i][j],15);
 }
 for(const x of [left-8,left+2*w])line(s,x,top-10,x,top+2*h-8,c.accent,3);
 line(s,left-8,top-10,left,top-10,c.accent);
 line(s,left-8,top+2*h-8,left,top+2*h-8,c.accent);
 line(s,left+2*w-8,top-10,left+2*w,top-10,c.accent);
 line(s,left+2*w-8,top+2*h-8,left+2*w,top+2*h-8,c.accent);
 text(s,160,191,'La tabla especifica todas las entradas exactas',11,c.ink);
 text(s,160,215,'Orden y compatibilidad se comprueban antes de operar',10,c.line);
 return true;
}
function proj(p){
 const [x,y,z]=p;
 return [146+x*18-y*13,171+x*7+y*7-z*19];
}
function vec(s,a,b,color=c.accent){
 const [x,y]=proj(a),[X,Y]=proj(b);
 const dx=X-x,dy=Y-y,n=Math.hypot(dx,dy);
 if(!Number.isFinite(n)||n<0.01)return false;
 line(s,x,y,X,Y,color,2.5);
 const ux=dx/n,uy=dy/n,bx=X-9*ux,by=Y-9*uy;
 draw(s,'polygon',{points:[X+','+Y,(bx-4*uy)+','+(by+4*ux),(bx+4*uy)+','+(by-4*ux)].join(' '),fill:color});
 return true;
}
function space(s,spec){
 draw(s,'rect',{x:12,y:12,width:296,height:222,rx:8,fill:c.background});
 for(const [name,to] of [['x',[5,0,0]],['y',[0,5,0]],['z',[0,0,5]]]){
  if(!vec(s,[0,0,0],to,c.line))return false;
  const [x,y]=proj(to);text(s,x+9,y-5,name,12,c.line);
 }
 for(const arr of spec.arrows||[]){
  if(!Array.isArray(arr)||arr.length!==6||!arr.every(Number.isFinite))return false;
  if(!vec(s,arr.slice(0,3),arr.slice(3)))return false;
 }
 for(const arr of spec.points||[]){
  if(!Array.isArray(arr)||arr.length!==4||typeof arr[0]!=='string'||!arr.slice(1).every(Number.isFinite))return false;
  const [x,y]=proj(arr.slice(1));
  draw(s,'circle',{cx:x,cy:y,r:4,fill:c.green,stroke:c.ink,'stroke-width':0.5});
  text(s,x+10,y-8,arr[0],11,c.green);
 }
 text(s,160,30,'Representación cartesiana esquemática 3D',12,c.accent);
 text(s,160,222,'Valores y relaciones exactas: tabla siguiente',11,c.line);
 return true;
}
export function renderWave12MathVisual(spec,alt){
 if(!spec||typeof spec.kind!=='string'||typeof spec.title!=='string'||
   !Array.isArray(spec.rows)||spec.rows.length<3||spec.rows.length>12||
   !spec.rows.every(x=>Array.isArray(x)&&x.length===2&&x.every(v=>typeof v==='string'))||
   !Array.isArray(spec.points)||!Array.isArray(spec.arrows)||!Array.isArray(spec.lines))return null;
 const fig=html('figure');fig.className='f3-function-graph f3-wave12-math';
 const s=document.createElementNS(NS,'svg');
 s.setAttribute('viewBox','0 0 320 245');s.setAttribute('role','img');s.setAttribute('class','f3-graph-svg');
 s.setAttribute('aria-label',alt||spec.title);
 fig.append(s,html('figcaption',spec.title));
 const okay=spec.kind==='matrix'?matrix(s,spec):spec.kind==='space'?space(s,spec):false;
 if(!okay)return null;
 table(fig,spec);
 return fig;
}

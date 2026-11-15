// WEB MATES F3-9: plano cartesiano declarativo en SVG y alternativa semántica exacta.
const NS='http://www.w3.org/2000/svg';
const elem=(tag,value)=>{const node=document.createElement(tag);if(value!==undefined)node.textContent=String(value);return node;};
function draw(parent,tag,attrs={},value){
 const node=document.createElementNS(NS,tag);
 for(const [name,v] of Object.entries(attrs))node.setAttribute(name,String(v));
 if(value!==undefined)node.textContent=String(value);
 parent.append(node);
 return node;
}
const ink={axis:'#b8d5e6',line:'#ffc970',arrow:'#91e1b0',point:'#fcf2dd',grid:'#436177',background:'#153348',text:'#eff9ff'};
const X=x=>160+21*x;
const Y=y=>125-21*y;
function line(svg,x1,y1,x2,y2,color=ink.line,width=2,style){
 const attrs={x1:X(x1),y1:Y(y1),x2:X(x2),y2:Y(y2),stroke:color,'stroke-width':width,'stroke-linecap':'round'};
 if(style)attrs['stroke-dasharray']=style;
 return draw(svg,'line',attrs);
}
function label(svg,x,y,content,size=11,color=ink.text){
 return draw(svg,'text',{x,y,'font-size':size,fill:color,'text-anchor':'middle'},content);
}
function tabulate(fig,spec){
 const t=elem('table');t.className='f3-graph-table';
 t.append(elem('caption','Alternativa tabular exacta de '+spec.title));
 const head=elem('thead'),row=elem('tr');
 for(const name of ['Elemento o magnitud','Valor o relación exacta']){
  const h=elem('th',name);h.scope='col';row.append(h);
 }
 head.append(row);t.append(head);
 const body=elem('tbody');
 for(const pair of spec.rows){const tr=elem('tr');pair.forEach(v=>tr.append(elem('td',v)));body.append(tr);}
 t.append(body);fig.append(t);
}
function grid(svg){
 draw(svg,'rect',{x:34,y:0,width:252,height:250,fill:ink.background,rx:3});
 for(let v=-5;v<=5;v++){
  const color=v===0?ink.axis:ink.grid;
  line(svg,-6,v,6,v,color,v===0?1.8:0.6);
  line(svg,v,-6,v,6,color,v===0?1.8:0.6);
  if(v!==0 && v%2===0){
   label(svg,X(v),Y(0)+14,String(v),9,ink.axis);
   label(svg,X(0)-13,Y(v)+3,String(v),9,ink.axis);
  }
 }
 label(svg,296,Y(0)-9,'x',12);
 label(svg,X(0)+11,15,'y',12);
}
function clipLine(slope,intercept){
 const m=Number(slope),n=Number(intercept);
 if(!Number.isFinite(m)||!Number.isFinite(n))return null;
 const pairs=[];
 function add(x,y){if(x>=-5.8&&x<=5.8&&y>=-5.8&&y<=5.8&&!pairs.some(v=>Math.abs(v[0]-x)+Math.abs(v[1]-y)<1e-7))pairs.push([x,y]);}
 for(const x of [-5.8,5.8])add(x,m*x+n);
 if(Math.abs(m)>1e-10)for(const y of [-5.8,5.8])add((y-n)/m,y);
 return pairs.length>=2?pairs.slice(0,2):null;
}
function arrow(svg,arr){
 if(!Array.isArray(arr)||arr.length!==4||!arr.every(Number.isFinite))return false;
 const [x1,y1,x2,y2]=arr,dx=X(x2)-X(x1),dy=Y(y2)-Y(y1),norm=Math.hypot(dx,dy);
 if(norm<1e-6)return false;
 line(svg,x1,y1,x2,y2,ink.arrow,2.8);
 const ux=dx/norm,uy=dy/norm;
 const bx=X(x2)-9*ux,by=Y(y2)-9*uy;
 draw(svg,'polygon',{points:[X(x2)+','+Y(y2),(bx-4*uy)+','+(by+4*ux),(bx+4*uy)+','+(by-4*ux)].join(' '),fill:ink.arrow});
 return true;
}
export function renderWave9AnalyticVisual(spec,alt){
 if(!spec||typeof spec.kind!=='string'||typeof spec.title!=='string'||
  !Array.isArray(spec.rows)||spec.rows.length<3||spec.rows.length>12||
  !spec.rows.every(row=>Array.isArray(row)&&row.length===2&&row.every(value=>typeof value==='string')))return null;
 if(!Array.isArray(spec.points)||!Array.isArray(spec.segments)||!Array.isArray(spec.lines)||!Array.isArray(spec.arrows))return null;
 const fig=elem('figure');fig.className='f3-function-graph f3-wave9-analytic';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 250');
 svg.setAttribute('class','f3-graph-svg');svg.setAttribute('role','img');svg.setAttribute('aria-label',alt||spec.title);
 fig.append(svg,elem('figcaption',spec.title));
 grid(svg);
 for(const entry of spec.lines){
  if(!Array.isArray(entry)||entry.length!==2)return null;
  const part=clipLine(...entry);
  if(!part)return null;
  line(svg,part[0][0],part[0][1],part[1][0],part[1][1],ink.line,2.4);
 }
 for(const entry of spec.segments){
  if(!Array.isArray(entry)||entry.length!==4||!entry.every(Number.isFinite))return null;
  line(svg,...entry,ink.line,2.5);
 }
 for(const entry of spec.arrows)if(!arrow(svg,entry))return null;
 for(const item of spec.points){
  if(!Array.isArray(item)||item.length!==3||typeof item[0]!=='string'||!Number.isFinite(item[1])||!Number.isFinite(item[2]))return null;
  const [name,x,y]=item;
  draw(svg,'circle',{cx:X(x),cy:Y(y),r:3.6,stroke:ink.text,'stroke-width':1,fill:ink.point});
  label(svg,X(x)+12,Y(y)-8,name,11,ink.point);
 }
 tabulate(fig,spec);
 return fig;
}

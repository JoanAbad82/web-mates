// WEB MATES F3-10: geometría espacial y sólidos declarativos; SVG + tabla exacta, sin red.
const NS='http://www.w3.org/2000/svg';
const theme={fg:'#edf8ff',line:'#a7d6ee',accent:'#f9d08a',green:'#b6e3bf',background:'#18344b'};
function node(tag,text){
 const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;
}
function el(svg,tag,props={},txt){
 const n=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(props))n.setAttribute(k,String(v));
 if(txt!==undefined)n.textContent=String(txt);
 svg.append(n);return n;
}
function ln(svg,x1,y1,x2,y2,color=theme.line,width=2,dash=false){
 return el(svg,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':width,
  ...(dash?{'stroke-dasharray':'5 4'}:{})});
}
function caption(svg,x,y,value,size=12,color=theme.fg){
 return el(svg,'text',{x,y,fill:color,'font-size':size,'text-anchor':'middle'},value);
}
function table(fig,spec){
 const t=node('table');t.className='f3-graph-table';
 t.append(node('caption','Descripción tabular exacta: '+spec.title));
 const tr=node('tr');
 for(const name of ['Elemento','Medida o relación exacta']){const h=node('th',name);h.scope='col';tr.append(h)}
 const head=node('thead');head.append(tr);t.append(head);
 const body=node('tbody');
 for(const pair of spec.rows){
  const row=node('tr');pair.forEach(x=>row.append(node('td',x)));body.append(row);
 }
 t.append(body);fig.append(t);
}
const project=([x,y,z])=>[155+x*24-y*18,177+x*8+y*8-z*27];
function arrow(svg,start,end,color=theme.accent){
 const [x,y]=project(start),[X,Y]=project(end);
 const dx=X-x,dy=Y-y,norm=Math.hypot(dx,dy);
 if(norm<=0)return false;
 ln(svg,x,y,X,Y,color,2.7);
 const bx=X-9*dx/norm,by=Y-9*dy/norm;
 el(svg,'polygon',{points:[X+','+Y,(bx-4*dy/norm)+','+(by+4*dx/norm),
   (bx+4*dy/norm)+','+(by-4*dx/norm)].join(' '),fill:color});
 return true;
}
function space(svg,spec){
 for(const [axis,end] of [['x',[4,0,0]],['y',[0,4,0]],['z',[0,0,5]]]){
  if(!arrow(svg,[0,0,0],end,theme.line))return false;
  const [x,y]=project(end);
  caption(svg,x+9,y-6,axis,13,theme.line);
 }
 const vectors=spec.vectors||[];
 if(!Array.isArray(vectors)||vectors.length>6)return false;
 for(const a of vectors){
  if(!Array.isArray(a)||a.length!==6||!a.every(Number.isFinite))return false;
  if(!arrow(svg,a.slice(0,3),a.slice(3)))return false;
 }
 for(const a of spec.points||[]){
  if(!Array.isArray(a)||a.length!==4||typeof a[0]!=='string'||!a.slice(1).every(Number.isFinite))return false;
  const [x,y]=project(a.slice(1));
  el(svg,'circle',{cx:x,cy:y,r:4,fill:theme.green});
  caption(svg,x+12,y-9,a[0],12,theme.green);
 }
 if(spec.kind==='space_cross'||spec.kind==='space_area'){
  const u=vectors[0],v=vectors[1];
  if(u&&v&&u.slice(0,3).every(x=>x===0)&&v.slice(0,3).every(x=>x===0)){
   const origin=project([0,0,0]);
   const A=project(u.slice(3)),B=project(v.slice(3));
   el(svg,'polygon',{points:[origin,A,B].map(p=>p.join(',')).join(' '),
      stroke:theme.green,fill:theme.green,'fill-opacity':'.20','stroke-width':1});
  }
 }
 caption(svg,160,24,'Ejes cartesianos: x, y, z',11,theme.accent);
 return true;
}
function rect(svg,x,y,w,h,fill=theme.background,stroke=theme.line){
 return el(svg,'rect',{x,y,width:w,height:h,fill,stroke,'stroke-width':2});
}
function polygon(svg,points,fill='none',stroke=theme.line){
 return el(svg,'polygon',{points:points.map(v=>v.join(',')).join(' '),
  fill,stroke,'stroke-width':2});
}
function box3D(svg,typ,filled=false){
 const x=75,y=105,w=135,h=92,dx=42,dy=-34;
 polygon(svg,[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],'#38617b');
 polygon(svg,[[x,y],[x+dx,y+dy],[x+w+dx,y+dy],[x+w,y]],'#58849b');
 polygon(svg,[[x+w,y],[x+w+dx,y+dy],[x+w+dx,y+h+dy],[x+w,y+h]],'#2c526b');
 ln(svg,x+dx,y+dy,x+dx,y+h+dy,theme.line,1,true);
 ln(svg,x+dx,y+h+dy,x+w+dx,y+h+dy,theme.line,1,true);
 ln(svg,x,y+h,x+dx,y+h+dy,theme.line,1,true);
 if(filled){
  rect(svg,x+1,y+h*0.3,w-2,h*0.7,'#2e8aa0','none');
  caption(svg,142,147,'75 %',14,theme.accent);
 }
 caption(svg,160,28,typ==='tank'?'Capacidad interior (dm³ = L)':'Volumen = área base × altura',12,theme.accent);
 return true;
}
function round(svg,spec){
 const shape=spec.shape||{},type=shape.type;
 const cx=150,cy=119,r=58;
 if(type==='circle'){
  el(svg,'circle',{cx,cy,r,fill:'#3a6981',stroke:theme.line,'stroke-width':2});
  ln(svg,cx,cy,cx+r,cy,theme.accent,2);
  caption(svg,cx+r/2,cy-9,'r',13,theme.accent);
  caption(svg,160,27,'Círculo: región; circunferencia: contorno',11);
  return true;
 }
 if(type==='composite'){
  const ow=212,oh=118,x=53,y=61;
  rect(svg,x,y,ow,oh,'#487e98');
  rect(svg,x+104,y+48,62,35,theme.background,theme.accent);
  caption(svg,160,29,'Área exterior − área del hueco',12,theme.accent);
  return true;
 }
 if(type==='cylinder'){
  const cx=158,rx=68,ry=21,top=64,bottom=185;
  el(svg,'path',{d:'M '+(cx-rx)+' '+top+' L '+(cx-rx)+' '+bottom+' A '+rx+' '+ry+' 0 0 0 '+(cx+rx)+' '+bottom+' L '+(cx+rx)+' '+top+' Z',
    fill:'#3d708a',stroke:theme.line,'stroke-width':2});
  el(svg,'ellipse',{cx,cy:top,rx,ry,fill:'#508da8',stroke:theme.line,'stroke-width':2});
  el(svg,'ellipse',{cx,cy:bottom,rx,ry,fill:'none',stroke:theme.line,'stroke-width':2});
  ln(svg,cx,top,cx+rx,top,theme.accent);
  caption(svg,165,28,'Base circular · altura perpendicular',12,theme.accent);
  return true;
 }
 return false;
}
function solid(svg,spec){
 const type=spec.shape?.type;
 if(['prism','cube','tank'].includes(type))return box3D(svg,type,type==='tank');
 if(['circle','composite','cylinder'].includes(type))return round(svg,spec);
 return false;
}
export function renderWave10SpatialVisual(spec,alt){
 if(!spec||typeof spec.kind!=='string'||typeof spec.title!=='string'||
    !Array.isArray(spec.rows)||spec.rows.length<3||spec.rows.length>10||
    !spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(x=>typeof x==='string')))return null;
 if(!Array.isArray(spec.vectors)||!Array.isArray(spec.points))return null;
 const fig=node('figure');fig.className='f3-function-graph f3-wave10-spatial';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 235');
 svg.setAttribute('class','f3-graph-svg');svg.setAttribute('role','img');
 svg.setAttribute('aria-label',alt||spec.title);
 fig.append(svg,node('figcaption',spec.title));
 let good=false;
 if(spec.kind.startsWith('space_'))good=space(svg,spec);
 else good=solid(svg,spec);
 if(!good)return null;
 table(fig,spec);
 return fig;
}

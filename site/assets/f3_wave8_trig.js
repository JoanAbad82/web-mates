// F3-8: SVG declarativo; datos exactos también en tabla HTML, sin peticiones externas.
const NS='http://www.w3.org/2000/svg';
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);return e};
const C={stroke:'#bbe4f6',fill:'#397d9d',accent:'#ffe3a4',text:'#edf8ff',base:'#172f45'};
function svgEl(svg,tag,attrs,txt){
 const e=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,String(v));
 if(txt!==undefined)e.textContent=String(txt);
 svg.append(e);return e;
}
const line=(s,x,y,X,Y,c=C.stroke,w=2)=>svgEl(s,'line',{x1:x,y1:y,x2:X,y2:Y,stroke:c,'stroke-width':w,'stroke-linecap':'round'});
const text=(s,x,y,t,size=12,c=C.text)=>svgEl(s,'text',{x,y,'text-anchor':'middle','font-size':size,fill:c},t);
function table(fig,spec){
 const t=el('table');t.className='f3-graph-table';
 t.append(el('caption','Alternativa tabular exacta: '+spec.title));
 const head=el('thead'),tr=el('tr');
 for(const a of ['Elemento','Valor o interpretación']){const th=el('th',a);th.scope='col';tr.append(th)}
 head.append(tr);t.append(head);
 const body=el('tbody');
 for(const pair of spec.rows){const row=el('tr');pair.forEach(v=>row.append(el('td',v)));body.append(row)}
 t.append(body);fig.append(t);
}
function triangle(svg,spec){
 const a=Number(spec.a),b=Number(spec.b),c=Number(spec.c);
 if(!(a>0&&b>0&&c>0&&Math.abs(a*a+b*b-c*c)<0.0001))return false;
 const scale=Math.min(180/a,133/b),w=a*scale,h=b*scale,x=65,y=176;
 svgEl(svg,'polygon',{points:[x+','+y,(x+w)+','+y,x+','+(y-h)].join(' '),fill:C.fill,stroke:C.stroke,'stroke-width':2});
 line(svg,x,y-11,x+11,y-11,C.accent);line(svg,x+11,y-11,x+11,y,C.accent);
 text(svg,x+w/2,202,'adyacente',11,C.accent);
 text(svg,31,y-h/2,'opuesto',10);
 text(svg,x+w/2+20,y-h/2,'hipotenusa',10);
 text(svg,x+w-18,y-13,spec.angle||'θ',14,C.accent);
 return true;
}
function slope(svg,spec){
 const rise=Number(spec.rise),run=Number(spec.run);
 if(!(rise>0&&run>0))return false;
 const scale=Math.min(185/run,130/rise),w=run*scale,h=rise*scale,x=48,y=177;
 line(svg,x,y,x+w,y,C.stroke,3);line(svg,x+w,y,x+w,y-h,C.stroke,3);line(svg,x,y,x+w,y-h,C.accent,3);
 text(svg,x+w/2,201,run+' m',12);text(svg,x+w+17,y-h/2,rise+' m',12);
 text(svg,x+35,y-12,spec.kind==='elevation'?'45°':'α',13,C.accent);
 text(svg,160,27,spec.kind==='elevation'?'Desnivel desde la horizontal':'Pendiente = subida / avance',11);
 return true;
}
function circle(svg,angles,identity=false){
 const cx=160,cy=120,r=79;
 line(svg,25,cy,295,cy);line(svg,cx,22,cx,216);
 svgEl(svg,'circle',{cx,cy,r,fill:'none',stroke:C.stroke,'stroke-width':2});
 for(const theta of angles){
  const rad=Number(theta)*Math.PI/180,x=cx+r*Math.cos(rad),y=cy-r*Math.sin(rad);
  if(!Number.isFinite(x)||!Number.isFinite(y))return false;
  line(svg,cx,cy,x,y,C.accent,2);line(svg,x,y,x,cy,C.fill,2);
  svgEl(svg,'circle',{cx:x,cy:y,r:4,fill:C.accent});
  text(svg,Math.max(25,Math.min(294,x+15)),Math.max(22,Math.min(207,y-10)),String(theta)+'°',11,C.accent);
 }
 text(svg,295,112,'x');text(svg,172,30,'y');
 if(identity)text(svg,160,219,'sen²θ + cos²θ = 1',12,C.accent);
 return true;
}
function arc(svg,degrees){
 if(!(Number.isFinite(degrees)&&Math.abs(degrees)<=360))return false;
 const theta=degrees*Math.PI/180,cx=160,cy=127,r=73;
 svgEl(svg,'circle',{cx,cy,r,fill:'none',stroke:C.stroke,'stroke-width':2});
 line(svg,cx,cy,cx+r,cy);
 line(svg,cx,cy,cx+r*Math.cos(theta),cy-r*Math.sin(theta),C.accent,3);
 text(svg,160,29,degrees+'° = '+(degrees===180?'π':'θ')+' rad',14);
 text(svg,160,219,'radianes = longitud de arco / radio',11,C.accent);
 return true;
}
function cosine(svg,spec){
 const a=Number(spec.a),b=Number(spec.b),c=Number(spec.c),deg=Number(spec.angle);
 if(![a,b,c,deg].every(Number.isFinite)||!(a>0&&b>0&&c>0&&deg>0&&deg<180))return false;
 if(Math.abs(a*a+b*b-2*a*b*Math.cos(deg*Math.PI/180)-c*c)>0.0001)return false;
 const scale=Math.min(190/(a+b),122/Math.max(a,b)),x=63,y=176;
 const X=x+a*scale,Y=y,x2=x+b*scale*Math.cos(deg*Math.PI/180),y2=y-b*scale*Math.sin(deg*Math.PI/180);
 svgEl(svg,'polygon',{points:[x+','+y,X+','+Y,x2+','+y2].join(' '),fill:C.fill,stroke:C.stroke,'stroke-width':2});
 text(svg,(x+X)/2,201,'a='+a,11);text(svg,(x+x2)/2-15,(y+y2)/2-10,'b='+b,11);
 text(svg,(X+x2)/2+15,(Y+y2)/2,'c',12,C.accent);text(svg,x+27,y-14,deg+'°',12,C.accent);
 text(svg,160,25,'c² = a² + b² − 2ab cos C',11);
 return true;
}
function triangleSolution(svg,spec){
 const ang=spec.angles;
 if(!Array.isArray(ang)||ang.length!==3||ang.join(',')!=='30,60,90')return false;
 const x=88,y=178,w=87,h=87*Math.sqrt(3);
 svgEl(svg,'polygon',{points:[x+','+y,(x+w)+','+y,x+','+(y-h)].join(' '),
  fill:C.fill,stroke:C.stroke,'stroke-width':2});
 line(svg,x,y-12,x+12,y-12,C.accent);line(svg,x+12,y-12,x+12,y,C.accent);
 text(svg,x+w/2,195,'5',11,C.accent);
 text(svg,x-20,y-h/2,'5√3',11,C.accent);
 text(svg,x+w/2+27,y-h/2,'10',11,C.accent);
 text(svg,x+19,y-h+24,'30°',11);
 text(svg,x+w-26,y-12,'60°',11);
 text(svg,x+19,y-15,'90°',11);
 return true;
}
export function renderWave8TrigVisual(spec,alt){
 if(!spec||typeof spec.kind!=='string'||typeof spec.title!=='string'||
    !Array.isArray(spec.rows)||spec.rows.length<3||spec.rows.length>12||
    !spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(v=>typeof v==='string')))return null;
 const fig=el('figure');fig.className='f3-function-graph f3-wave8-trig';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 225');
 svg.setAttribute('class','f3-graph-svg');svg.setAttribute('role','img');
 svg.setAttribute('aria-label',alt||spec.title);fig.append(svg,el('figcaption',spec.title));
 let okay=false;
 if(spec.kind==='right_trig')okay=triangle(svg,spec);
 if(spec.kind==='slope'||spec.kind==='elevation')okay=slope(svg,spec);
 if(spec.kind==='angle_arc')okay=arc(svg,spec.degrees);
 if(spec.kind==='unit_circle')okay=circle(svg,[spec.degrees]);
 if(spec.kind==='identity')okay=circle(svg,[spec.degrees],true);
 if(spec.kind==='equation_circle')okay=circle(svg,spec.angles);
 if(spec.kind==='cosine_law')okay=cosine(svg,spec);
 if(spec.kind==='triangle_solution')okay=triangleSolution(svg,spec);
 if(!okay)return null;
 table(fig,spec);return fig;
}

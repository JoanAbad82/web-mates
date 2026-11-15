// F3 ola 5: visualizaciones locales sin librerías, tablas equivalentes accesibles.
const NS='http://www.w3.org/2000/svg';
function html(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;}
function svg(tag,attrs,parent,text){
 const e=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
 if(text!==undefined)e.textContent=String(text);
 parent.append(e);return e;
}
function frame(title,alt,h=180){
 const figure=html('figure');figure.className='f3-function-graph f3-foundation-visual';
 const picture=document.createElementNS(NS,'svg');
 picture.setAttribute('viewBox','0 0 320 '+h);
 picture.setAttribute('class','f3-graph-svg');picture.setAttribute('role','img');
 picture.setAttribute('aria-label',alt||title);
 figure.append(picture,html('figcaption',title));
 return {figure,picture};
}
function dataTable(title,headers,rows){
 const table=html('table');table.className='f3-graph-table';
 table.append(html('caption','Alternativa tabular exacta: '+title));
 const head=html('thead'),row=html('tr');
 headers.forEach(k=>{const th=html('th',k);th.scope='col';row.append(th);});
 head.append(row);table.append(head);
 const body=html('tbody');
 rows.forEach(values=>{const tr=html('tr');values.forEach(v=>tr.append(html('td',v)));body.append(tr);});
 table.append(body);return table;
}
function place(spec,alt){
 const n=spec.number;if(!Number.isSafeInteger(n)||n<0||n>9999999)return null;
 const digits=String(n).split('');
 const {figure,picture}=frame(spec.title||'Valor posicional',alt,160);
 const rows=[];
 const x0=20,step=280/digits.length;
 digits.forEach((digit,i)=>{
  const order=10**(digits.length-1-i),x=x0+step*i;
  svg('rect',{x:x,y:28,width:step-2,height:65,rx:4,fill:'#1c354a',stroke:'#a6d4eb'},picture);
  svg('text',{x:x+(step-2)/2,y:67,'font-size':19,'text-anchor':'middle',fill:'#ecf7fd'},picture,digit);
  svg('text',{x:x+(step-2)/2,y:112,'font-size':11,'text-anchor':'middle',fill:'#b3dcf0'},picture,String(order));
  rows.push([String(order),digit,String(Number(digit)*order)]);
 });
 svg('text',{x:160,y:145,'font-size':12,'text-anchor':'middle',fill:'#ecf7fd'},picture,'Cada orden vale 10 veces el siguiente');
 figure.append(dataTable(spec.title||'Valor posicional',['Orden','Cifra','Valor aportado'],rows));
 return figure;
}
function line(spec,alt){
 const {minimum:a,maximum:b,points}=spec;
 if(!Number.isInteger(a)||!Number.isInteger(b)||b<=a||b-a>24||!Array.isArray(points)||points.length<1||points.length>8||!points.every(x=>Number.isInteger(x)&&x>=a&&x<=b))return null;
 const {figure,picture}=frame(spec.title||'Recta de enteros',alt,145);
 const x=v=>25+(v-a)/(b-a)*270;
 svg('line',{x1:25,y1:65,x2:295,y2:65,stroke:'#bed9ee','stroke-width':2},picture);
 const marks=new Set([a,b,0,...points]);
 for(let n=a;n<=b;n++){
  svg('line',{x1:x(n),y1:59,x2:x(n),y2:71,stroke:'#bed9ee','stroke-width':1},picture);
  if(marks.has(n)&&n>=a&&n<=b)svg('text',{x:x(n),y:91,'font-size':11,'text-anchor':'middle',fill:'#edf7fd'},picture,String(n));
 }
 points.forEach(v=>svg('circle',{cx:x(v),cy:65,r:5,fill:'#ffc976',stroke:'#182637','stroke-width':1},picture));
 figure.append(dataTable(spec.title||'Recta',['Elemento','Valor exacto'],[['Límite izquierdo',a],['Límite derecho',b],...points.map((v,i)=>['Punto '+(i+1),v])]));
 return figure;
}
function steps(spec,alt){
 const rows=spec.rows;
 if(!Array.isArray(rows)||rows.length<2||rows.length>5||!rows.every(row=>Array.isArray(row)&&row.length===2&&row.every(s=>typeof s==='string'&&s.length<90)))return null;
 const {figure,picture}=frame(spec.title||'Pasos razonados',alt,65+rows.length*42);
 rows.forEach((r,i)=>{
  const y=12+i*42;
  svg('rect',{x:12,y,width:296,height:36,rx:6,fill:'#1c354a',stroke:'#a6d4eb'},picture);
  svg('text',{x:21,y:y+23,'font-size':12,fill:'#e1f6ff'},picture,r[0].slice(0,19));
  svg('text',{x:298,y:y+23,'font-size':12,'text-anchor':'end',fill:'#ffc976'},picture,r[1].slice(0,22));
 });
 figure.append(dataTable(spec.title||'Pasos',['Paso','Expresión o resultado'],rows));
 return figure;
}
function factors(spec,alt){
 const n=spec.number;
 if(!Number.isSafeInteger(n)||n<2||n>120)return null;
 const pairs=[];
 for(let d=1;d*d<=n;d++)if(n%d===0)pairs.push([d,n/d]);
 const {figure,picture}=frame(spec.title||'Parejas de divisores',alt,55+36*pairs.length);
 pairs.forEach(([a,b],i)=>{
  const y=15+i*36;
  svg('rect',{x:12,y,width:296,height:30,rx:4,fill:'#1c354a',stroke:'#a6d4eb'},picture);
  svg('text',{x:160,y:y+20,'text-anchor':'middle','font-size':13,fill:'#e3f5fd'},picture,a+' × '+b+' = '+n);
 });
 figure.append(dataTable(spec.title||'Factores',['Factor A','Factor B','Producto'],pairs.map(p=>[...p,n])));
 return figure;
}
export function renderFoundationVisual(spec,alt){
 if(!spec||typeof spec!=='object')return null;
 if(spec.kind==='place_value')return place(spec,alt);
 if(spec.kind==='integer_line')return line(spec,alt);
 if(spec.kind==='steps')return steps(spec,alt);
 if(spec.kind==='divisor_pairs')return factors(spec,alt);
 return null;
}

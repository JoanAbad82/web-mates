// F3-6: SVG declarativos con tablas alternativas exactas, sin red ni eventos.
const NS='http://www.w3.org/2000/svg';
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n};
const isInt=Number.isSafeInteger;
function shape(name,attrs,parent,text){
 const n=document.createElementNS(NS,name);
 for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));
 if(text!==undefined)n.textContent=String(text);parent.append(n);return n;
}
function begin(title,alt,height=180){
 const fig=el('figure');fig.className='f3-function-graph f3-wave6-visual';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 '+height);
 svg.setAttribute('class','f3-graph-svg');svg.setAttribute('role','img');
 svg.setAttribute('aria-label',alt||title);fig.append(svg,el('figcaption',title));
 return {fig,svg};
}
function table(title,headers,rows){
 const t=el('table');t.className='f3-graph-table';t.append(el('caption','Alternativa tabular: '+title));
 const thead=el('thead'),tr=el('tr');
 for(const h of headers){const th=el('th',h);th.scope='col';tr.append(th);}
 thead.append(tr);t.append(thead);
 const body=el('tbody');
 for(const row of rows){const r=el('tr');for(const v of row)r.append(el('td',v));body.append(r);}
 t.append(body);return t;
}
const fraction=(n,d)=>d===1?String(n):n+'/'+d;
function power(spec,alt){
 const {base,max_exp:n}=spec;if(!isInt(base)||!isInt(n)||base===0||Math.abs(base)>9||n<1||n>5)return null;
 const {fig,svg}=begin(spec.title||'Potencias',alt,40+43*(n+1));
 const rows=[];
 for(let i=0;i<=n;i++){
  const v=base**i,y=17+i*43;
  shape('rect',{x:13,y,width:294,height:36,rx:5,fill:'#1c354a',stroke:'#a6d4eb'},svg);
  shape('text',{x:26,y:y+23,'font-size':13,fill:'#e3f4fd'},svg,'('+base+')^'+i);
  shape('text',{x:290,y:y+23,'font-size':13,'text-anchor':'end',fill:'#ffc976'},svg,'= '+v);
  rows.push([i,'('+base+')^'+i,v]);
 }
 fig.append(table(spec.title||'Potencias',['Exponente','Expresión','Valor exacto'],rows));
 return fig;
}
function square(spec,alt){
 const side=spec.side;
 if(!isInt(side)||side<1||side>11)return null;
 const {fig,svg}=begin(spec.title||'Cuadrados',alt,270);
 const step=215/side;
 for(let i=0;i<side;i++)for(let j=0;j<side;j++){
  shape('rect',{x:51+j*step,y:15+i*step,width:step-0.8,height:step-0.8,fill:'#3d8fba',stroke:'#b8e2f4','stroke-width':0.7},svg);
 }
 shape('text',{x:160,y:253,'text-anchor':'middle','font-size':14,fill:'#edf7ff'},svg,side+' × '+side+' = '+side*side);
 fig.append(table(spec.title||'Área de cuadrado',['Lado','Área en cuadrados de unidad','Raíz principal del área'],[[side,side*side,side]]));
 return fig;
}
function rational(spec,alt){
 const min=spec.min,max=spec.max,points=spec.points;
 if(!Number.isFinite(min)||!Number.isFinite(max)||max<=min||!Array.isArray(points)||points.length<1||points.length>7)return null;
 if(!points.every(x=>Array.isArray(x)&&x.length===2&&x.every(isInt)&&x[1]>0&&x[0]/x[1]>=min&&x[0]/x[1]<=max))return null;
 const {fig,svg}=begin(spec.title||'Recta racional',alt,150);
 const X=v=>28+(v-min)/(max-min)*265;
 shape('line',{x1:28,y1:63,x2:293,y2:63,stroke:'#bddaf0','stroke-width':2},svg);
 for(let i=0;i<=10;i++){
  const x=28+i*265/10;
  shape('line',{x1:x,y1:57,x2:x,y2:69,stroke:'#b7d6e8'},svg);
 }
 const rows=[['Extremo izquierdo',String(min),String(min)],['Extremo derecho',String(max),String(max)]];
 points.forEach(([n,d],i)=>{
  const v=n/d;
  shape('circle',{cx:X(v),cy:63,r:5,stroke:'#273d51',fill:'#ffc976'},svg);
  shape('text',{x:X(v),y:90+((i%2)*19),'text-anchor':'middle','font-size':10,fill:'#e9f8ff'},svg,fraction(n,d));
  rows.push(['Punto '+(i+1),fraction(n,d),String(v).replace('.',',')]);
 });
 fig.append(table(spec.title||'Valores racionales',['Elemento','Valor exacto','Decimal ilustrativo'],rows));
 return fig;
}
function decimalCycle(spec,alt){
 const {numerator:n,denominator:d,digits:k}=spec;
 if(!isInt(n)||!isInt(d)||d<=1||n<=0||n>=d||!isInt(k)||k<4||k>16)return null;
 let remainder=n%d;const rows=[],digits=[];
 for(let i=0;i<k;i++){
  const ten=remainder*10,letter=Math.floor(ten/d);
  remainder=ten%d;digits.push(letter);rows.push([i+1,String(letter),String(remainder)]);
 }
 const {fig,svg}=begin(spec.title||'Desarrollo decimal',alt,158);
 shape('rect',{x:10,y:30,width:300,height:70,rx:5,fill:'#1c354a',stroke:'#a9d6ed'},svg);
 shape('text',{x:160,y:71,'text-anchor':'middle','font-size':18,fill:'#ffc976'},svg,'0,'+digits.join('')+'…');
 fig.append(table(spec.title||'División decimal',['Decimal Nº','Cifra','Resto que continúa'],rows));
 return fig;
}
function errorBand(spec,alt){
 const {center:c,resolution:r}=spec;
 if(!Number.isFinite(c)||!Number.isFinite(r)||r<=0||r>1000)return null;
 const lower=c-r/2,upper=c+r/2;
 const {fig,svg}=begin(spec.title||'Intervalo de redondeo',alt,156);
 shape('line',{x1:25,y1:71,x2:295,y2:71,stroke:'#b8d7ed','stroke-width':2},svg);
 shape('rect',{x:84,y:55,width:152,height:32,rx:5,fill:'#519ec1','fill-opacity':0.8},svg);
 for(const [x,txt] of [[84,lower],[160,c],[236,upper]]){
  shape('line',{x1:x,y1:48,x2:x,y2:93,stroke:'#ffd488','stroke-width':1.5},svg);
  shape('text',{x,y:111,'text-anchor':'middle','font-size':12,fill:'#edf7ff'},svg,String(Number(txt.toFixed(8))).replace('.',','));
 }
 fig.append(table(spec.title||'Intervalo',['Límite inferior','Valor representado','Límite superior'],[[
  Number(lower.toFixed(8)),c,Number(upper.toFixed(8))]]));
 return fig;
}
function unitScale(spec,alt){
 const rows=spec.rows;if(!Array.isArray(rows)||rows.length<2||rows.length>6||!rows.every(x=>Array.isArray(x)&&x.length===2))return null;
 const {fig,svg}=begin(spec.title||'Equivalencias de magnitud',alt,42*rows.length+20);
 rows.forEach((r,i)=>{
  const y=10+i*42;
  shape('rect',{x:16,y,width:288,height:33,rx:5,fill:'#1c354a',stroke:'#aed7e9'},svg);
  shape('text',{x:26,y:y+22,'font-size':13,fill:'#edf7ff'},svg,r[0]);
  shape('text',{x:293,y:y+22,'font-size':13,'text-anchor':'end',fill:'#ffc976'},svg,r[1]);
 });
 fig.append(table(spec.title||'Unidades',['Origen','Equivalencia exacta'],rows));
 return fig;
}
function sets(spec,alt){
 const {fig,svg}=begin(spec.title||'Conjuntos numéricos',alt,225);
 const levels=[
  {x:13,y:8,w:294,h:205,label:'R: números reales'},
  {x:30,y:39,w:205,h:165,label:'Q: racionales'},
  {x:48,y:70,w:153,h:125,label:'Z: enteros'},
  {x:65,y:103,w:103,h:82,label:'N: naturales'}
 ];
 levels.forEach((l,i)=>{
  shape('rect',{x:l.x,y:l.y,width:l.w,height:l.h,rx:8,stroke:'#afd6eb','stroke-width':1.5,fill:i%2?'#254c66':'#17374d'},svg);
  shape('text',{x:l.x+8,y:l.y+21,'font-size':12,fill:'#f0faff'},svg,l.label);
 });
 shape('text',{x:243,y:116,'text-anchor':'middle','font-size':10,fill:'#ffde9a'},svg,'R \\ Q');
 shape('text',{x:243,y:135,'text-anchor':'middle','font-size':9,fill:'#ffde9a'},svg,'irracionales');
 fig.append(table(spec.title||'Inclusiones',['Conjunto','Pertenencia','Ejemplo'],[
  ['N','Positivos naturales (también en Z, Q y R)','8'],
  ['Z','Enteros (también en Q y R)','−5'],
  ['Q','Cocientes de enteros con denominador no nulo','−3/2'],
  ['R fuera de Q','Irracionales','π']
 ]));
 return fig;
}
function interval(spec,alt){
 const {left:a,right:b,left_closed:lc,right_closed:rc}=spec;
 if(!Number.isFinite(a)||!Number.isFinite(b)||a>=b)return null;
 const {fig,svg}=begin(spec.title||'Intervalo',alt,155);
 shape('line',{x1:25,y1:64,x2:295,y2:64,stroke:'#bddef0','stroke-width':2},svg);
 shape('line',{x1:90,y1:64,x2:228,y2:64,stroke:'#ffcf7e','stroke-width':6},svg);
 for(const [x,value,closed] of [[90,a,lc],[228,b,rc]]){
  shape('circle',{cx:x,cy:64,r:6,stroke:'#ffe7b4',fill:closed?'#ffc976':'#1c354a','stroke-width':2},svg);
  shape('text',{x,y:95,'text-anchor':'middle','font-size':14,fill:'#ecfaff'},svg,value);
 }
 fig.append(table(spec.title||'Intervalo',['Extremo','Valor','¿Incluido?'],[['Izquierdo',a,lc?'Sí':'No'],['Derecho',b,rc?'Sí':'No']]));
 return fig;
}
function significant(spec,alt){
 const s=spec.value;if(typeof s!=='string'||s.length>16||!/^[-+]?[0-9]+,[0-9]+$/.test(s))return null;
 const raw=s.replace(',',''),first=raw.search(/[1-9]/);
 if(first<0)return null;
 const count=raw.length-first;
 const {fig,svg}=begin(spec.title||'Cifras significativas',alt,157);
 const start=24,step=272/raw.length;
 [...raw].forEach((digit,i)=>{
  const x=start+i*step;
  shape('rect',{x,y:30,width:step-2,height:43,rx:4,fill:i<first?'#425168':'#3b8da8',stroke:'#c0d9e8'},svg);
  shape('text',{x:x+(step-2)/2,y:56,'text-anchor':'middle','font-size':17,fill:'#edf7fd'},svg,digit);
 });
 shape('text',{x:160,y:111,'text-anchor':'middle','font-size':12,fill:'#ffe3a9'},svg,'Cifras significativas: '+count);
 fig.append(table(spec.title||'Medida',['Medida escrita','Ceros iniciales no significativos','Cifras significativas'],[[s,first,count]]));
 return fig;
}
export function renderWave6Visual(spec,alt){
 if(!spec||typeof spec!=='object')return null;
 if(spec.kind==='power_ladder')return power(spec,alt);
 if(spec.kind==='square_area')return square(spec,alt);
 if(spec.kind==='rational_line')return rational(spec,alt);
 if(spec.kind==='decimal_cycle')return decimalCycle(spec,alt);
 if(spec.kind==='error_band')return errorBand(spec,alt);
 if(spec.kind==='unit_scale')return unitScale(spec,alt);
 if(spec.kind==='set_nesting')return sets(spec,alt);
 if(spec.kind==='interval_line')return interval(spec,alt);
 if(spec.kind==='significant_digits')return significant(spec,alt);
 return null;
}

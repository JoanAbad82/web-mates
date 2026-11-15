// WEB MATES F3-24: estadística y distribuciones MACS I con tablas exactas.
// Gráficos locales declarativos: sin eval, sin red, sin entrada ejecutable del alumnado.
const NS='http://www.w3.org/2000/svg';
const ink={bg:'#16394f',axis:'#c6dfed',grid:'#45697d',curve:'#ffcb8d',tangent:'#a2e6ba',secant:'#dfb9ff'};
const node=(tag,value)=>{const el=document.createElement(tag);if(value!==undefined)el.textContent=String(value);return el;};
function svgEl(parent,tag,attrs={},value){
 const el=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
 if(value!==undefined)el.textContent=String(value);
 parent.append(el);return el;
}
function line(parent,x1,y1,x2,y2,color=ink.axis,width=1.5,dash=false){
 return svgEl(parent,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':width,'stroke-linecap':'round',
  ...(dash?{'stroke-dasharray':'5 4'}:{})});
}
function label(parent,x,y,value,color=ink.axis,size=11){
 svgEl(parent,'text',{x,y,fill:color,'font-size':size,'text-anchor':'middle'},value);
}
function values(spec,x){
 const m=spec.model||{};
 switch(m.kind){
  case 'quadratic':return m.a*(x-m.h)**2+m.k;
  case 'linear':return m.a*x+m.b;
  case 'exponential':return m.a*Math.pow(m.factor,x);
  case 'logarithm':return x>0&&m.base>0&&m.base!==1?Math.log(x)/Math.log(m.base):NaN;
  case 'sine':return m.midline+m.amplitude*Math.sin(m.frequency*x);
  case 'inverse':return x>0?m.k/x:NaN;
  case 'quartic':return m.scale*Math.pow(x*x+1,4);
  case 'cubic':return ((m.a*x+m.b)*x+m.c)*x+m.d;
  case 'rational':return Math.abs(x-m.shift)<1e-9?NaN:1/(x-m.shift)+(m.vertical||0);
  case 'hole':return x+m.b;
  case 'absolute':return (m.a??1)*Math.abs(x-(m.h??m.shift??0))+(m.k??0);
  case 'piecewise':return (x<m.threshold||(x===m.threshold&&m.left_closed!==false))?m.left_a*x+m.left_b:m.right_a*x+m.right_b;
  case 'sqrt':return x>=m.shift?Math.sqrt(Math.max(0,x-m.shift))+(m.vertical||0):NaN;
  default:return NaN;
 }
}
function derivative(spec,x){
 const m=spec.model||{};
 switch(m.kind){
  case 'quadratic':return 2*m.a*(x-m.h);
  case 'linear':return m.a;
  case 'exponential':return m.a*Math.log(m.factor)*Math.pow(m.factor,x);
  case 'inverse':return x>0?-m.k/(x*x):NaN;
  case 'quartic':return 8*m.scale*x*Math.pow(x*x+1,3);
  case 'cubic':return (3*m.a*x+2*m.b)*x+m.c;
  case 'hole':return 1;
  case 'piecewise':return x<=m.threshold?m.left_a:m.right_a;
  case 'absolute':return x<(m.h??m.shift??0)?-(m.a??1):x>(m.h??m.shift??0)?(m.a??1):NaN;
  default:return NaN;
 }
}
function dataTable(fig,spec){
 const table=node('table');table.className='f3-graph-table';
 table.append(node('caption','Alternativa matemática exacta: '+spec.title));
 const head=node('thead'),tr=node('tr');
 for(const title of ['Concepto / hipótesis','Valor o expresión exacta']){
  const th=node('th',title);th.scope='col';tr.append(th);
 }
 head.append(tr);table.append(head);
 const body=node('tbody');
 for(const pair of spec.rows){
  const row=node('tr');for(const value of pair)row.append(node('td',value));body.append(row);
 }
 table.append(body);fig.append(table);
}
function drawMatrix(svg,spec){
 const records=spec.rows;
 if(!Array.isArray(records)||records.length<3||records.length>7)return false;
 svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
 label(svg,160,20,'Esquema de matriz y resultados exactos',ink.axis,11);
 for(let i=0;i<records.length;i++){
  const y=35+i*28;
  svgEl(svg,'rect',{x:10,y:y-11,width:300,height:26,rx:3,fill:i%2===0?'#24566a':'#16394f',stroke:ink.grid,'stroke-width':0.7});
  const left=records[i][0],full=records[i][1];
  const right=full.length>28?full.slice(0,27)+'…':full;
  svgEl(svg,'text',{x:15,y:y+6,fill:ink.axis,'font-size':10},left.length>20?left.slice(0,18)+'…':left);
  svgEl(svg,'text',{x:148,y:y+6,fill:ink.curve,'font-size':10},right);
 }
 label(svg,160,229,'Consulte tabla siguiente para notación sin recortes',ink.axis,9);
 return true;
}
function drawStats(svg,spec){
 const m=spec.model,k=m.kind;
 if(k==='contingency'){
  const mtx=m.matrix,rows=m.row_labels,cols=m.col_labels;
  if(!Array.isArray(mtx)||mtx.length!==2||!mtx.every(a=>Array.isArray(a)&&a.length===2&&a.every(v=>Number.isInteger(v)&&v>=0))||
     !Array.isArray(rows)||rows.length!==2||!Array.isArray(cols)||cols.length!==2)return false;
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,19,'Tabla de contingencia ilustrativa',ink.axis,11);
  const x=[28,105,175,250],y=[55,108,157,205];
  const totals=[mtx[0][0]+mtx[1][0],mtx[0][1]+mtx[1][1]];
  const full=totals[0]+totals[1];
  const matrix=[['',...cols,'Total'],
   [String(rows[0]),...mtx[0].map(String),String(mtx[0][0]+mtx[0][1])],
   [String(rows[1]),...mtx[1].map(String),String(mtx[1][0]+mtx[1][1])],
   ['Total',...totals.map(String),String(full)]];
  matrix.forEach((row,i)=>row.forEach((value,j)=>{
   svgEl(svg,'rect',{x:x[j]-26,y:y[i]-20,width:65,height:32,fill:i===0||j===0?'#24566a':ink.bg,stroke:ink.grid,'stroke-width':0.8});
   label(svg,x[j]+4,y[i],String(value).slice(0,8),ink.axis,11);
  }));
  label(svg,160,236,'Denominadores y valores exactos en tabla',ink.axis,9);
  return true;
 }
 if(k==='scatter'){
  const pts=m.points;
  if(!Array.isArray(pts)||pts.length<3||pts.length>15||!pts.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))return false;
  let xMin=Math.min(...pts.map(v=>v[0])),xMax=Math.max(...pts.map(v=>v[0]));
  let yMin=Math.min(...pts.map(v=>v[1])),yMax=Math.max(...pts.map(v=>v[1]));
  if(xMin===xMax||yMin===yMax)return false;
  const xPad=Math.max(0.5,(xMax-xMin)*0.09),yPad=Math.max(0.5,(yMax-yMin)*0.09);
  xMin-=xPad;xMax+=xPad;yMin-=yPad;yMax+=yPad;
  const px=x=>44+(x-xMin)/(xMax-xMin)*250;
  const py=y=>204-(y-yMin)/(yMax-yMin)*167;
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,18,'Nube de pares observados (x,y)',ink.axis,11);
  line(svg,44,204,298,204,ink.axis,1.5);line(svg,44,204,44,30,ink.axis,1.5);
  label(svg,305,219,'x',ink.axis,11);label(svg,35,29,'y',ink.axis,11);
  if(Array.isArray(m.line)&&m.line.length===2&&m.line.every(Number.isFinite)){
   const [a,b]=m.line;
   // Line drawn within observed data range, never through unsupported extrapolation domain.
   const lo=Math.min(...pts.map(p=>p[0])),hi=Math.max(...pts.map(p=>p[0]));
   const p1=a+b*lo,p2=a+b*hi;
   line(svg,px(lo),py(p1),px(hi),py(p2),ink.tangent,1.8,true);
  }
  if(Array.isArray(m.quadratic)&&m.quadratic.length===3&&m.quadratic.every(Number.isFinite)){
   const [qa,qb,qc]=m.quadratic;
   // Draw quadratic ONLY across the observed x-domain; extrapolation is intentionally not visualized.
   const lo=Math.min(...pts.map(p=>p[0])),hi=Math.max(...pts.map(p=>p[0]));
   const count=48;
   for(let i=1;i<=count;i++){
    const xa=lo+(hi-lo)*(i-1)/count,xb=lo+(hi-lo)*i/count;
    const ya=qa+qb*xa+qc*xa*xa,yb=qa+qb*xb+qc*xb*xb;
    line(svg,px(xa),py(ya),px(xb),py(yb),ink.tangent,1.9,true);
   }
  }
  pts.forEach(([x,y],i)=>{
   svgEl(svg,'circle',{cx:px(x),cy:py(y),r:4.3,fill:ink.curve,stroke:ink.bg,'stroke-width':0.9});
   if(pts.length<=5)label(svg,px(x)+12,py(y)-9,String(i+1),ink.axis,8);
  });
  label(svg,160,234,'Pares, ajustes y límites exactos en tabla',ink.axis,9);
  return true;
 }
 if(k==='normal_curve'){
  const mu=m.mean,sigma=m.sigma,marks=m.marks||[];
  if(!Number.isFinite(mu)||!Number.isFinite(sigma)||sigma<=0||
    !Array.isArray(marks)||marks.length>8||!marks.every(Number.isFinite))return false;
  const lo=mu-3.2*sigma,hi=mu+3.2*sigma;
  const px=x=>35+(x-lo)/(hi-lo)*258;
  const py=x=>202-155*Math.exp(-0.5*Math.pow((x-mu)/sigma,2));
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,19,'Densidad normal teórica',ink.axis,11);
  line(svg,35,202,295,202,ink.axis,1.6);
  line(svg,35,202,35,29,ink.axis,1.4);
  for(let i=1;i<=64;i++){
   const xa=lo+(hi-lo)*(i-1)/64,xb=lo+(hi-lo)*i/64;
   line(svg,px(xa),py(xa),px(xb),py(xb),ink.curve,1.6);
  }
  marks.forEach((x,i)=>{
   if(x<lo||x>hi)return;
   line(svg,px(x),202,px(x),py(x),ink.tangent,1.1,true);
   label(svg,px(x),219,String(x).slice(0,8),ink.axis,9);
  });
  label(svg,160,235,'Áreas y valores exactos en la tabla',ink.axis,9);
  return true;
 }
 if(k==='stats_bars'){
  const values=m.counts,labels=m.labels;
  if(!Array.isArray(values)||!Array.isArray(labels)||values.length!==labels.length||
     values.length<2||values.length>16||!values.every(v=>Number.isFinite(v)&&v>=0)||!labels.every(v=>typeof v==='string'))return false;
  const max=Math.max(1,...values),left=22,right=305,top=37,bottom=201;
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,18,'Frecuencias o medidas declaradas',ink.axis,11);
  line(svg,left,bottom,right,bottom,ink.axis,1.6);
  const cell=(right-left)/values.length;
  values.forEach((v,i)=>{
   const width=cell*0.7,x=left+cell*(i+0.15),height=(bottom-top)*v/max;
   svgEl(svg,'rect',{x:x.toFixed(2),y:(bottom-height).toFixed(2),width:width.toFixed(2),height:Math.max(1,height).toFixed(2),fill:ink.curve});
   if(values.length<=6){label(svg,x+width/2,Math.max(31,bottom-height-7),String(v),ink.axis,9);
    label(svg,x+width/2,223,labels[i].slice(0,8),ink.axis,9);}
  });
  if(values.length>6)label(svg,160,222,'Etiquetas exactas en tabla inferior',ink.axis,10);
  return true;
 }
 if(k==='prob_tree'){
  const first=m.first,weights=m.weights;
  if(!Array.isArray(first)||!Array.isArray(weights)||first.length!==weights.length||
     first.length<2||first.length>4||!first.every(v=>typeof v==='string')||!weights.every(v=>typeof v==='string'))return false;
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,18,'Esquema de árbol: primera etapa',ink.axis,11);
  const rootX=28,rootY=122,middleX=135;
  svgEl(svg,'circle',{cx:rootX,cy:rootY,r:4,fill:ink.curve});
  first.forEach((v,i)=>{
   const y=50+i*(145/Math.max(1,first.length-1));
   line(svg,rootX+6,rootY,middleX,y,ink.curve,2);
   svgEl(svg,'circle',{cx:middleX,cy:y,r:4,fill:ink.curve});
   label(svg,171,y-10,String(v).slice(0,12),ink.axis,11);
   label(svg,171,y+6,String(weights[i]).slice(0,12),ink.tangent,10);
  });
  // Second-stage branches shown only as a partial illustration from first node.
  // No claim that this is a full exhaustive tree: table preserves exact paths.
  if(Array.isArray(m.second)&&Array.isArray(m.second_weights)&&m.second.length===m.second_weights.length&&first.length===2){
   const top=50,endX=285;
   m.second.forEach((v,i)=>{
    const targetY=27+i*(40/Math.max(1,m.second.length-1));
    line(svg,middleX+4,top,endX-34,targetY,ink.secant,1.4);
    label(svg,endX-15,targetY-2,String(v).slice(0,9),ink.axis,8);
    label(svg,endX-15,targetY+11,String(m.second_weights[i]).slice(0,9),ink.tangent,8);
   });
  }
  label(svg,160,232,'Ramas ilustrativas; árbol exacto en tabla',ink.axis,9);
  return true;
 }
 if(k==='stats_box'){
  const p=m.five;
  if(!Array.isArray(p)||p.length!==5||!p.every(Number.isFinite)||p.some((v,i)=>i>0&&v<p[i-1]))return false;
  let [lo,q1,mid,q3,hi]=p,minimum=lo-1,maximum=hi+1;
  const px=x=>24+(x-minimum)/(maximum-minimum)*272;
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,21,'Diagrama de caja: convención declarada',ink.axis,10);
  line(svg,px(lo),123,px(hi),123,ink.axis,2);
  line(svg,px(lo),108,px(lo),138,ink.axis,2);
  line(svg,px(hi),108,px(hi),138,ink.axis,2);
  svgEl(svg,'rect',{x:px(q1),y:92,width:Math.max(1,px(q3)-px(q1)),height:62,fill:ink.curve,'fill-opacity':0.4,stroke:ink.curve,'stroke-width':2});
  line(svg,px(mid),92,px(mid),154,ink.tangent,2.5);
  [lo,q1,mid,q3,hi].forEach((v,i)=>label(svg,px(v),i%2===0?180:203,String(v),ink.axis,11));
  label(svg,160,227,'Mín/Q1/mediana/Q3/máx exactos en tabla',ink.axis,9);
  return true;
 }
 if(k==='lp_axes'){
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,20,'No negatividad sin cota superior',ink.axis,11);
  line(svg,52,210,297,210,ink.axis,2);line(svg,52,210,52,33,ink.axis,2);
  label(svg,300,228,'x',ink.axis,12);label(svg,40,32,'y',ink.axis,12);
  svgEl(svg,'rect',{x:56,y:35,width:235,height:171,fill:ink.tangent,'fill-opacity':0.18});
  label(svg,176,106,'x≥0; y≥0: región no acotada',ink.axis,11);
  label(svg,176,144,'Faltan restricciones de capacidad',ink.axis,10);
  label(svg,160,236,'Véase tabla con objetivo y unidades',ink.axis,9);
  return true;
 }
 if(k==='lp_axes'){
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,20,'No negatividad sin cota superior',ink.axis,11);
  line(svg,52,210,297,210,ink.axis,2);line(svg,52,210,52,33,ink.axis,2);
  label(svg,300,228,'x',ink.axis,12);label(svg,40,32,'y',ink.axis,12);
  svgEl(svg,'rect',{x:56,y:35,width:235,height:171,fill:ink.tangent,'fill-opacity':0.18});
  label(svg,176,106,'x≥0; y≥0: región no acotada',ink.axis,11);
  label(svg,176,144,'Faltan restricciones de capacidad',ink.axis,10);
  label(svg,160,236,'Véase tabla con objetivo y unidades',ink.axis,9);
  return true;
 }
 if(k==='linear_program'){
  const polygon=m.polygon,obj=m.objective;
  if(!Array.isArray(polygon)||polygon.length<3||polygon.length>10||
     !polygon.every(v=>Array.isArray(v)&&v.length===2&&v.every(x=>Number.isFinite(x)&&x>=0&&x<=30))||
     !Array.isArray(obj)||obj.length!==2||!obj.every(Number.isFinite))return false;
  const bound=Math.max(7,...polygon.flat())+0.7,scale=184/bound;
  const px=x=>58+scale*x,py=y=>210-scale*y;
  svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
  label(svg,160,17,'Región factible y objetivo lineal',ink.axis,11);
  line(svg,58,210,298,210,ink.axis,1.7);line(svg,58,210,58,28,ink.axis,1.7);
  label(svg,301,224,'x',ink.axis,12);label(svg,45,28,'y',ink.axis,12);
  const closed=polygon.map(v=>px(v[0]).toFixed(1)+','+py(v[1]).toFixed(1)).join(' ');
  svgEl(svg,'polygon',{points:closed,fill:ink.tangent,'fill-opacity':0.28,stroke:ink.curve,'stroke-width':2});
  polygon.forEach((v,i)=>{
   svgEl(svg,'circle',{cx:px(v[0]),cy:py(v[1]),r:3.2,fill:ink.curve});
   if(i<6)label(svg,px(v[0])+11,py(v[1])-7,'('+v.join(',')+')',ink.axis,9);
  });
  // Objective geometry is advisory; exact values and constraints remain in HTML table.
  label(svg,166,238,'Conjunto exacto y restricciones: tabla',ink.axis,9);
  return true;
 }
 return false;
}
function draw(svg,spec){
 if(spec.model&&spec.model.kind==='matrix')return drawMatrix(svg,spec);
 if(spec.model&&['stats_bars','stats_box','linear_program','lp_axes','prob_tree','scatter','contingency','normal_curve'].includes(spec.model.kind))return drawStats(svg,spec);
 const [xmin,xmax]=spec.domain;
 if(!Number.isFinite(xmin)||!Number.isFinite(xmax)||xmax<=xmin||xmax-xmin>30)return false;
 const model=spec.model;const k=model.kind;
 if(!['quadratic','linear','exponential','inverse','quartic','cubic','rational','hole','absolute','piecewise','sqrt','logarithm','sine'].includes(k))return false;
 if(!Number.isFinite(model.a??1)||!Number.isFinite(model.b??0)||!Number.isFinite(model.c??0)||!Number.isFinite(model.d??0))return false;
 const sample=[];
 for(let i=0;i<=240;i++){
  const x=xmin+(xmax-xmin)*i/240,y=values(spec,x);
  if(Number.isFinite(y)&&Math.abs(y)<1500)sample.push(y);
 }
 for(const mark of spec.marks){
  if(!Array.isArray(mark)||mark.length!==3||typeof mark[0]!=='string'||!mark.slice(1).every(Number.isFinite))return false;
  if(mark[1]>=xmin&&mark[1]<=xmax)sample.push(mark[2]);
 }
 if(sample.length<3)return false;
 const sorted=[...sample].sort((a,b)=>a-b);
 const low=sorted[Math.floor((sorted.length-1)*0.06)];
 const high=sorted[Math.floor((sorted.length-1)*0.94)];
 const spread=Math.max(2,high-low);
 const ymin=Math.min(low-spread*0.13,0),ymax=Math.max(high+spread*0.13,0);
 if(!Number.isFinite(ymin)||!Number.isFinite(ymax)||ymax<=ymin)return false;
 const frame={left:42,right:298,top:21,bottom:207};
 const px=x=>frame.left+(x-xmin)/(xmax-xmin)*(frame.right-frame.left);
 const py=y=>frame.bottom-(y-ymin)/(ymax-ymin)*(frame.bottom-frame.top);
 svgEl(svg,'rect',{x:0,y:0,width:320,height:243,rx:8,fill:ink.bg});
 const clipId='w24clip'+(++draw.counter);
 const defs=svgEl(svg,'defs'),clip=svgEl(defs,'clipPath',{id:clipId});
 svgEl(clip,'rect',{x:frame.left,y:frame.top,width:frame.right-frame.left,height:frame.bottom-frame.top});
 const group=svgEl(svg,'g',{'clip-path':'url(#'+clipId+')'});
 for(let n=Math.ceil(xmin);n<=xmax;n++)line(group,px(n),frame.top,px(n),frame.bottom,ink.grid,0.75);
 const dy=Math.pow(10,Math.floor(Math.log10((ymax-ymin)/5)));
 if(Number.isFinite(dy)&&dy>0){
  const step=dy*2;
  for(let y=Math.ceil(ymin/step)*step;y<=ymax;y+=step){
   line(group,frame.left,py(y),frame.right,py(y),ink.grid,0.75);
  }
 }
 if(xmin<=0&&xmax>=0)line(group,px(0),frame.top,px(0),frame.bottom,ink.axis,1.5);
 if(ymin<=0&&ymax>=0)line(group,frame.left,py(0),frame.right,py(0),ink.axis,1.5);
 if(k==='inverse'){
  line(group,px(0),frame.top,px(0),frame.bottom,ink.tangent,1.6,true);
  if(ymin<=0&&ymax>=0)line(group,frame.left,py(0),frame.right,py(0),ink.tangent,1.3,true);
 }
 if(k==='rational'){
  line(group,px(model.shift),frame.top,px(model.shift),frame.bottom,ink.tangent,1.6,true);
  if((model.vertical||0)>=ymin&&(model.vertical||0)<=ymax){
   line(group,frame.left,py(model.vertical||0),frame.right,py(model.vertical||0),ink.tangent,1.3,true);
  }
 }
 let path='',last=null,segments=0;
 for(let i=0;i<=480;i++){
  const x=xmin+(xmax-xmin)*i/480,y=values(spec,x);
  if(!Number.isFinite(y)||Math.abs(y)>1500){last=null;continue;}
  const jump=last&&(
    (k==='rational'&&(x-model.shift)*(last.x-model.shift)<=0)||
    (k==='piecewise'&&last.x<model.threshold&&x>=model.threshold)||
    Math.abs(y-last.y)>1.3*(ymax-ymin));
  if(!last||jump){path+=' M'+px(x).toFixed(2)+' '+py(y).toFixed(2);segments++;}
  else path+=' L'+px(x).toFixed(2)+' '+py(y).toFixed(2);
  last={x,y};
 }
 if(!segments)return false;
 svgEl(group,'path',{d:path,fill:'none',stroke:ink.curve,'stroke-width':2.7,'stroke-linejoin':'round'});
 const shadeRange=Array.isArray(model.fill)?model.fill:model.shade;
 if(Array.isArray(shadeRange)&&shadeRange.length===2){
  const [l,h]=shadeRange;
  if(l<h&&[l,h].every(Number.isFinite)&&l>=xmin&&h<=xmax&&ymin<=0&&ymax>=0){
   // Split by zeros of the actual integrand, not by x=0; account for opposite signs.
   const cuts=[l],samples=160;
   let lastX=l,lastY=values(spec,l);
   for(let i=1;i<=samples;i++){
    const x=l+(h-l)*i/samples,y=values(spec,x);
    if(Number.isFinite(y)&&Number.isFinite(lastY)){
     if(lastY*y<0){
      const root=lastX+(x-lastX)*Math.abs(lastY)/(Math.abs(lastY)+Math.abs(y));
      if(root>l&&root<h)cuts.push(root);
     }else if(y===0&&x>l&&x<h)cuts.push(x);
    }
    lastX=x;lastY=y;
   }
   cuts.push(h);
   const unique=[...new Set(cuts)].sort((a,b)=>a-b);
   for(let j=0;j<unique.length-1;j++){
    const a=unique[j],b=unique[j+1],mid=(a+b)/2;
    if(b-a<1e-10||!Number.isFinite(values(spec,mid)))continue;
    let polygon='M'+px(a).toFixed(2)+' '+py(0).toFixed(2);
    const count=70;
    for(let i=0;i<=count;i++){
      const x=a+(b-a)*i/count,y=values(spec,x);
      if(!Number.isFinite(y))continue;
      polygon+=' L'+px(x).toFixed(2)+' '+py(y).toFixed(2);
    }
    polygon+=' L'+px(b).toFixed(2)+' '+py(0).toFixed(2)+' Z';
    svgEl(group,'path',{d:polygon,fill:values(spec,mid)<0?ink.secant:ink.tangent,'fill-opacity':0.26});
   }
  }
 }
 if(k==='linear'&&Number.isFinite(model.second_a)&&Number.isFinite(model.second_b)){
  const y1=model.second_a*xmin+model.second_b;
  const y2=model.second_a*xmax+model.second_b;
  line(group,px(xmin),py(y1),px(xmax),py(y2),ink.secant,2,true);
 }
 if(k==='hole'&&model.hole>=xmin&&model.hole<=xmax){
  const x=model.hole,y=values(spec,x);
  svgEl(group,'circle',{cx:px(x),cy:py(y),r:5,fill:ink.bg,stroke:ink.curve,'stroke-width':2});
 }
 if(k==='piecewise'&&Number.isFinite(model.threshold)){
  const x=model.threshold,yLeft=model.left_a*x+model.left_b,yRight=model.right_a*x+model.right_b;
  svgEl(group,'circle',{cx:px(x),cy:py(yLeft),r:4.3,fill:model.left_closed===false?ink.bg:ink.curve,stroke:ink.curve,'stroke-width':2});
  if(yLeft!==yRight)svgEl(group,'circle',{cx:px(x),cy:py(yRight),r:4.3,fill:model.left_closed===false?ink.curve:ink.bg,stroke:ink.curve,'stroke-width':2});
 }
 const drawLine=(x1,y1,x2,y2,color)=>{
  if([x1,y1,x2,y2].every(Number.isFinite))line(group,px(x1),py(y1),px(x2),py(y2),color,2,true);
 };
 if(Number.isFinite(model.tangent_x)){
  const x=model.tangent_x,y=values(spec,x),m=derivative(spec,x);
  if(Number.isFinite(y)&&Number.isFinite(m)){
   const L=xmin,H=xmax;
   drawLine(L,y+m*(L-x),H,y+m*(H-x),ink.tangent);
  }
 }
 if(Array.isArray(model.secant)&&model.secant.length===2){
  const [a,b]=model.secant;
  if(a!==b){
   const fa=values(spec,a),fb=values(spec,b);
   const slope=(fb-fa)/(b-a);
   if(Number.isFinite(slope))drawLine(xmin,fa+slope*(xmin-a),xmax,fa+slope*(xmax-a),ink.secant);
  }
 }
 for(const mark of spec.marks){
  const [name,x,y]=mark;
  if(x<xmin||x>xmax||y<ymin||y>ymax)continue;
  const boundaryLeft=model.left_a*x+model.left_b;
  const boundaryRight=model.right_a*x+model.right_b;
  const openAtBoundary=k==='piecewise'&&x===model.threshold&&boundaryLeft!==boundaryRight&&
    ((model.left_closed===false&&y===boundaryLeft)||(model.left_closed!==false&&y===boundaryRight));
  const hole=/hueco|agujero/i.test(name)||openAtBoundary;
  svgEl(group,'circle',{cx:px(x),cy:py(y),r:4,fill:hole?ink.bg:ink.tangent,
   stroke:ink.tangent,'stroke-width':1.7});
  label(group,px(x)+11,py(y)-8,name,ink.tangent,10);
 }
 line(svg,frame.left,frame.top,frame.right,frame.top,ink.axis,1);
 line(svg,frame.left,frame.bottom,frame.right,frame.bottom,ink.axis,1);
 line(svg,frame.left,frame.top,frame.left,frame.bottom,ink.axis,1);
 line(svg,frame.right,frame.top,frame.right,frame.bottom,ink.axis,1);
 label(svg,170,231,'x de '+xmin+' a '+xmax+' · valores exactos en la tabla',ink.axis,10);
 return true;
}
draw.counter=0;
export function renderWave24SocialStatisticsVisual(spec,alt){
 if(!spec||spec.render_family!=='wave24'||typeof spec.title!=='string'||!Array.isArray(spec.rows)||
   spec.rows.length<3||spec.rows.length>12||
   !spec.rows.every(row=>Array.isArray(row)&&row.length===2&&row.every(v=>typeof v==='string'))||
   !spec.model||typeof spec.model.kind!=='string'||!Array.isArray(spec.domain)||spec.domain.length!==2||
   !Array.isArray(spec.marks))return null;
 const fig=node('figure');fig.className='f3-function-graph f3-wave24-social-stats';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 243');
 svg.setAttribute('role','img');svg.setAttribute('class','f3-graph-svg');
 svg.setAttribute('aria-label',alt||spec.title);
 fig.append(svg,node('figcaption',spec.title));
 if(!draw(svg,spec))return null;
 dataTable(fig,spec);return fig;
}

// WEB MATES F3-14: derivada, límite, continuidad y optimización con tablas exactas.
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
  case 'cubic':return ((m.a*x+m.b)*x+m.c)*x+m.d;
  case 'rational':return Math.abs(x-m.shift)<1e-9?NaN:1/(x-m.shift)+(m.vertical||0);
  case 'hole':return x+m.b;
  case 'absolute':return Math.abs(x-m.shift);
  case 'piecewise':return x<m.join?x+2:m.k*x;
  case 'sqrt':return x>=m.shift?Math.sqrt(Math.max(0,x-m.shift))+(m.vertical||0):NaN;
  default:return NaN;
 }
}
function derivative(spec,x){
 const m=spec.model||{};
 switch(m.kind){
  case 'quadratic':return 2*m.a*(x-m.h);
  case 'cubic':return (3*m.a*x+2*m.b)*x+m.c;
  case 'hole':return 1;
  case 'piecewise':return x<m.join?1:m.k;
  case 'absolute':return x<m.shift?-1:x>m.shift?1:NaN;
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
function draw(svg,spec){
 const [xmin,xmax]=spec.domain;
 if(!Number.isFinite(xmin)||!Number.isFinite(xmax)||xmax<=xmin||xmax-xmin>30)return false;
 const model=spec.model;const k=model.kind;
 if(!['quadratic','cubic','rational','hole','absolute','piecewise','sqrt'].includes(k))return false;
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
 const clipId='w14clip'+(++draw.counter);
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
    (k==='piecewise'&&last.x<model.join&&x>=model.join)||
    Math.abs(y-last.y)>1.3*(ymax-ymin));
  if(!last||jump){path+=' M'+px(x).toFixed(2)+' '+py(y).toFixed(2);segments++;}
  else path+=' L'+px(x).toFixed(2)+' '+py(y).toFixed(2);
  last={x,y};
 }
 if(!segments)return false;
 svgEl(group,'path',{d:path,fill:'none',stroke:ink.curve,'stroke-width':2.7,'stroke-linejoin':'round'});
 if(k==='hole'&&model.hole>=xmin&&model.hole<=xmax){
  const x=model.hole,y=values(spec,x);
  svgEl(group,'circle',{cx:px(x),cy:py(y),r:5,fill:ink.bg,stroke:ink.curve,'stroke-width':2});
 }
 if(k==='piecewise'){
  const x=model.join,yLeft=x+2,yRight=model.k*x;
  svgEl(group,'circle',{cx:px(x),cy:py(yLeft),r:4.3,fill:ink.bg,stroke:ink.curve,'stroke-width':2});
  svgEl(group,'circle',{cx:px(x),cy:py(yRight),r:4.3,fill:ink.curve});
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
  const hole=/hueco|agujero/i.test(name);
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
export function renderWave14DerivativeVisual(spec,alt){
 if(!spec||spec.render_family!=='wave14'||typeof spec.title!=='string'||!Array.isArray(spec.rows)||
   spec.rows.length<3||spec.rows.length>12||
   !spec.rows.every(row=>Array.isArray(row)&&row.length===2&&row.every(v=>typeof v==='string'))||
   !spec.model||typeof spec.model.kind!=='string'||!Array.isArray(spec.domain)||spec.domain.length!==2||
   !Array.isArray(spec.marks))return null;
 const fig=node('figure');fig.className='f3-function-graph f3-wave14-derivatives';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 243');
 svg.setAttribute('role','img');svg.setAttribute('class','f3-graph-svg');
 svg.setAttribute('aria-label',alt||spec.title);
 fig.append(svg,node('figcaption',spec.title));
 if(!draw(svg,spec))return null;
 dataTable(fig,spec);return fig;
}

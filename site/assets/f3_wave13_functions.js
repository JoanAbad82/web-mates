// WEB MATES F3-13: curvas matemáticas originales, tabla semántica exacta, sin red.
const NS='http://www.w3.org/2000/svg';
const palette={line:'#b9e3f0',curve:'#ffd29a',ink:'#ecf8ff',aux:'#9fe8bd',bg:'#18394f'};
const plain=(tag,content)=>{const n=document.createElement(tag);if(content!==undefined)n.textContent=String(content);return n;};
function shape(parent,tag,attrs={},content){
 const e=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
 if(content!==undefined)e.textContent=String(content);
 parent.append(e);return e;
}
function stroke(parent,x1,y1,x2,y2,color=palette.line,width=1.5,dash=false){
 shape(parent,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':width,...(dash?{'stroke-dasharray':'5 4'}:{})});
}
function text(parent,x,y,content,size=11,color=palette.ink){
 shape(parent,'text',{x,y,'font-size':size,'text-anchor':'middle',fill:color},content);
}
function table(fig,spec){
 const t=plain('table');t.className='f3-graph-table';
 t.append(plain('caption','Datos matemáticos exactos y condiciones: '+spec.title));
 const h=plain('thead'),row=plain('tr');
 for(const str of ['Elemento','Resultado exacto o condición']){
  const th=plain('th',str);th.scope='col';row.append(th);
 }
 h.append(row);t.append(h);
 const body=plain('tbody');
 for(const pair of spec.rows){
  const tr=plain('tr');for(const value of pair)tr.append(plain('td',value));body.append(tr);
 }
 t.append(body);fig.append(t);
}
function evaluate(model,x){
 const m=model||{};
 switch(m.kind){
  case 'linear':return m.a*x+m.b;
  case 'quadratic':return m.a*(x-m.h)*(x-m.h)+m.k;
  case 'rational':return Math.abs(x-m.shift)<1e-10?NaN:m.a/(x-m.shift)+(m.vertical||0);
  case 'exponential':return Math.pow(m.base,x);
  case 'logarithmic':return x>m.shift?Math.log(x-m.shift)/Math.log(m.base):NaN;
  case 'sqrt':return x>=m.shift?(m.scale||1)*Math.sqrt(Math.max(0,x-m.shift))+(m.vertical||0):NaN;
  case 'sine':return m.amplitude*Math.sin(m.frequency*x+(m.shift||0));
  case 'piecewise':return x<0?x+1:x*x;
  default:return NaN;
 }
}
function yLimits(model){
 switch(model.kind){
  case 'linear':return [-5,11];
  case 'quadratic':return [Math.min(-5,model.k-1),Math.max(11,model.k+10)];
  case 'rational':return [(model.vertical||0)-7,(model.vertical||0)+7];
  case 'exponential':return [-1,12];
  case 'logarithmic':return [-4,5];
  case 'sqrt':return [-1,8];
  case 'sine':return [-2.2,2.2];
  case 'piecewise':return [-3,8];
  default:return [-5,5];
 }
}
let nextId=0;
function plot(s,spec){
 const model=spec.model||{},bounds=spec.domain||[-5,5];
 if(!Array.isArray(bounds)||bounds.length!==2||!bounds.every(Number.isFinite)||bounds[1]<=bounds[0])return false;
 const [xmin,xmax]=bounds,[ymin,ymax]=yLimits(model);
 if(![ymin,ymax].every(Number.isFinite)||ymax<=ymin)return false;
 const frame={left:41,right:299,top:24,bottom:208};
 const px=x=>frame.left+(x-xmin)/(xmax-xmin)*(frame.right-frame.left);
 const py=y=>frame.bottom-(y-ymin)/(ymax-ymin)*(frame.bottom-frame.top);
 shape(s,'rect',{x:0,y:0,width:320,height:244,rx:8,fill:palette.bg});
 const id='wave13clip'+(++nextId);
 const defs=shape(s,'defs'),clip=shape(defs,'clipPath',{id});
 shape(clip,'rect',{x:frame.left,y:frame.top,width:frame.right-frame.left,height:frame.bottom-frame.top});
 const g=shape(s,'g',{'clip-path':'url(#'+id+')'});
 for(let x=Math.ceil(xmin);x<=xmax;x++){
  const X=px(x);stroke(g,X,frame.top,X,frame.bottom,'#335469',0.7);
 }
 for(let y=Math.ceil(ymin);y<=ymax;y+=2){
  const Y=py(y);stroke(g,frame.left,Y,frame.right,Y,'#335469',0.7);
 }
 if(xmin<=0&&xmax>=0)stroke(g,px(0),frame.top,px(0),frame.bottom,palette.line,1.7);
 if(ymin<=0&&ymax>=0)stroke(g,frame.left,py(0),frame.right,py(0),palette.line,1.7);
 if(model.kind==='rational'){
  stroke(g,px(model.shift),frame.top,px(model.shift),frame.bottom,palette.aux,1.6,true);
  const Y=py(model.vertical||0);stroke(g,frame.left,Y,frame.right,Y,palette.aux,1.3,true);
 }
 if(model.kind==='logarithmic')stroke(g,px(model.shift),frame.top,px(model.shift),frame.bottom,palette.aux,1.6,true);
 if(model.kind==='exponential'&&ymin<=0&&ymax>=0)stroke(g,frame.left,py(0),frame.right,py(0),palette.aux,1.3,true);
 const n=320,dx=(xmax-xmin)/n;
 let path='',last=null,parts=0;
 for(let i=0;i<=n;i++){
  const x=xmin+i*dx,y=evaluate(model,x);
  const valid=Number.isFinite(y)&&Math.abs(y)<1000;
  if(!valid){last=null;continue;}
  const point=[px(x),py(y)];
  const broken=last&&(
    ((model.kind==='rational')&&((last.x-model.shift)*(x-model.shift)<=0))||
    ((model.kind==='piecewise')&&(last.x<0&&x>=0))||
    (Math.abs(last.y-y)>2*(ymax-ymin)));
  if(!last||broken){path+=' M'+point.map(x=>x.toFixed(2)).join(' ');parts++;}
  else path+=' L'+point.map(x=>x.toFixed(2)).join(' ');
  last={x,y};
 }
 if(parts===0)return false;
 shape(g,'path',{d:path,fill:'none',stroke:palette.curve,'stroke-width':2.7,
   'stroke-linecap':'round','stroke-linejoin':'round'});
 if(model.kind==='piecewise'){
  shape(g,'circle',{cx:px(0),cy:py(1),r:4,fill:palette.bg,stroke:palette.curve,'stroke-width':2});
  shape(g,'circle',{cx:px(0),cy:py(0),r:4,fill:palette.curve});
 }
 for(const mark of spec.marks||[]){
  if(!Array.isArray(mark)||mark.length!==3||typeof mark[0]!=='string'||!mark.slice(1).every(Number.isFinite))return false;
  const [name,x,y]=mark;
  if(x<xmin||x>xmax||y<ymin||y>ymax)continue;
  const hole=/hueco|agujero/i.test(name);
  shape(g,'circle',{cx:px(x),cy:py(y),r:4.1,fill:hole?palette.bg:palette.aux,
    stroke:palette.aux,'stroke-width':1.7});
  text(g,px(x)+13,py(y)-8,name,10,palette.aux);
 }
 stroke(s,frame.left,frame.top,frame.right,frame.top,palette.line,1);
 stroke(s,frame.left,frame.bottom,frame.right,frame.bottom,palette.line,1);
 stroke(s,frame.left,frame.top,frame.left,frame.bottom,palette.line,1);
 stroke(s,frame.right,frame.top,frame.right,frame.bottom,palette.line,1);
 text(s,171,231,'x: '+xmin+' a '+xmax+' · Valores exactos en la tabla',10,palette.line);
 text(s,31,20,'y',10);text(s,307,214,'x',10);
 return true;
}
export function renderWave13FunctionsVisual(spec,alt){
 if(!spec||typeof spec.title!=='string'||!Array.isArray(spec.rows)||
  spec.rows.length<3||spec.rows.length>12||
  !spec.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(v=>typeof v==='string'))||
  !spec.model||typeof spec.model.kind!=='string'||!Array.isArray(spec.domain)||!Array.isArray(spec.marks))return null;
 if(!['linear','quadratic','rational','exponential','logarithmic','sqrt','sine','piecewise'].includes(spec.model.kind))return null;
 const fig=plain('figure');fig.className='f3-function-graph f3-wave13-functions';
 const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 320 244');
 s.setAttribute('role','img');s.setAttribute('class','f3-graph-svg');
 s.setAttribute('aria-label',alt||spec.title);
 fig.append(s,plain('figcaption',spec.title));
 if(!plot(s,spec))return null;
 table(fig,spec);return fig;
}

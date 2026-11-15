// F3 ola 2: gráfica progresiva SVG con tabla alternativa, sin red ni código de estudiante.
const NS='http://www.w3.org/2000/svg';
const el=(tag,value)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);return n;};
const svgEl=tag=>document.createElementNS(NS,tag);
const pretty=x=>String(Math.round(x*1000)/1000);
function calculate(coeff,x){return coeff.reduce((sum,c,i)=>sum+c*Math.pow(x,i),0);}
export function renderFunctionGraph(spec,alt='Gráfica accesible'){
 if(!spec||!['line','quadratic'].includes(spec.kind)||!Array.isArray(spec.coefficients)||
   !spec.coefficients.every(Number.isFinite)||!Array.isArray(spec.x_values)||
   spec.x_values.length<2||spec.x_values.length>15||!spec.x_values.every(Number.isFinite))return null;
 const x0=Math.min(...spec.x_values),x1=Math.max(...spec.x_values);
 if(x1<=x0)return null;
 const xs=Array.from({length:81},(_,i)=>x0+(x1-x0)*i/80);
 const ys=xs.map(x=>calculate(spec.coefficients,x));
 if(!ys.every(Number.isFinite))return null;
 const rawMin=Math.min(...ys),rawMax=Math.max(...ys),ypad=Math.max(1,(rawMax-rawMin)*0.1);
 const minY=rawMin-ypad,maxY=rawMax+ypad,W=320,H=210,left=38,right=14,top=16,bottom=34;
 const px=x=>left+(x-x0)/(x1-x0)*(W-left-right);
 const py=y=>top+(maxY-y)/(maxY-minY)*(H-top-bottom);
 const wrap=el('figure');wrap.className='f3-function-graph';
 const svg=svgEl('svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);
 svg.setAttribute('width',String(W));svg.setAttribute('height',String(H));
 svg.setAttribute('role','img');svg.setAttribute('aria-label',alt);svg.setAttribute('class','f3-graph-svg');
 const line=(a,b,c,d,color)=>{const n=svgEl('line');
  for(const [k,v] of Object.entries({x1:a,y1:b,x2:c,y2:d}))n.setAttribute(k,String(v));
  n.setAttribute('stroke',color);n.setAttribute('stroke-width','1.5');svg.append(n);};
 line(left,py(Math.max(minY,Math.min(maxY,0))),W-right,py(Math.max(minY,Math.min(maxY,0))),'#97b5c8');
 line(px(Math.max(x0,Math.min(x1,0))),top,px(Math.max(x0,Math.min(x1,0))),H-bottom,'#97b5c8');
 const path=svgEl('path');
 path.setAttribute('d',xs.map((x,i)=>(i?'L':'M')+px(x).toFixed(2)+','+py(ys[i]).toFixed(2)).join(' '));
 path.setAttribute('stroke','#77d3ff');path.setAttribute('stroke-width','3');path.setAttribute('fill','none');
 svg.append(path);
 for(const x of spec.x_values){const n=svgEl('circle');n.setAttribute('cx',String(px(x)));
  n.setAttribute('cy',String(py(calculate(spec.coefficients,x))));n.setAttribute('r','3.8');
  n.setAttribute('fill','#ffca75');svg.append(n);}
 const label=(x,y,value)=>{const n=svgEl('text');n.setAttribute('x',String(x));n.setAttribute('y',String(y));
  n.setAttribute('fill','#d9e8f6');n.setAttribute('font-size','12');n.setAttribute('text-anchor','middle');
  n.textContent=value;svg.append(n);};
 label(left+14,H-8,pretty(x0));label(W-right-12,H-8,pretty(x1));
 label(16,top+6,pretty(maxY));label(16,H-bottom,pretty(minY));
 wrap.append(svg,el('figcaption',spec.title||alt));
 const table=el('table');table.className='f3-graph-table';
 const head=el('thead'),hrow=el('tr');
 for(const col of ['Entrada x','Salida y']){const th=el('th',col);th.scope='col';hrow.append(th);}
 head.append(hrow);
 const body=el('tbody');
 for(const x of spec.x_values){const tr=el('tr');tr.append(el('td',pretty(x)),el('td',pretty(calculate(spec.coefficients,x))));body.append(tr);}
 table.append(el('caption','Tabla de valores exactos (alternativa a la gráfica)'),head,body);
 wrap.append(table);return wrap;
}

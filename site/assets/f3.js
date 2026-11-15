// WEB MATES F3 — vista multiunidad. Reutiliza íntegramente el motor F2.
import {createExerciseEngine} from './core/engine.js';
import {renderFunctionGraph} from './f3_graph.js';
import {renderConceptVisual} from './f3_visuals.js';
import {renderNumberVisual} from './f3_numbers.js';
import {renderFoundationVisual} from './f3_foundations.js';
import {renderWave6Visual} from './f3_wave6_visuals.js';
import {renderGeometryVisual} from './f3_wave7_geometry.js';
import {renderWave8TrigVisual} from './f3_wave8_trig.js';
import {renderWave9AnalyticVisual} from './f3_wave9_analytic.js';
import {renderWave10SpatialVisual} from './f3_wave10_spatial.js';
import {renderWave11AlgebraVisual} from './f3_wave11_algebra.js';
import {renderWave12MathVisual} from './f3_wave12_math.js';
import {renderWave13FunctionsVisual} from './f3_wave13_functions.js';
import {renderWave14DerivativeVisual} from './f3_wave14_derivatives.js';
import {renderWave15IntegralVisual} from './f3_wave15_integrals.js';
import {renderWave16FinanceAlgebraVisual} from './f3_wave16_finance_algebra.js';
import {renderWave17SocialFunctionsVisual} from './f3_wave17_social_functions.js';
import {renderWave18CalculusVisual} from './f3_wave18_calculus.js';
import {renderWave19EconomicsMatricesVisual} from './f3_wave19_economics_integrals_matrices.js';
import {renderWave20StatisticsLPVisual} from './f3_wave20_statistics_linear_programming.js';
import {renderWave21StatisticsProbabilityVisual} from './f3_wave21_statistics_probability.js';
import {renderWave22BivariateProbabilityVisual} from './f3_wave22_bivariate_probability.js';
import {renderWave23ProbabilityRegressionVisual} from './f3_wave23_probability_regression.js';
import {renderWave24SocialStatisticsVisual} from './f3_wave24_social_statistics.js';
import {renderWave25InferenceVisual} from './f3_wave25_inference.js';
import {renderWave26InferenceVisual} from './f3_wave26_inference.js';
import {renderWave27Visual} from './f3_wave27_visuals.js';
import {renderWave28Visual} from './f3_wave28_visuals.js';
import {renderWave29Visual} from './f3_wave29_visuals.js';
const registry=new Map();
export const F3_UNITS=Object.freeze(['E2-A01','E2-A02','E3-A01','E1-A01','E2-F01','E3-F01','E1-P01','E1-F01','E3-A03','E1-N04','E1-N05','E2-P01','E1-N01','E1-N02','E1-N03','E2-N01','E2-N02','E3-N01','E1-M01','E1-G01','E2-G01','E4B-G01','B1C-G01','E3-G01','E4B-G02','B1C-G02','B2C-G01','E2-M01','E4B-A01','E4B-A02','B1C-A01','B2C-A01','B2C-A02','B2C-G02','E4B-F01','B1C-F01','B1C-F02','B1C-F03','B2C-F01','B2C-F02','B2C-F03','E4A-A01','E4A-F01','E4A-P01','E4A-A02','B1S-A01','E4A-N01','B1S-N01','B1S-F01','B1S-F02','B1S-F03','B2S-F01','B2S-F02','B2S-F03','B2S-A01','B2S-A02','E1-D01','E2-D01','E3-D01','E2-Q01','E3-Q01','E4A-D01','E4B-D01','E4A-Q01','E4B-Q01','B1C-D01','B1C-Q01','B1S-D01','B1S-Q01','B1S-Q02','B1S-D02','B2S-Q01','B2S-Q02','B2S-D01','B2S-D02','B2C-Q01','B2C-Q02','E3-N02','E3-G02','E4B-N01','B1C-N01','E4A-G01','B2C-G03','B1S-P01']);
const el=(tag,text='',className='')=>{const n=document.createElement(tag);n.textContent=String(text??'');if(className)n.className=className;return n};
const add=(parent,...children)=>{for(const c of children)parent.append(c);return parent};
const a=(title,url)=>{const n=el('a',title);n.href=url;return n};
const courseFor=id=>id.split('-')[0];
const courseUrl=id=>'#/curso/'+encodeURIComponent(courseFor(id));
const unitUrl=id=>courseUrl(id)+'/unidad/'+encodeURIComponent(id);
const lessonUrl=id=>unitUrl(id.slice(0,id.lastIndexOf('-')) )+'/leccion/'+encodeURIComponent(id);
const reviewUrl=id=>'#/repaso-f3/'+encodeURIComponent(id);
function bread(root,paths){
 const list=el('ol','','breadcrumbs');list.setAttribute('aria-label','Ruta de navegación');
 for(const [title,url] of paths){const li=el('li');li.append(url?a(title,url):el('span',title));list.append(li)}
 root.append(list);
}
function notice(root,text){
 const n=el('div',text,'notice');n.setAttribute('role','note');root.append(n);
}
function section(root,heading,body){
 const n=el('section','','card f1-section');
 add(n,el('h2',heading),el('p',body,'f1-multiline'));root.append(n);return n;
}
export function registerF3({datasets,storage=null,now=()=>new Date()}){
 if(!Array.isArray(datasets)||datasets.length<1||datasets.length>F3_UNITS.length)throw new Error('F3: cantidad inesperada de unidades');
 for(const {data,bank} of datasets){
   const unitId=data?.unit_id;
   if(!F3_UNITS.includes(unitId)||bank?.unit_id!==unitId||
       data.lesson_documents.length!==((unitId==='B1C-G01'||unitId==='E4B-F01'||unitId==='E4A-F01'||unitId==='B1S-F01')?7:((unitId==='E3-A03'||unitId==='E2-N02'||unitId==='E3-G01'||unitId==='E4A-N01'||unitId==='B1S-N01'||unitId==='E2-Q01'||unitId==='B1C-D01'||unitId==='B1S-Q01'||unitId==='E3-N02')?5:6))||bank.activities.length!==data.lesson_documents.length*5||registry.has(unitId))
     throw new Error('F3: datos incompletos o IDs duplicados '+unitId);
   const activities=bank.activities.map(item=>{
     const extra=bank.validation_metadata?.[item.exercise_id];
     if(!extra||extra.hints?.length!==2)throw new Error('F3: pistas faltantes '+item.exercise_id);
     return {...item,hints:extra.hints};
   });
   const engine=createExerciseEngine({activities,docs:data.lesson_documents,storage,unitId,now});
   registry.set(unitId,{data,bank,activities,engine});
 }
}
export function hasF3Unit(id){return registry.has(id)}
export function listF3Units(){return [...registry.values()].map(({data})=>({id:data.unit_id,title:data.unit_title}))}
function get(id){const entry=registry.get(id);if(!entry)throw new Error('F3: unidad desconocida '+id);return entry}
function contentBlocks(root,doc){
 const wrap=el('div','','f1-blocks');let example=0;
 const headings={text:'Comprende',example:'Ejemplo guiado',figure:'Representación verbal',
  summary:'Resumen de recuperación',reflection:'Recuerda sin mirar',interaction:'Actividad'};
 for(const b of doc.content_blocks){
   const pane=el('section','','card f1-block');
   pane.append(el('h2',(headings[b.type]??'Contenido')+(b.type==='example'?' '+(++example):'')));
   if(b.type==='reflection'){
     const [question,answer]=b.body.split('||');
     const button=el('button','Mostrar comprobación','subtle');button.type='button';
     const hidden=el('p',answer||'','f1-reveal');hidden.hidden=true;
     button.setAttribute('aria-expanded','false');
     button.addEventListener('click',()=>{
       hidden.hidden=!hidden.hidden;
       button.setAttribute('aria-expanded',String(!hidden.hidden));
       button.textContent=hidden.hidden?'Mostrar comprobación':'Ocultar comprobación';
     });
     add(pane,el('p',question,'f1-multiline'),button,hidden);
   }else{
     const content=el('p',b.body,'f1-multiline');
     if(b.type==='figure'&&b.alt)content.setAttribute('aria-label',b.alt);
     pane.append(content);
     if(b.type==='figure'&&b.graph_spec){const visual=renderFunctionGraph(b.graph_spec,b.alt||b.body);if(visual)pane.append(visual);}
     if(b.type==='figure'&&b.visual_spec){const visual=renderWave29Visual(b.visual_spec,b.alt||b.body)||renderWave28Visual(b.visual_spec,b.alt||b.body)||renderConceptVisual(b.visual_spec,b.alt||b.body)||renderNumberVisual(b.visual_spec,b.alt||b.body)||renderFoundationVisual(b.visual_spec,b.alt||b.body)||renderWave6Visual(b.visual_spec,b.alt||b.body)||renderGeometryVisual(b.visual_spec,b.alt||b.body)||renderWave8TrigVisual(b.visual_spec,b.alt||b.body)||renderWave9AnalyticVisual(b.visual_spec,b.alt||b.body)||renderWave10SpatialVisual(b.visual_spec,b.alt||b.body)||renderWave11AlgebraVisual(b.visual_spec,b.alt||b.body)||renderWave12MathVisual(b.visual_spec,b.alt||b.body)||renderWave24SocialStatisticsVisual(b.visual_spec,b.alt||b.body)||renderWave25InferenceVisual(b.visual_spec,b.alt||b.body)||renderWave26InferenceVisual(b.visual_spec,b.alt||b.body)||renderWave27Visual(b.visual_spec,b.alt||b.body)||renderWave23ProbabilityRegressionVisual(b.visual_spec,b.alt||b.body)||renderWave22BivariateProbabilityVisual(b.visual_spec,b.alt||b.body)||renderWave21StatisticsProbabilityVisual(b.visual_spec,b.alt||b.body)||renderWave20StatisticsLPVisual(b.visual_spec,b.alt||b.body)||renderWave19EconomicsMatricesVisual(b.visual_spec,b.alt||b.body)||renderWave18CalculusVisual(b.visual_spec,b.alt||b.body)||renderWave17SocialFunctionsVisual(b.visual_spec,b.alt||b.body)||renderWave16FinanceAlgebraVisual(b.visual_spec,b.alt||b.body)||renderWave15IntegralVisual(b.visual_spec,b.alt||b.body)||renderWave14DerivativeVisual(b.visual_spec,b.alt||b.body)||renderWave13FunctionsVisual(b.visual_spec,b.alt||b.body);if(visual)pane.append(visual);}
   }
   wrap.append(pane);
 }
 root.append(wrap);
}
function practice(root,engine,items,title){
 const block=el('section','','f1-practice f3-practice');
 block.append(el('h2',title));
 block.append(el('p','Resuelve antes de mostrar pistas. La respuesta se comprueba por reglas matemáticas, sin ejecutar texto.','hint'));
 const area=el('div','','card f1-question f3-question');block.append(area);root.append(block);
 let pos=0,hintLevel=0,wrong=0;
 function draw(focus=false){
   const item=items[pos];area.replaceChildren();
   if(!item){area.append(el('p','No hay actividades disponibles.'));return;}
   hintLevel=0;wrong=0;
   const heading=el('h3','Actividad '+(pos+1)+' de '+items.length+' · '+(engine.progress.enabled?'Guardado local activado':'Sin guardar datos'),'f1-question-index');
   heading.tabIndex=-1;
   const question=el('p',item.prompt,'f1-question-prompt');
   const form=el('form');form.noValidate=true;form.setAttribute('aria-label','Responder '+item.exercise_id);
   let input=null;
   if(item.type==='choice'){
     const field=el('fieldset','','f1-choice');field.append(el('legend','Selecciona una respuesta'));
     item.choices.forEach((choice,i)=>{
       const label=el('label','','f1-choice-row');
       const radio=el('input');radio.type='radio';radio.name='answer';radio.value=choice;
       radio.id='f3-'+item.exercise_id+'-'+i;
       add(label,radio,el('span',choice));field.append(label);
     });
     form.append(field);
   }else{
     const label=el('label','Respuesta numérica');label.htmlFor='f3-answer';
     input=el('input');input.type='text';input.id='f3-answer';input.autocomplete='off';
     input.inputMode='decimal';input.spellcheck=false;input.setAttribute('aria-describedby','f3-format');
     const fmt=el('p','Admite enteros, coma o punto decimal y fracciones simples como 1/2.','hint');fmt.id='f3-format';
     add(form,label,input,fmt);
   }
   const actions=el('div','','btnrow');
   const check=el('button','Comprobar','action');check.type='submit';
   const help=el('button','Pista 1','subtle');help.type='button';
   const solution=el('button','Ver explicación','subtle');solution.type='button';solution.hidden=true;
   add(actions,check,help,solution);form.append(actions);
   const message=el('div','','feedback f1-feedback f3-feedback');message.hidden=true;
   message.setAttribute('role','status');message.setAttribute('aria-live','polite');
   help.addEventListener('click',()=>{
     hintLevel=Math.min(hintLevel+1,item.hints.length);
     engine.assist(item);
     message.hidden=false;message.className='feedback f1-feedback f3-feedback';
     message.textContent='Pista '+hintLevel+': '+item.hints[hintLevel-1];
     if(hintLevel===item.hints.length){help.disabled=true}else{help.textContent='Pista '+(hintLevel+1)}
   });
   form.addEventListener('submit',event=>{
     event.preventDefault();
     const raw=item.type==='choice'?form.querySelector('input[name=answer]:checked')?.value??'':input.value;
     const outcome=engine.submit(item,raw,{hintUsed:hintLevel>0});
     message.hidden=false;
     if(!outcome.valid){
       message.className='feedback bad f1-feedback f3-feedback';
       message.textContent='Formato no admitido. Introduce o selecciona una respuesta válida.';
       return;
     }
     if(outcome.correct){
       message.className='feedback good f1-feedback f3-feedback';
       message.textContent='Correcto. '+item.explanation;
       solution.hidden=true;
     }else{
       wrong+=1;
       message.className='feedback bad f1-feedback f3-feedback';
       message.textContent='Aún no. '+item.hints[Math.min(wrong-1,item.hints.length-1)];
       if(outcome.repair?.text)message.append(el('p',outcome.repair.text,'hint'));
       if(outcome.repair?.lessonId){
         message.append(a('Repasar prerrequisito '+outcome.repair.lessonId,lessonUrl(outcome.repair.lessonId)));
       }
       solution.hidden=false;
     }
   });
   solution.addEventListener('click',()=>{
     engine.assist(item);message.hidden=false;message.className='feedback f1-feedback f3-feedback';
     message.textContent='Solución explicada: '+item.explanation;
   });
   const nav=el('div','','btnrow');
   const prev=el('button','Anterior','subtle');prev.type='button';prev.disabled=pos===0;
   const next=el('button',pos===items.length-1?'Volver a la primera':'Siguiente','subtle');next.type='button';
   prev.addEventListener('click',()=>{pos=Math.max(0,pos-1);draw(true)});
   next.addEventListener('click',()=>{pos=(pos+1)%items.length;draw(true)});
   add(nav,prev,next);
   add(area,heading,question,form,message,nav,
     el('p',item.exercise_id+' · EN REVISIÓN · Dificultad '+item.difficulty+'/5','hint'));
   if(focus)heading.focus({preventScroll:true});
 }
 draw();
}
function statusControls(root,entry,refresh){
 const box=el('section','','card f2-storage');
 box.append(el('h2','Repaso en esta sesión · '+entry.data.unit_id));
 box.append(el('p','Los aciertos, errores y fechas se mantienen en memoria mientras la pestaña está abierta. No se guardan ni reaparecen al volver. Repite por tu cuenta después de D+1, D+3, D+7, D+14 y D+30.','hint'));
 root.append(box);
}

export function renderF3Unit({container,unitId,canonicalUnit}){
 const {data,activities}=get(unitId);
 bread(container,[['Inicio','#/'],[unitId.split('-')[0],courseUrl(unitId)],[data.unit_title,null]]);
 container.append(el('h1',data.unit_title));
 notice(container,'F3 · Propuesta editorial en revisión; contenidos y ejercicios pendientes de revisión humana, territorial y accesibilidad. No es un curso homologado.');
 section(container,'Objetivos',data.unit_objectives.map((x,i)=>(i+1)+'. '+x).join('\n'));
 const p=el('section','','card f1-section');p.append(el('h2','Conocimientos previos'));
 const list=el('ul');for(const pre of data.prerequisite_links){const li=el('li');li.append(a(pre.label,pre.href));list.append(li)}
 p.append(list);container.append(p);
 const lessons=el('section','','card f1-section');lessons.append(el('h2','Lecciones de esta unidad ('+data.lesson_documents.length+')'));
 const ol=el('ol');
 for(const doc of data.lesson_documents){
   const li=el('li'),title=canonicalUnit?.lessons.find(x=>x.lesson_id===doc.lesson_id)?.title||doc.lesson_id;
   add(li,a(doc.lesson_id+' · '+title,lessonUrl(doc.lesson_id)),el('span',' · '+activities.filter(x=>x.lesson_id===doc.lesson_id).length+' actividades','hint'));
   if(doc.lesson_id==='E3-A01-L06'||data.editorial_extension)li.append(el('strong',' · AMPLIACIÓN'));
   ol.append(li);
 }
 lessons.append(ol);container.append(lessons);
 section(container,'Cómo estudiar esta unidad','Comprende los ejemplos → intenta recordar la idea sin mostrar la solución → resuelve cinco actividades por lección → vuelve al repaso para intercalar y recuperar errores. El calendario es orientativo y el guardado siempre optativo.');
 container.append(a('Abrir repaso de '+unitId,reviewUrl(unitId)));
}
export function renderF3Lesson({container,unitId,lessonId,title}){
 const entry=get(unitId),doc=entry.data.lesson_documents.find(x=>x.lesson_id===lessonId);
 if(!doc)return false;
 bread(container,[['Inicio','#/'],[courseFor(unitId),courseUrl(unitId)],[unitId,unitUrl(unitId)],[title,null]]);
 container.append(el('p',lessonId+' · F3 '+entry.data.version+' · EN REVISIÓN','eyebrow'));
 container.append(el('h1',title));
 if(lessonId==='E3-A01-L06'||entry.data.editorial_extension)notice(container,'AMPLIACIÓN EDITORIAL: este contenido no se presenta como obligación curricular estatal universal.');
 notice(container,'Contenido local de estudio en revisión. El progreso se guarda solo si activas expresamente el guardado en la página de repaso.');
 section(container,'Hoy aprenderás',doc.objectives.map((x,i)=>(i+1)+'. '+x).join('\n'));
 const req=el('section','','card f1-section');req.append(el('h2','Prerrequisitos'));
 const ul=el('ul');
 for(const id of doc.prerequisites){const li=el('li');li.append(a(id,lessonUrl(id)));ul.append(li)}
 req.append(ul);container.append(req);
 contentBlocks(container,doc);
 practice(container,entry.engine,entry.activities.filter(x=>x.lesson_id===lessonId),'Practica lo aprendido · 5 actividades');
 const after=el('p','','f1-after');add(after,a('Volver a la unidad',unitUrl(unitId)),document.createTextNode(' · '),a('Recuperación y repaso',reviewUrl(unitId)));
 container.append(after);return true;
}
export function renderF3Review({container,unitId}){
 const entry=get(unitId);
 const refresh=()=>{container.replaceChildren();renderF3Review({container,unitId})};
 bread(container,[['Inicio','#/'],[unitId,unitUrl(unitId)],['Repasar',null]]);
 container.append(el('h1','Recuperación activa · '+unitId));
 notice(container,'Repaso orientativo D+1, D+3, D+7, D+14 y D+30: solo sugerencias para nuevas visitas; sin seguimiento personal guardado.');
 statusControls(container,entry,refresh);
 const due=entry.engine.due(),states=entry.engine.progress.getStates();
 section(container,'Repaso de esta sesión','Actividades programadas: '+Object.keys(states).length+' · Vencidas hoy: '+due.length+
   '\nEl historial se pierde al recargar la página; la pauta entre días es manual.');
 const fallback=entry.data.lesson_documents.map(doc=>entry.activities.find(i=>i.lesson_id===doc.lesson_id)).filter(Boolean);
 const deck=entry.engine.reviewDeck(fallback);
 const titles={due:'Repaso espaciado pendiente',errors:'Reintenta actividades difíciles',mixed:'Reto mixto sin apuntes'};
 section(container,'Selección de actividades',deck.kind==='due'?'Recupera ahora las actividades vencidas sin consultar soluciones.':deck.kind==='errors'?
  'Reintenta las actividades con error de esta sesión.':'No hay tareas vencidas ni errores; practica seis conceptos mezclados.');
 practice(container,entry.engine,deck.items,titles[deck.kind]);
 container.append(a('Volver a la unidad',unitUrl(unitId)));
}
export function renderF3Directory({container,unitCatalog=null}){
 container.append(el('h2','Unidades F3 disponibles en revisión'));
 const ul=el('ul');
 for(const id of F3_UNITS){
   const entry=registry.get(id),canonical=unitCatalog?.get(id);
   const title=entry?.data.unit_title||canonical?.title||id;
   const n=entry?.data.lesson_documents.length||canonical?.lessons.length||0;
   const li=el('li');
   add(li,a(id+' · '+title,reviewUrl(id)),el('span',' · '+n+' lecciones en revisión','hint'));
   ul.append(li);
 }
 container.append(ul);
}

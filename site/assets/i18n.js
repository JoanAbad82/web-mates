// WEB MATES — i18n progressiu i explícit (sense emmagatzematge ni traducció remota).
// La UI i els 85 títols d'unitat estan en ca-ES com a esborrany.
// Els textos de lliçons i exercicis segueixen en es-ES fins que hi hagi recursos revisats.
import {CA_UNIT_TITLES,CA_COURSE_NAMES} from './i18n_ca_catalog.js';

const ui = Object.freeze({
  'Saltar al contenido':'Ves al contingut',
  'Cursos':'Cursos',
  'Repaso':'Repàs',
  'Proyecto':'Projecte',
  'Claro':'Clar',
  'Oscuro':'Fosc',
  'Navegación principal':'Navegació principal',
  'Ruta de navegación':'Ruta de navegació',
  'Elegir itinerario':'Tria un itinerari',
  'Aprender · Practicar · Recordar':'Aprendre · Practicar · Recordar',
  'Tus matemáticas, paso a paso':'Les teves matemàtiques, pas a pas',
  'Elige un curso para explorar el temario. Los títulos están preparados; las lecciones definitivas siguen en desarrollo.':'Tria un curs per explorar el temari. Els títols estan preparats; les lliçons definitives continuen en desenvolupament.',
  'Demostración técnica local: 9 itinerarios y 505 títulos. No confundas este índice con clases completamente disponibles.':'Demostració tècnica: 9 itineraris i 505 títols. Aquest índex no acredita que les lliçons hagin estat revisades.',
  'Ver unidades':'Veure unitats',
  'Inicio':'Inici',
  'Itinerario':'Itinerari',
  'Unidades ordenadas conforme a la propuesta editorial; la secuenciación puede variar por comunidad autónoma o centro.':'Unitats ordenades segons la proposta editorial; la seqüència pot variar segons la comunitat autònoma o el centre.',
  'Índice':'Índex',
  'Pendiente':'Pendent',
  'Demo disponible':'Demostració disponible',
  'Cómo estudiarla':'Com estudiar-la',
  'Estrategia de memoria':'Estratègia de memòria',
  'Recurso propuesto':'Recurs proposat',
  'Prerrequisitos:':'Prerequisits:',
  'Práctica de demostración':'Pràctica de demostració',
  'Pruébalo sin mirar la respuesta':'Prova-ho sense mirar la resposta',
  'Elige una opción':'Tria una opció',
  'Tu respuesta':'La teva resposta',
  'Comprobar':'Comprovar',
  'Ver pista':'Veure la pista',
  'Correcto.':'Correcte.',
  'Todavía no.':'Encara no.',
  'Introduce o selecciona una respuesta.':'Introdueix o selecciona una resposta.',
  'Ruta no encontrada':'Ruta no trobada',
  'Esta lección o unidad no figura en el catálogo':'Aquesta lliçó o unitat no consta al catàleg',
  'Comprueba el enlace o vuelve al listado de cursos.':'Comprova l’enllaç o torna a la llista de cursos.',
  'Ir a cursos':'Anar als cursos',
  'Error de carga':'Error de càrrega',
  'No se pudo abrir la unidad':'No s’ha pogut obrir la unitat',
  'No se pudo abrir el catálogo':'No s’ha pogut obrir el catàleg',
  'Repaso espaciado':'Repàs espaiat',
  'Recordar':'Recordar',
  'Transparencia':'Transparència',
  'Qué incluye este prototipo':'Què inclou aquest prototip',
  'Unidad':'Unitat',
  'lecciones':'lliçons',
  'unidades':'unitats',
  'en revisión':'en revisió',
  'Siguiente':'Següent',
  'Anterior':'Anterior',
  'Comprobar respuesta':'Comprovar la resposta',
  'Pista 1':'Pista 1',
  'Volver a la unidad':'Tornar a la unitat',
  'Sin guardar datos':'Sense desar dades',
  'Mostrar comprobación':'Mostra la comprovació',
  'Aprender':'Aprendre',
  'Practicar':'Practicar',
  'Repasar':'Repassar',
  'EN REVISI?N':'EN REVISI?',
  'Contenido':'Contingut',
  'Entiende la idea':'Ent?n la idea',
  'Representaci?n visual y verbal':'Representaci? visual i verbal',
  'Ejemplo guiado':'Exemple guiat',
  'Recuperaci?n activa':'Recuperaci? activa',
  'Resumen para recordar':'Resum per recordar',
  'Resumen de recuperaci?n':'Resum de recuperaci?',
  'Recuerda sin mirar':'Recorda sense mirar',
  'Actividad':'Activitat',
  'Ver explicaci?n':'Veure l?explicaci?',
  'Ver soluci?n razonada':'Veure la soluci? raonada',
  'Ocultar comprobaci?n':'Amaga la comprovaci?',
  'Volver a la primera':'Tornar a la primera',
  'Antes de empezar: requisitos':'Abans de comen?ar: requisits',
  'Repaso en esta sesi?n':'Rep?s en aquesta sessi?',
  'Las seis lecciones de esta unidad':'Les sis lli?ons d?aquesta unitat',
  'Requisitos recomendados':'Requisits recomanats',
  'Conocimientos previos':'Coneixements previs',
  'Prerrequisitos':'Prerequisits',
  'Unidades F3 disponibles en revisi?n':'Unitats F3 disponibles en revisi?',
  'DEMOSTRACI?N':'DEMOSTRACI?',
  'ENCENDE TU L?GICA':'ENC?N LA TEVA L?GICA',
  'ENCIENDE TU L?GICA':'ENC?N LA TEVA L?GICA'
});
let locale = (new URL(location.href)).searchParams.get('lang') === 'es' ? 'es' : 'ca';
const originalTexts = new WeakMap();
const originalAttrs = new WeakMap();
const titles=new Map();
let observer=null,processing=false;
const exclude='script,style,code,pre,textarea,option,[data-no-i18n],.katex,.math';
function translate(original){
  const raw=String(original);
  const trim=raw.trim();
  const lookup=titles.get(trim)||ui[trim];
  if(lookup!==undefined)return raw.replace(trim,lookup);
  const count=/^(\d+) unidades · (\d+) lecciones$/.exec(trim);
  if(count)return `${count[1]} unitats · ${count[2]} lliçons`;
  const lessonCount=/^(\d+) lecciones · (.+)$/.exec(trim);
  if(lessonCount)return `${lessonCount[1]} lliçons · ${lessonCount[2]}`;
  return raw;
}
function currentLang(){
  const hash=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  // Les pàgines amb lliçons F1/F3 encara són en castellà: etiqueta d'idioma correcta.
  return locale==='ca'&&(hash.length===0||(hash[0]==='curso'&&hash.length===2))?'ca':'es';
}
function markLanguage(){
  document.documentElement.lang=locale==='ca'?'ca':'es';
  const m=document.querySelector('#main');
  if(m)m.lang=currentLang();
}
function translateNode(node){
  if(node.parentElement?.closest(exclude))return;
  if(!originalTexts.has(node))originalTexts.set(node,node.nodeValue);
  const value=originalTexts.get(node);
  const desired=locale==='ca'?translate(value):value;
  if(node.nodeValue!==desired)node.nodeValue=desired;
}
function translateElement(el){
  for(const attr of ['aria-label','title']){
    if(!el.hasAttribute(attr))continue;
    if(!originalAttrs.has(el))originalAttrs.set(el,{});
    const original=originalAttrs.get(el);
    if(!(attr in original))original[attr]=el.getAttribute(attr);
    const val=locale==='ca'?translate(original[attr]):original[attr];
    if(el.getAttribute(attr)!==val)el.setAttribute(attr,val);
  }
}
function applyTo(root){
  if(processing)return;
  processing=true;
  try{
    if(root.nodeType===Node.TEXT_NODE)translateNode(root);
    else if(root.nodeType===Node.ELEMENT_NODE){
      translateElement(root);
      root.querySelectorAll('[aria-label],[title]').forEach(translateElement);
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      let n;while((n=walker.nextNode()))translateNode(n);
    }
    markLanguage();
  }finally{processing=false;}
}
function setLocale(next){
  if(!['es','ca'].includes(next))return;
  locale=next;
  const url=new URL(location.href);
  url.searchParams.set('lang',locale);
  history.replaceState(null,'',url.pathname+url.search+url.hash);
  const select=document.querySelector('#locale-select');
  if(select)select.value=locale;
  const banner=document.querySelector('#locale-partial');
  if(banner)banner.hidden=locale!=='ca';
  applyTo(document.body);
}
export function initI18n(catalog){
  titles.clear();
  const counters={units:0,lessons:0};
  for(const c of catalog.courses){
    titles.set(c.name,CA_COURSE_NAMES[c.code]||c.name);
    for(const u of c.units){
      if(CA_UNIT_TITLES[u.unit_id]){titles.set(u.title,CA_UNIT_TITLES[u.unit_id]);counters.units++;}
      counters.lessons+=u.lessons.length;
    }
  }
  if(counters.units!==85||counters.lessons!==505)throw Error('Locale ca-ES: catàleg no íntegre');
  const controls=document.querySelector('.header-actions');
  if(!controls)throw Error('No hi ha capçalera per seleccionar idioma');
  const label=document.createElement('label');
  label.setAttribute('for','locale-select');
  label.textContent='Idioma / Llengua';
  label.className='locale-label';
  label.lang='ca';
  const select=document.createElement('select');
  select.id='locale-select';
  select.className='locale-select';
  select.setAttribute('aria-label','Idioma de la interfície / Llengua de la interfície');
  select.innerHTML='<option value="ca">Català (beta)</option><option value="es">Castellano</option>';
  select.value=locale;
  select.addEventListener('change',()=>setLocale(select.value));
  controls.insertBefore(label,controls.querySelector('#theme-toggle'));
  controls.insertBefore(select,controls.querySelector('#theme-toggle'));
  const banner=document.createElement('aside');
  banner.id='locale-partial'; banner.className='locale-partial';
  banner.lang='ca';banner.setAttribute('role','note');
  const info=document.createElement('span');
  info.textContent='Català en construcció: navegació i 85 títols d’unitat en esborrany. Les 505 lliçons i els 2.525 exercicis continuen en castellà fins a la traducció i revisió.';
  const link=document.createElement('a');
  link.href='https://github.com/JoanAbad82/web-mates/issues/1';
  link.textContent='Col·labora en la traducció';
  link.rel='noopener noreferrer';
  banner.append(info,' ',link);
  document.querySelector('.topbar').after(banner);
  banner.hidden=locale!=='ca';
  observer=new MutationObserver(mutations=>{
    if(processing)return;
    for(const m of mutations){
      if(m.type==='characterData')applyTo(m.target);
      else for(const node of m.addedNodes)if(node.nodeType===Node.TEXT_NODE||node.nodeType===Node.ELEMENT_NODE)applyTo(node);
    }
    markLanguage();
  });
  observer.observe(document.body,{childList:true,characterData:true,subtree:true});
  window.addEventListener('hashchange',markLanguage);
  applyTo(document.body);
}
export const getLanguage=()=>locale;

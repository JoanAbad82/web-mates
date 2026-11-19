'use strict';
// ca-ES browser smoke: no network beyond ephemeral loopback; no tests of linguistic correctness implied.
const fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'..'),site=process.env.WEBMATES_SITE_DIR ?
 path.resolve(process.env.WEBMATES_SITE_DIR):path.join(root,'site');
const evidence=process.env.WEBMATES_EVIDENCE_DIR ?
 path.resolve(process.env.WEBMATES_EVIDENCE_DIR):path.resolve(root,'../evidencias');
fs.mkdirSync(evidence,{recursive:true});
let puppeteer;
try{puppeteer=require('puppeteer-core');}
catch(err){
 const local=process.env.LOCALAPPDATA &&
   path.join(process.env.LOCALAPPDATA,'npm-cache','_npx','4b4c857f6efdfb61','node_modules','puppeteer-core');
 if(local && fs.existsSync(local))puppeteer=require(local);
 else throw Error('Missing puppeteer-core: install in the test environment (npm install --no-save puppeteer-core)');
}
const chromeExecutable=process.env.CHROME_PATH ||
  (process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':'/usr/bin/google-chrome');
const results={tests:[],jsErrors:[],external:[],httpErrors:[],screenshots:[],scope:'Browser i18n ca-ES/es-ES smoke; translations still draft'};
const check=(id,ok,actual,expected)=>{
 results.tests.push({id,status:ok?'PASS':'FAIL',actual,expected});
 console.log(id,ok?'PASS':'FAIL',JSON.stringify(actual).slice(0,350));
};
let server,browser;
(async()=>{try{
 const catalog=JSON.parse(fs.readFileSync(path.join(site,'data/catalogo.json'),'utf8'));
 const units=catalog.courses.flatMap(c=>c.units);
 const lessons=units.flatMap(u=>u.lessons);
 check('CANONICAL_COUNTS',catalog.courses.length===9&&units.length===85&&lessons.length===505,
  [catalog.courses.length,units.length,lessons.length],[9,85,505]);
 const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
 server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  const file=path.resolve(site,decodeURIComponent(url.pathname).replace(/^\/+/,'')||'index.html');
  if(!file.startsWith(site+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    res.writeHead(404);res.end();return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+'/';
 browser=await puppeteer.launch({headless:true,executablePath:chromeExecutable,
   args:['--no-first-run','--disable-extensions','--disable-background-networking']});
 const page=await browser.newPage();
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});
 await page.setRequestInterception(true);
 page.on('request',r=>{if(r.url().startsWith(base)||r.url().startsWith('data:'))r.continue().catch(()=>{});
   else{results.external.push(r.url());r.abort().catch(()=>{});}});
 page.on('pageerror',e=>results.jsErrors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)results.httpErrors.push({status:r.status(),url:r.url()});});
 await page.goto(base,{waitUntil:'networkidle0'});
 await page.waitForSelector('#locale-select',{timeout:20000});
 const start=await page.evaluate(()=>({
  language:document.documentElement.lang,
  mainLang:document.querySelector('#main').lang,
  selected:document.querySelector('#locale-select').value,
  heading:document.querySelector('.hero h1')?.textContent,
  banner:!document.querySelector('#locale-partial').hidden,
  link:document.querySelector('#locale-partial a')?.href,
  overflow:document.documentElement.scrollWidth>innerWidth+2
 }));
 check('CA_DEFAULT_HOME',start.language==='ca'&&start.mainLang==='ca'&&start.selected==='ca'&&start.banner&&start.heading.includes('pas a pas'),
  start,'ca locale selected + banner + catalan home');
 check('CA_MOBILE_NO_OVERFLOW',!start.overflow,start.overflow,false);
 check('CA_COLLAB_LINK',start.link==='https://github.com/JoanAbad82/web-mates/issues/1',start.link,'issue #1');
 await page.screenshot({path:path.join(evidence,'CA_HOME_390_EVIDENCE.png'),fullPage:false});
 results.screenshots.push('CA_HOME_390_EVIDENCE.png');
 await page.goto(base+'?lang=ca#/curso/E3',{waitUntil:'networkidle0'});
 await page.waitForSelector('.item a');
 const course=await page.evaluate(()=>({
  language:document.querySelector('#main').lang,
  firstCourse:document.querySelector('.hero h1')?.textContent,
  unit:document.querySelector('.item a')?.textContent,
  allUnitLinks:[...document.querySelectorAll('.item a')].length,
  choice:document.querySelector('#locale-select').value
 }));
 check('CA_COURSE_UNIT_TITLES',course.language==='ca'&&course.firstCourse.includes('3r')&&course.allUnitLinks===10&&course.unit.includes('Nombres reals'),
   course,'3r ESO + 10 unitats traduïdes');
 await page.select('#locale-select','es');
 const es=await page.evaluate(()=>({
  htmlLang:document.documentElement.lang,mainLang:document.querySelector('#main').lang,
  heading:document.querySelector('.hero h1')?.textContent,
  unit:document.querySelector('.item a')?.textContent,
  bannerHidden:document.querySelector('#locale-partial').hidden,
  url:new URL(location.href).searchParams.get('lang')
 }));
 check('ES_SWITCH_NO_RELOAD',es.htmlLang==='es'&&es.mainLang==='es'&&es.heading==='3.º ESO'&&es.unit==='Números reales y aproximaciones'&&es.bannerHidden&&es.url==='es',
  es,'Spanish restored without reload');
 await page.goto(base+'?lang=ca#/curso/E3/unidad/E3-A02/leccion/E3-A02-L04',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.f1-practice',{timeout:14000});
 const fallback=await page.evaluate(()=>({
  htmlLang:document.documentElement.lang,mainLang:document.querySelector('#main').lang,
  bannerVisible:!document.querySelector('#locale-partial').hidden,
  title:document.querySelector('h1')?.textContent,
  count:document.querySelectorAll('.f1-question').length,
  route:location.hash
 }));
 check('LESSON_EXPLICIT_ES_FALLBACK',fallback.htmlLang==='ca'&&fallback.mainLang==='es'&&fallback.bannerVisible&&fallback.route.includes('E3-A02-L04'),
  fallback,'Spanish original lesson tagged lang es while ca selected');
 await page.goto(base+'?lang=ca#/curso/E1/unidad/E1-N01/leccion/E1-N01-L01',{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>document.querySelector('#main')?.textContent?.length>700,{timeout:15000});
 const f3=await page.evaluate(()=>({
  mainLang:document.querySelector('#main').lang,
  selected:document.querySelector('#locale-select').value,
  hasF3Content:document.querySelector('#main').textContent.includes('Valor posicional'),
  pageTitle:document.querySelector('#main h1')?.textContent,
  bannerVisible:!document.querySelector('#locale-partial').hidden
 }));
 check('F3_LESSON_CA_DRAFT',f3.mainLang==='ca'&&f3.selected==='ca'&&
   f3.pageTitle.startsWith('Valor posicional i')&&f3.bannerVisible,
  f3,'First fully translated draft lesson has lang ca');
 const caExercise=await page.$eval('.f1-question-prompt',e=>e.textContent);
 check('F3_DRAFT_EXERCISE_PROMPT_CA',caExercise.startsWith('Quina xifra ocupa'),
   caExercise,'Source first prompt localized to ca');
 await page.click('#f3-answer');
 await page.keyboard.type('8');
 await page.click('.f3-question button[type=submit]');
 const response=await page.$eval('.f3-feedback',e=>e.textContent);
 check('F3_DRAFT_EXERCISE_VALIDATOR_UNCHANGED',response.includes('Correcte.')&&response.includes('Resultat: 8'),
   response.slice(0,170),'Engine correct + localized explanation in draft');
 await page.select('#locale-select','es');
 const restored=await page.evaluate(()=>({
  lang:document.querySelector('#main').lang,
  lesson:document.querySelector('#main h1')?.textContent,
  prompt:document.querySelector('.f1-question-prompt')?.textContent
 }));
 check('ES_RESTORES_LESSON_AND_PROMPT',restored.lang==='es'&&
   restored.lesson.startsWith('Valor posicional y')&&restored.prompt.includes('100 unidades'),
  restored,'Original Spanish lesson restored');
 await page.select('#locale-select','ca');
 const back=await page.$eval('.f1-question-prompt',e=>e.textContent);
 check('CA_SWITCH_BACK_SAME_ROUTE',back.includes('Quina xifra'),back,'Catalan restored');
 const expectedCaTitles=[
  'Valor posicional i comparaci',
  'Arrodoniment i estimaci',
  'Operacions amb nombres naturals',
  'Jerarquia de les operacions',
  'Propietats de les operacions',
  'Problemes de diverses operacions'];
 for(let i=1;i<=6;i++){
  const suffix=String(i).padStart(2,'0');
  await page.goto(base+'?lang=ca#/curso/E1/unidad/E1-N01/leccion/E1-N01-L'+suffix,{waitUntil:'networkidle0'});
  await page.waitForSelector('.f1-question-prompt',{timeout:12000});
  const state=await page.evaluate(()=>({
   lang:document.querySelector('#main').lang,
   title:document.querySelector('#main h1')?.textContent,
   prompt:document.querySelector('.f1-question-prompt')?.textContent
  }));
  check('CA_FULL_E1_N01_L'+suffix,state.lang==='ca'&&
    state.title.startsWith(expectedCaTitles[i-1].slice(0,8)),
    state,'Unit lesson draft in ca-ES');
 }
 for(let i=1;i<=6;i++){
  const suffix=String(i).padStart(2,'0');
  await page.goto(base+'?lang=ca#/curso/E1/unidad/E1-N02/leccion/E1-N02-L'+suffix,{waitUntil:'networkidle0'});
  await page.waitForSelector('.f1-question-prompt',{timeout:6000}).catch(async err=>{
   console.log('DIAG_N02_MAIN',JSON.stringify(await page.$eval('#main',e=>e.textContent.slice(0,900))));throw err;
  });
  const state=await page.evaluate(()=>({
    lang:document.querySelector('#main').lang,
    title:document.querySelector('#main h1')?.textContent,
    prompt:document.querySelector('.f1-question-prompt')?.textContent
  }));
  const titles=['El significat dels nombres enters','Ordre i valor absolut',
    'La recta dels enters','Suma i resta','Multiplicaci','Operacions combinades'];
  check('CA_FULL_E1_N02_L'+suffix,state.lang==='ca'&&
    state.title.startsWith(titles[i-1].slice(0,8)),state,'E1-N02 Catalan text and language attribution');
 }
 const newUnits={
  'E1-N03':['Múltiples i divisors','Criteris de divisibilitat','Nombres primers i compostos','Descomposició en factors primers','Màxim comú divisor','Mínim comú múltiple'],
  'E1-N04':['Què és una fracció','Fraccions equivalents','Comparació de fraccions','Suma i resta de fraccions','Producte i divisió de fraccions','Problemes amb fraccions'],
  'E1-N05':['Lectura i comparació de decimals','Operacions amb nombres decimals','De fracció a decimal','Percentatges, fraccions i decimals','Càlcul de percentatges','Augments i descomptes percentuals'],
  'E1-P01':['Raons i proporcions','Proporcionalitat directa','Taules de proporcionalitat','Constant de proporcionalitat','Escales i receptes proporcionals','Problemes de preu i quantitat'],
  'E1-M01':['Magnituds i unitats de mesura','Canvis d’unitats','Estimació i precisió','Escales de plànols i mapes','Perímetres i unitats','Problemes de mesura i conversions'],
  'E1-G01':['Rectes, segments i angles','Triangles i les seves propietats','Polígons i quadrilàters','Circumferència i cercle','Àrees de figures planes','Àrees de figures compostes'],
  'E1-A01':['Patrons numèrics i geomètrics','Expressions amb lletres','Del llenguatge quotidià al simbòlic','Valor numèric','Igualtats i equivalències','Equacions lineals molt senzilles'],
  'E1-F01':['Eixos i coordenades','Parells de valors','Taules de dependència','Representació de punts','Lectura de gràfiques contextualitzades','Variacions positives i negatives'],
  'E1-D01':['Població, variable i dada','Taules de freqüències','Diagrames de barres i de sectors','Mitjana, mediana i moda inicials','Interpretació crítica de gràfiques','Experiments aleatoris i freqüència relativa'],
  'E2-N01':['Potències d’exponent natural','Producte i quocient de potències','Potència d’una potència','Arrels quadrades principals','Nombres racionals amb signe','Operacions combinades amb potències i racionals']
 };
 for(const [unit,titles] of Object.entries(newUnits)){
  for(let i=1;i<=6;i++){
   const suffix=String(i).padStart(2,'0');
   await page.goto(base+'?lang=ca#/curso/'+unit.split('-')[0]+'/unidad/'+unit+'/leccion/'+unit+'-L'+suffix,{waitUntil:'networkidle0'});
   await page.waitForSelector('.f1-question-prompt',{timeout:10000});
   const state=await page.evaluate(()=>({
    lang:document.querySelector('#main').lang,
    title:document.querySelector('#main h1')?.textContent,
    prompt:document.querySelector('.f1-question-prompt')?.textContent,
    banner:!document.querySelector('#locale-partial').hidden
   }));
   check('CA_NEW_'+unit+'_L'+suffix,state.lang==='ca'&&
    state.title.startsWith(titles[i-1])&&state.prompt?.length>12&&state.banner,
    state,'Complete drafted lesson and first question in Catalan');
  }
 }
 await page.goto(base+'?lang=ca#/curso/E1/unidad/E1-N03/leccion/E1-N03-L01',{waitUntil:'networkidle0'});
 await page.waitForSelector('#f3-answer',{timeout:10000});
 await page.click('#f3-answer');await page.keyboard.type('24');
 await page.click('.f3-question button[type=submit]');
 const n03Feedback=await page.$eval('.f3-feedback',e=>e.textContent);
 check('N03_CANONICAL_VALIDATOR_CA',n03Feedback.includes('Correcte.')&&n03Feedback.includes('Resultat: 24'),
  n03Feedback.slice(0,200),'Numeric validator unchanged for translated natural-number activity');
 await page.goto(base+'?lang=ca#/curso/E1/unidad/E1-N04/leccion/E1-N04-L01',{waitUntil:'networkidle0'});
 await page.waitForSelector('#f3-answer',{timeout:10000});
 await page.click('#f3-answer');await page.keyboard.type('0,375');
 await page.click('.f3-question button[type=submit]');
 const n04Feedback=await page.$eval('.f3-feedback',e=>e.textContent);
 check('N04_FRACTION_VALIDATOR_CA',n04Feedback.includes('Correcte.')&&n04Feedback.includes('0,375'),
  n04Feedback.slice(0,200),'Fraction numerical decimal comma validator unchanged');
 await page.goto(base+'?lang=ca#/curso/E1/unidad/E1-N05/leccion/E1-N05-L03',{waitUntil:'networkidle0'});
 await page.waitForSelector('.f1-question-prompt',{timeout:10000});
 const n05FractionText=await page.$eval('.f1-question-prompt',e=>e.textContent);
 check('N05_FRACTION_SPANISH_RESIDUAL_FIXED',n05FractionText.includes('valor numèric de la fracció 3/4')&&!n05FractionText.includes('fracción'),
  n05FractionText,'No untranslated Spanish template remains in decimal conversion');
 await page.goto(base+'?lang=ca#/curso/E1/unidad/E1-N05/leccion/E1-N05-L01',{waitUntil:'networkidle0'});
 await page.waitForSelector('#f3-answer',{timeout:10000});
 await page.click('#f3-answer');await page.keyboard.type('70');
 await page.click('.f3-question button[type=submit]');
 const n05Feedback=await page.$eval('.f3-feedback',e=>e.textContent);
 check('N05_CANONICAL_VALIDATOR_CA',n05Feedback.includes('Correcte.')&&n05Feedback.includes('resultat és 70'),
  n05Feedback.slice(0,200),'Decimal conversion validator unchanged in Catalan');
 const solved=[
  ['E1-P01','E1-P01-L01','3','raó vermelles/blaves','3'],
  ['E1-M01','E1-M01-L02','2400','Converteix 2,4 km','2400'],
  ['E1-G01','E1-G01-L01','53','complement de 37°','53']
 ];
 for(const [unit,lesson,answer,fragment,result] of solved){
  await page.goto(base+'?lang=ca#/curso/E1/unidad/'+unit+'/leccion/'+lesson,{waitUntil:'networkidle0'});
  await page.waitForSelector('#f3-answer',{timeout:10000});
  const prompt=await page.$eval('.f1-question-prompt',e=>e.textContent);
  await page.click('#f3-answer');await page.keyboard.type(answer);
  await page.click('.f3-question button[type=submit]');
  const feedback=await page.$eval('.f3-feedback',e=>e.textContent);
  check('E1_NEW_VALIDATOR_'+unit,prompt.includes(fragment)&&feedback.includes('Correcte.')&&feedback.includes(result),
   {prompt,feedback},'Canonical validator and Catalan feedback');
 }
 const finalEso=[
  ['E1-A01','E1-A01-L01','16','patró 4, 7, 10, 13'],
  ['E1-F01','E1-F01-L01','3','coordenada horitzontal x'],
  ['E1-D01','E1-D01-L01','20','població de 80 unitats']
 ];
 for(const [unit,lesson,answer,promptPart] of finalEso){
  await page.goto(base+'?lang=ca#/curso/E1/unidad/'+unit+'/leccion/'+lesson,{waitUntil:'networkidle0'});
  await page.waitForSelector('#f3-answer',{timeout:10000});
  const exercisePrompt=await page.$eval('.f1-question-prompt',e=>e.textContent);
  await page.click('#f3-answer');await page.keyboard.type(answer);
  await page.click('.f3-question button[type=submit]');
  const exerciseFeedback=await page.$eval('.f3-feedback',e=>e.textContent);
  check('FINAL_E1_VALIDATOR_'+unit,exercisePrompt.includes(promptPart)&&exerciseFeedback.includes('Correcte.'),
   {exercisePrompt,exerciseFeedback},'Original validator, translated question and feedback');
 }
 await page.goto(base+'?lang=ca#/curso/E2/unidad/E2-N01/leccion/E2-N01-L01',{waitUntil:'networkidle0'});
 await page.waitForSelector('#f3-answer',{timeout:10000});
 await page.click('#f3-answer');await page.keyboard.type('9');
 await page.click('.f3-question button[type=submit]');
 const e2Feedback=await page.$eval('.f3-feedback',e=>e.textContent);
 check('E2_N01_VALIDATOR_CA',e2Feedback.includes('Correcte.')&&e2Feedback.includes('Resposta exacta: 9'),
  e2Feedback.slice(0,240),'Signed power calculator preserves canonical answer');
 const manifest=JSON.parse(fs.readFileSync(path.join(site,'i18n/ca-ES/manifest.v1.json'),'utf8'));
 const pendingRef=manifest.units.find(x=>!x.package);
 if(pendingRef){
  const courseCode=pendingRef.unit_id.split('-')[0];
  const unitRef=units.find(u=>u.unit_id===pendingRef.unit_id);
  const lessonId=unitRef?.lessons?.[0]?.lesson_id;
  await page.goto(base+'?lang=ca#/curso/'+courseCode+'/unidad/'+pendingRef.unit_id+'/leccion/'+lessonId,
   {waitUntil:'networkidle0'});
  await page.waitForSelector('.f1-question-prompt',{timeout:12000});
  const pending=await page.evaluate(()=>({
   mainLang:document.querySelector('#main').lang,
   prompt:document.querySelector('.f1-question-prompt')?.textContent,
   bannerVisible:!document.querySelector('#locale-partial').hidden
  }));
  check('UNTRANSLATED_DYNAMIC_ES_FALLBACK',pending.mainLang==='es'&&pending.bannerVisible,
   {unit:pendingRef.unit_id,...pending},'Pending unit still attributed Spanish');
 }

 check('NO_JS_OR_EXTERNAL',results.jsErrors.length===0&&results.external.length===0&&results.httpErrors.length===0,
  {jsErrors:results.jsErrors,external:results.external,httpErrors:results.httpErrors},'no errors/requests');
 }catch(e){results.jsErrors.push('FATAL '+e.stack);console.log('FATAL',e.stack);}
 finally{
  if(browser)await browser.close().catch(()=>{});
  if(server)await new Promise(res=>server.close(res));
  results.summary={pass:results.tests.filter(x=>x.status==='PASS').length,
   fail:results.tests.filter(x=>x.status==='FAIL').length,
   errors:results.jsErrors.length,external:results.external.length,http:results.httpErrors.length};
  fs.writeFileSync(path.join(evidence,'I18N_CA_BROWSER_RESULT.json'),JSON.stringify(results,null,2)+'\n');
  console.log('I18N_RESULT',JSON.stringify(results.summary));
  if(results.summary.fail||results.summary.errors||results.summary.external||results.summary.http)process.exitCode=1;
 }
})();

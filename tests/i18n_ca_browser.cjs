'use strict';
// ca-ES browser smoke: no network beyond ephemeral loopback; no tests of linguistic correctness implied.
const fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'..'),site=path.join(root,'site');
const evidence=path.resolve(root,'../evidencias');
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
 check('F3_LESSON_ORIGINAL_SPANISH_FALLBACK',f3.mainLang==='es'&&f3.selected==='ca'&&f3.hasF3Content&&f3.bannerVisible,
  f3,'F3 lesson remains readable in Spanish with language attribution');
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

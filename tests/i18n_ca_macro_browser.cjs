'use strict';
// Dynamic ca-ES browser regression for every package reported complete by manifest.
// Strictly ephemeral loopback, no external network, no human linguistic certification.
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
 if(local&&fs.existsSync(local))puppeteer=require(local);
 else throw Error('No local puppeteer-core; run offline test with installed dependency');
}
const chrome=process.env.CHROME_PATH||
 (process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':'/usr/bin/google-chrome');
const tests=[],jsErrors=[],external=[],httpErrors=[];
function check(id,okay,data){tests.push({id,status:okay?'PASS':'FAIL',data});console.log(id,okay?'PASS':'FAIL',JSON.stringify(data).slice(0,150));}
let server,browser;
(async()=>{try{
 const cat=JSON.parse(fs.readFileSync(path.join(site,'data/catalogo.json'),'utf8'));
 const manifest=JSON.parse(fs.readFileSync(path.join(site,'i18n/ca-ES/manifest.v1.json'),'utf8'));
 const courseByUnit={},lessonByUnit={};
 for(const c of cat.courses)for(const u of c.units){
   courseByUnit[u.unit_id]=c.course_id||c.code||u.unit_id.split('-')[0];
   lessonByUnit[u.unit_id]=u.lessons;
 }
 const complete=manifest.units.filter(u=>u.package&&
   u.draft_translated_lessons===u.source_lessons&&
   u.draft_translated_activities===u.source_activities);
 check('MANIFEST_UNIT_COVERAGE',complete.length>12,
   {draft_units:complete.length,draft_lessons:manifest.counts.translated_lesson_drafts});
 const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
   '.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
 server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  const f=path.resolve(site,decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html');
  if(!f.startsWith(site+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){
   res.writeHead(404);res.end();return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  res.end(fs.readFileSync(f));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+'/';
 browser=await puppeteer.launch({headless:true,executablePath:chrome,
   args:['--no-first-run','--disable-extensions','--disable-background-networking']});
 const page=await browser.newPage();
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await page.setRequestInterception(true);
 page.on('request',r=>{
   if(r.url().startsWith(base)||r.url().startsWith('data:'))r.continue().catch(()=>{});
   else{external.push(r.url());r.abort().catch(()=>{});}
 });
 page.on('pageerror',e=>jsErrors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)httpErrors.push({status:r.status(),url:r.url()});});
 for(const item of complete){
  const uid=item.unit_id;
  const lesson=lessonByUnit[uid]?.[0];
  if(!lesson){check(uid+'_NO_LESSON',false,item);continue;}
  const lid=lesson.lesson_id;
  const ccode=uid.split('-')[0];
  const url=base+'?lang=ca#/curso/'+ccode+'/unidad/'+uid+'/leccion/'+lid;
  await page.goto(url,{waitUntil:'networkidle0'});
  await page.waitForSelector('.f1-question-prompt',{timeout:10000});
  const state=await page.evaluate(()=>({
    lang:document.querySelector('#main').lang,
    htmlLang:document.documentElement.lang,
    title:document.querySelector('#main h1')?.textContent,
    prompt:document.querySelector('.f1-question-prompt')?.textContent,
    banner:!document.querySelector('#locale-partial').hidden,
    overflow:document.documentElement.scrollWidth>innerWidth+3,
    route:location.hash
  }));
  const pkg=JSON.parse(fs.readFileSync(path.join(site,'i18n/ca-ES',uid+'.v1.json'),'utf8'));
  const expectedTitle=pkg.lessons[lid]?.title;
  const firstExerciseId=Object.keys(pkg.activities).find(x=>x.includes(lid+'-'));
  const expectedPrompt=firstExerciseId&&pkg.activities[firstExerciseId]?.prompt;
  const pass=state.lang==='ca'&&state.htmlLang==='ca'&&state.banner&&
    state.title===expectedTitle&&state.prompt===expectedPrompt&&
    !state.overflow&&state.route.includes(lid);
  check('CA_UNIT_'+uid,pass,{lang:state.lang,title:state.title,
    expectedTitle,prompt:state.prompt?.slice(0,90),overflow:state.overflow});
 }
 const incomplete=manifest.units.find(u=>!u.package);
 if(incomplete){
  const lid=lessonByUnit[incomplete.unit_id]?.[0]?.lesson_id;
  const code=incomplete.unit_id.split('-')[0];
  await page.goto(base+'?lang=ca#/curso/'+code+'/unidad/'+incomplete.unit_id+'/leccion/'+lid,
    {waitUntil:'networkidle0'});
  await page.waitForSelector('.f1-question-prompt',{timeout:10000});
  const fallback=await page.evaluate(()=>({
    mainLang:document.querySelector('#main').lang,
    banner:!document.querySelector('#locale-partial').hidden
  }));
  check('PENDING_UNIT_EXPLICIT_FALLBACK',fallback.mainLang==='es'&&fallback.banner,
    {unit:incomplete.unit_id,...fallback});
 }
 check('NO_BROWSER_ERRORS_OR_EXTERNAL',!jsErrors.length&&!external.length&&!httpErrors.length,
   {jsErrors,external,httpErrors});
}catch(err){jsErrors.push('FATAL '+err.stack);console.log('FATAL',err.stack);}
finally{
 if(browser)await browser.close().catch(()=>{});
 if(server)await new Promise(resolve=>server.close(resolve));
 const summary={pass:tests.filter(x=>x.status==='PASS').length,
  fail:tests.filter(x=>x.status==='FAIL').length,
  jsErrors:jsErrors.length,external:external.length,httpErrors:httpErrors.length};
 fs.writeFileSync(path.join(evidence,'I18N_CA_MACRO_BROWSER_RESULT.json'),
   JSON.stringify({summary,tests,jsErrors,external,httpErrors},null,2)+'\n');
 console.log('MACRO_BROWSER_SUMMARY',JSON.stringify(summary));
 if(summary.fail||summary.jsErrors||summary.external||summary.httpErrors)process.exitCode=1;
}
})();

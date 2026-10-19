/* Synthetic local browser regression; no user profile, network input or publication.
   node check_browser.cjs --input DIR --modules NODE_MODULES [--channel chrome] [--checks arrows]
*/
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{pathToFileURL}=require('url');
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,s)=>{if(v.startsWith('--'))a.push([v.slice(2),s[i+1]]);return a},[]));
if(!args.input)throw Error('--input required');
for(const key of Object.keys(args))if(!['input','modules','channel','checks'].includes(key))throw Error('Unknown option: --'+key);
if(Object.hasOwn(args,'checks')&&args.checks!=='arrows')throw Error('--checks must be arrows, or omitted for the full check');
const {chromium}=require(args.modules?path.join(path.resolve(args.modules),'playwright'):'playwright');
const root=path.resolve(args.input), manifest=JSON.parse(fs.readFileSync(path.join(root,'fixtures.json'),'utf8'));
const fixtureSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'fixture.html'))).digest('hex');
const assertions=[];const check=(name,ok,detail)=>assertions.push({name,pass:!!ok,detail});
(async()=>{
 let browser;try{
 browser=await chromium.launch({headless:true,channel:args.channel||'chrome'});
 const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();
 const consoleErrors=[];page.on('pageerror',e=>consoleErrors.push(e.message));
 const route=pathToFileURL(path.join(root,'fixture.html')).href;
 if(args.checks==='arrows'){
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   await page.setViewportSize(viewport);await page.goto(route);await page.evaluate(()=>document.fonts.ready);
   const nav=await page.evaluate(()=>{
    const prev=document.querySelector('#prev'),next=document.querySelector('#next');
    const icon=button=>{const el=button.querySelector('span[aria-hidden="true"]');if(!el)return null;const transformChain=[];for(let node=el;node;node=node.parentElement){const style=getComputedStyle(node);transformChain.push({tag:node.tagName,id:node.id,transform:style.transform,translate:style.translate,scale:style.scale,rotate:style.rotate,writingMode:style.writingMode});if(node===document.documentElement)break}const style=getComputedStyle(el),r=el.getBoundingClientRect();return{glyph:el.textContent.trim(),visibility:style.visibility,display:style.display,opacity:style.opacity,transformChain,rect:{x:r.x,y:r.y,width:r.width,height:r.height}}};
    return {prevX:prev.getBoundingClientRect().x,nextX:next.getBoundingClientRect().x,prevName:prev.getAttribute('aria-label')||prev.textContent.replace(/→|←/g,'').trim(),nextName:next.getAttribute('aria-label')||next.textContent.replace(/→|←/g,'').trim(),prevIcon:icon(prev),nextIcon:icon(next)};
   });
   check(viewport.width+': previous is physically right of next',nav.prevX>nav.nextX,nav);
   check(viewport.width+': previous label and right-arrow glyph',nav.prevName==='הקודם'&&nav.prevIcon?.glyph==='→',nav);
   check(viewport.width+': next label and left-arrow glyph',nav.nextName==='הבא'&&nav.nextIcon?.glyph==='←',nav);
   const visible=icon=>icon&&icon.visibility==='visible'&&icon.display!=='none'&&Number(icon.opacity)>0&&icon.rect.width>0&&icon.rect.height>0;
   check(viewport.width+': arrow elements have visible styles and nonzero boxes',visible(nav.prevIcon)&&visible(nav.nextIcon),nav);
   const untransformed=icon=>icon&&icon.transformChain.every(x=>x.transform==='none'&&x.translate==='none'&&x.scale==='none'&&x.rotate==='none'&&x.writingMode==='horizontal-tb');
   check(viewport.width+': no transform or writing mode alters simple Unicode arrows',untransformed(nav.prevIcon)&&untransformed(nav.nextIcon),nav);
   check(viewport.width+': accessible button names',await page.getByRole('button',{name:'הקודם'}).count()===1&&await page.getByRole('button',{name:'הבא'}).count()===1,nav);
   await page.locator('nav').screenshot({path:path.join(root,`arrows-${viewport.width}.png`)});
   const counter=()=>page.locator('#counter').textContent();
   check(viewport.width+': previous disabled at first item',(await page.locator('#prev').isDisabled())&&await counter()==='1 / 3');
   await page.keyboard.press('ArrowRight');check(viewport.width+': ArrowRight stays at first-item boundary',await counter()==='1 / 3'&&await page.locator('#prev').isDisabled());
   await page.locator('#next').click();check(viewport.width+': next click advances',await counter()==='2 / 3');
   await page.locator('#prev').click();check(viewport.width+': previous click returns',await counter()==='1 / 3');
   await page.keyboard.press('ArrowLeft');check(viewport.width+': ArrowLeft advances to second item',await counter()==='2 / 3');
   await page.keyboard.press('ArrowLeft');check(viewport.width+': ArrowLeft advances to last item',await counter()==='3 / 3');
   check(viewport.width+': next disabled at last item',(await page.locator('#next').isDisabled())&&await counter()==='3 / 3');
   await page.keyboard.press('ArrowLeft');check(viewport.width+': ArrowLeft stays at last-item boundary',await counter()==='3 / 3'&&await page.locator('#next').isDisabled());
   await page.keyboard.press('ArrowRight');check(viewport.width+': ArrowRight returns to second item',await counter()==='2 / 3');
   await page.keyboard.press('ArrowRight');check(viewport.width+': ArrowRight returns to first item',await counter()==='1 / 3');
   check(viewport.width+': previous remains disabled at first item',(await page.locator('#prev').isDisabled())&&await counter()==='1 / 3');
  }
  check('no page errors',consoleErrors.length===0,consoleErrors);
  const report={mode:'arrows',browserVersion:browser.version(),channel:args.channel||'chrome',fixtureSha256,manifestFixtureSha256:manifest.sha256['fixture.html'],assertions,visualReview:'pending; inspect arrows-1280.png and arrows-390.png for final glyph pixels'};
  fs.writeFileSync(path.join(root,'arrows-results.json'),JSON.stringify(report,null,2));
  await browser.close();const failed=assertions.filter(x=>!x.pass);console.log(JSON.stringify({mode:'arrows',checks:assertions.length,passed:assertions.length-failed.length,failed}));if(failed.length)process.exitCode=1;return;
 }
 await page.goto(route);await page.evaluate(()=>document.fonts.ready);
 const expected=manifest.cases;
 const state=await page.evaluate(expected=>{
  const rect=r=>({x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom});
  const chars=(element)=>{const out=[],walk=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);while(walk.nextNode()){const n=walk.currentNode;for(let i=0;i<n.textContent.length;i++){const range=document.createRange();range.setStart(n,i);range.setEnd(n,i+1);out.push({char:n.textContent[i],...rect(range.getBoundingClientRect())})}}return out};
  return expected.map(({id,logical})=>{const p=document.querySelector('#'+id+' p');return {id,text:p.textContent,expected:logical,direction:getComputedStyle(p).direction,rect:rect(p.getBoundingClientRect()),chars:chars(p),ltr:[...p.querySelectorAll('[data-ltr]')].map(el=>({text:el.textContent,direction:getComputedStyle(el).direction,unicodeBidi:getComputedStyle(el).unicodeBidi,chars:chars(el)}))}})
 },expected);
 for(const c of state){
  check(c.id+': logical source preserved',c.text===c.expected);
  check(c.id+': RTL base',c.direction==='rtl');
  const letters=c.chars.filter(x=>/[א-ת]/.test(x.char));
  check(c.id+': Hebrew glyph order',letters.length>1&&letters.every((ch,i)=>i===0||Math.abs(ch.y-letters[i-1].y)>2||ch.x<letters[i-1].x));
  for(const [i,r] of c.ltr.entries()){
   check(c.id+': LTR isolate '+i,r.direction==='ltr'&&r.unicodeBidi.includes('isolate'));
   const chars=r.chars.filter(ch=>/[A-Za-z0-9]/.test(ch.char));
   check(c.id+': LTR glyph order '+i,chars.every((ch,j)=>j===0||Math.abs(ch.y-chars[j-1].y)>2||ch.x>=chars[j-1].x));
  }
 }
 const neg=await page.locator('#negative').evaluate(el=>({direction:getComputedStyle(el).direction,align:getComputedStyle(el).textAlign}));
 check('negative control rejected by RTL gate',neg.direction!=='rtl'&&neg.align==='right',neg);
 const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
 const dom=await cdp.send('DOM.getDocument');const fonts=[];
 for(const selector of ['#hebrew p','#mixed p','#number p','#niqqud p','h1']){
  const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:dom.root.nodeId,selector});
  fonts.push({selector,...await cdp.send('CSS.getPlatformFontsForNode',{nodeId})});
 }
 for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
  await page.setViewportSize(viewport);await page.screenshot({path:path.join(root,`browser-${viewport.width}.png`),fullPage:true});
  const bounds=await page.evaluate(()=>({pageOverflow:document.documentElement.scrollWidth>innerWidth,prev:document.querySelector('#prev').getBoundingClientRect().x,next:document.querySelector('#next').getBoundingClientRect().x,tableWidth:document.querySelector('.table-scroll').clientWidth,tableScrollWidth:document.querySelector('.table-scroll').scrollWidth}));
  check(viewport.width+': no page overflow',!bounds.pageOverflow,bounds);
  check(viewport.width+': navigation physical positions',bounds.prev>bounds.next);
  const svgScale=await page.locator('svg').evaluate(el=>el.getBoundingClientRect().width/350);
  check(viewport.width+': SVG text remains readable',svgScale*24>=18,{effectiveFontSize:svgScale*24});
  if(viewport.width===390){const before=await page.locator('table th').first().boundingBox();await page.locator('.table-scroll').evaluate(el=>{el.scrollLeft=-el.scrollWidth});const after=await page.locator('table th').first().boundingBox();check('mobile: table scrolls to reveal columns',Math.abs(before.x-after.x)>100,{before,after});}
 }
 await page.getByRole('button',{name:'הבא'}).click();check('next click advances',(await page.locator('#counter').textContent())==='2 / 3');
 await page.keyboard.press('ArrowLeft');check('ArrowLeft advances',(await page.locator('#counter').textContent())==='3 / 3');
 await page.keyboard.press('ArrowRight');check('ArrowRight returns',(await page.locator('#counter').textContent())==='2 / 3');
 await page.setViewportSize({width:1280,height:900});await page.pdf({path:path.join(root,'browser.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
 check('no page errors',consoleErrors.length===0,consoleErrors);
 const report={browserVersion:browser.version(),channel:args.channel||'chrome',fixtureSha256,manifestFixtureSha256:manifest.sha256['fixture.html'],assertions,fonts,glyphGeometry:state,visualReview:'pending; inspect PNGs and PDF pages separately'};
 fs.writeFileSync(path.join(root,'browser-results.json'),JSON.stringify(report,null,2));
 await browser.close();const failed=assertions.filter(x=>!x.pass);console.log(JSON.stringify({checks:assertions.length,passed:assertions.length-failed.length,failed}));if(failed.length)process.exitCode=1;
 }catch(e){if(browser){try{await browser.close()}catch{}}throw e;}
})().catch(e=>{console.error(e);process.exitCode=1});

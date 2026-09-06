async (page) => {
  const origin = await page.evaluate(() => location.origin);
  await page.emulateMedia({reducedMotion:'no-preference'});
  const passed = [];
  const check = (value, name) => { if (!value) throw new Error(name); passed.push(name); };
  const browser = page.context().browser();
  const nojs = await browser.newContext({javaScriptEnabled:false, viewport:{width:1440,height:960}});
  const staticPage = await nojs.newPage(); await staticPage.goto(origin);
  check(await staticPage.locator('.reveal').evaluateAll(nodes=>nodes.every(node=>getComputedStyle(node).opacity==='1')), 'no JavaScript keeps all content visible');
  check(await staticPage.locator('.flow-chapter').getAttribute('data-scroll')==='false','no JavaScript keeps normal flow layout');
  await nojs.close();
  const failure = await browser.newContext({viewport:{width:1440,height:960}});
  await failure.addInitScript(()=>{
    const NativeObserver=window.IntersectionObserver;
    window.IntersectionObserver=class extends NativeObserver {
      observe(target) {
        if (target.matches('.hero,.flow-chapter,.reveal')) throw new Error('QA simulated motion observation failure');
        super.observe(target);
      }
    };
  });
  const fallback = await failure.newPage(); await fallback.goto(origin);
  await fallback.waitForFunction(()=>document.querySelector('.motion-root')?.dataset.motion==='running');
  check(await fallback.locator('.flow-chapter').getAttribute('data-scroll')==='false','motion observer failure disables sticky layout');
  check(await fallback.locator('.reveal').evaluateAll(nodes=>nodes.every(node=>getComputedStyle(node).opacity==='1')),'motion observer failure leaves text visible');
  await fallback.getByRole('button',{name:'Etapa 2: Contexto',exact:true}).click();
  check(await fallback.locator('.flow-node[aria-pressed=true]').getAttribute('aria-label')==='Etapa 2: Contexto','motion observer failure preserves manual controls');
  await failure.close();
  await page.setViewportSize({width:1091,height:650});
  await page.goto(origin);
  await page.waitForFunction(()=>document.querySelector('.motion-root')?.dataset.motion==='running');
  check(await page.locator('.flow-chapter').getAttribute('data-scroll')==='false','short viewport avoids sticky content clipping');
  await page.setViewportSize({width:1440,height:960});
  await page.emulateMedia({reducedMotion:'reduce'}); await page.reload();
  await page.waitForFunction(()=>document.querySelector('.motion-root')?.dataset.motion==='reduced');
  check(await page.locator('.flow-chapter').getAttribute('data-scroll')==='false','reduced motion is respected from initial load');
  await page.emulateMedia({reducedMotion:'no-preference'});
  return passed;
}

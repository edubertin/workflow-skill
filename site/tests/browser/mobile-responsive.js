async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const results = [];
  const check = (value, label) => { if (!value) throw new Error(label); results.push(label); };
  for (const [width,height] of [[320,740],[360,800],[375,812],[390,844],[414,896],[430,932],[650,900],[651,900],[700,900],[701,900],[760,900],[761,900],[844,390],[960,900],[961,900]]) {
    await page.setViewportSize({width,height});
    for (const route of ['/','/manual']) {
      await page.goto(origin+route);
      await page.locator('.motion-root[data-ready=true]').waitFor();
      const fits = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      check(fits, route+' fits '+width+'×'+height);
    }
  }
  await page.setViewportSize({width:320,height:740});
  await page.goto(origin);
  await page.locator('.mobile-menu summary').click();
  check(await page.locator('.mobile-menu').getAttribute('open') !== null,'menu opens');
  await page.locator('.mobile-menu summary').press('Escape');
  check(await page.locator('.mobile-menu summary').evaluate(el=>el===document.activeElement),'Escape restores menu focus');
  await page.locator('.mobile-menu summary').click();
  await page.getByRole('button',{name:'Pausar animações',exact:true}).first().click();
  check(await page.locator('.motion-root').getAttribute('data-motion')==='paused','mobile menu pauses motion');
  await page.getByRole('link',{name:'Como funciona',exact:true}).click();
  check(await page.locator('.mobile-menu').getAttribute('open')===null,'menu closes on navigation');
  for (const title of ['Pedido','Contexto','Plano','Execução','Verificação']) {
    await page.getByRole('button',{name:new RegExp('Etapa [1-5]: '+title+'$')}).click();
    check((await page.locator('.mobile-stage-title').textContent()).includes(title),'select '+title);
  }
  const targets = await page.locator('.mobile-menu summary,.mobile-manual-link,.flow-node,.flow-controls button').evaluateAll(nodes=>nodes.every(node=>{const r=node.getBoundingClientRect();return r.width>=44&&r.height>=44;}));
  check(targets,'mobile navigation and flow touch targets');
  await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body *')].map(el=>[el,getComputedStyle(el).fontSize]);for(const [el,size] of sizes)el.style.fontSize=parseFloat(size)*2+'px';});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'home fits with text enlarged to 200%');
  return results;
}

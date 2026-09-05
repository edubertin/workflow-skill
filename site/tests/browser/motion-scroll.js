async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const passed = [];
  const check = (value, name) => { if (!value) throw new Error(name); passed.push(name); };
  const active = () => page.locator('.flow-node[aria-pressed=true]').getAttribute('aria-label');
  await page.setViewportSize({width:1440,height:960});
  await page.goto(origin);
  await page.locator('.flow-chapter[data-scroll=true]').waitFor();
  const seen = new Set();
  for (let i=0;i<24;i++) { await page.mouse.wheel(0,140); await page.waitForTimeout(90); seen.add(await active()); }
  check(seen.size === 5, 'scroll forward visits all five stages');
  const reversed = new Set();
  for (let i=0;i<24;i++) { await page.mouse.wheel(0,-140); await page.waitForTimeout(90); reversed.add(await active()); }
  check(reversed.size === 5, 'scroll backward visits all five stages');
  await page.getByRole('button',{name:'Etapa 4: Execução',exact:true}).click();
  await page.waitForTimeout(150);
  check((await active()).includes('4:'), 'manual selection holds without scrolling');
  await page.setViewportSize({width:1430,height:960}); await page.waitForTimeout(200);
  check((await active()).includes('4:'), 'resize does not override manual stage');
  await page.mouse.wheel(0,100); await page.waitForTimeout(180);
  check(!(await active()).includes('4:'), 'new scroll gesture resumes stage synchronization');
  await page.getByRole('button',{name:'Pausar animações',exact:true}).first().click();
  const frozen = await active();
  await page.mouse.wheel(0,1700); await page.waitForTimeout(300);
  check(await active() === frozen, 'global pause freezes stage while page still scrolls');
  check(await page.evaluate(() => scrollY > 500), 'page scrolling remains available during pause');
  await page.getByRole('button',{name:'Etapa 5: Verificação',exact:true}).click();
  check((await active()).includes('5:'), 'manual stages still work during global pause');
  const reveal = await page.locator('.reveal').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).opacity));
  check(reveal.every(opacity=>opacity==='1'), 'pause finishes every content reveal');
  await page.getByRole('button',{name:'Retomar animações',exact:true}).first().click();
  await page.waitForTimeout(60);
  check(await page.locator('.reveal').evaluateAll(nodes=>nodes.every(node=>getComputedStyle(node).opacity==='1')), 'resume does not restart completed reveals');
  return passed;
}

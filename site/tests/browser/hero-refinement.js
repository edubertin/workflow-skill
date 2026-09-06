async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const passed = [];
  const check = (value, name) => { if (!value) throw new Error(name); passed.push(name); };
  await page.goto(origin);
  await page.locator('.wordmark[data-illuminated=true]').waitFor();
  for (const width of [390, 760, 1091, 1440, 1920, 2560]) {
    await page.setViewportSize({width,height:930});
    const bounds = await page.evaluate(() => {
      const shell = document.querySelector('.hero-layout').getBoundingClientRect();
      const art = document.querySelector('.hero-visual').getBoundingClientRect();
      return {left:art.left-shell.left,right:art.right-shell.right,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    check(Math.abs(bounds.left)<1 && Math.abs(bounds.right)<1 && !bounds.overflow, 'art follows content bounds at '+width+'px');
  }
  check(await page.locator('.flow-chapter .diagram-note').count()===0,'flow note removed');
  await page.setViewportSize({width:1091,height:930});
  await page.getByRole('link',{name:'Workflow, início',exact:true}).hover();
  await page.waitForTimeout(280);
  const lighting = () => page.locator('.wordmark-letter').evaluateAll(nodes=>nodes.map(node=>({color:getComputedStyle(node).color,shadow:getComputedStyle(node).textShadow})));
  const lit = await lighting();
  check(lit.some(letter=>letter.shadow!=='none') && new Set(lit.map(letter=>letter.color)).size>1,'champagne illumination visibly travels by letter');
  await page.getByRole('button',{name:'Pausar animações',exact:true}).first().click();
  const paused = await lighting(); await page.waitForTimeout(300);
  check(JSON.stringify(paused)===JSON.stringify(await lighting()),'header pause freezes letter illumination');
  await page.getByRole('button',{name:'Retomar animações',exact:true}).first().click();
  await page.mouse.wheel(0,1600); await page.waitForTimeout(180);
  check(await page.locator('.wordmark-letter').first().evaluate(node=>getComputedStyle(node).animationPlayState)==='paused','wordmark suspends outside viewport');
  await page.keyboard.press('Control+Home');
  return passed;
}

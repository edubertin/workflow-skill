async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const passed = [];
  const check = (value, name) => { if (!value) throw new Error(name); passed.push(name); };
  const root = page.locator('.motion-root');
  const frame = () => page.evaluate(() => ({
    ribbon: getComputedStyle(document.querySelector('.hero-ribbon')).transform,
    signal: getComputedStyle(document.querySelector('.hero-route'), '::after').transform,
    scroll: getComputedStyle(document.querySelector('.hero-visual')).transform
  }));
  await page.setViewportSize({width:1091,height:930});
  await page.goto(origin);
  await page.waitForFunction(() => document.querySelector('.motion-root')?.dataset.motion === 'running');
  const before = await frame(); await page.waitForTimeout(250);
  check(JSON.stringify(before) !== JSON.stringify(await frame()), 'opening visibly advances');
  await page.getByRole('button', {name:'Pausar animações',exact:true}).last().click();
  const frozen = await frame(); await page.waitForTimeout(300);
  check(JSON.stringify(frozen) === JSON.stringify(await frame()), 'pause freezes actual ribbon and signal frames');
  await page.getByRole('link',{name:'Manual técnico',exact:true}).click();
  await page.waitForURL(origin + '/manual');
  await page.getByRole('heading',{name:'Por dentro da Workflow.',exact:true}).waitFor();
  check(await root.getAttribute('data-motion') === 'paused', 'pause persists into manual');
  await page.getByRole('link',{name:'Workflow, início',exact:true}).click();
  await page.waitForURL(origin + '/');
  check(await root.getAttribute('data-motion') === 'paused', 'pause persists back to landing');
  await page.getByRole('button',{name:'Retomar animações',exact:true}).last().click();
  const resumed = await frame(); await page.waitForTimeout(250);
  check(JSON.stringify(resumed) !== JSON.stringify(await frame()), 'resume advances rendered frames');
  await page.getByRole('link',{name:'Workflow, início',exact:true}).hover();
  await page.waitForTimeout(120);
  const letters = await page.locator('.wordmark-letter').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).color));
  check(new Set(letters).size > 1, 'wordmark lights by letter without hiding text');
  return passed;
}

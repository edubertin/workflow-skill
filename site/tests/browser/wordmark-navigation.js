async (page) => {
  const origin = await page.evaluate(() => location.origin);
  await page.goto(origin);
  await page.waitForFunction(() => document.querySelector('.motion-root')?.dataset.motion === 'running');
  for (const interaction of ['click', 'click', 'keyboard']) {
    await page.getByRole('link',{name:'Manual técnico',exact:true}).click();
    await page.waitForURL(origin + '/manual');
    await page.getByRole('heading',{name:'Por dentro da Workflow.',exact:true}).waitFor();
    await page.locator('.wordmark[data-illuminated=true]').waitFor();
    const wordmark = page.getByRole('link',{name:'Workflow, início',exact:true});
    if (interaction === 'keyboard') { await wordmark.focus(); await page.keyboard.press('Enter'); }
    else await wordmark.click();
    await page.waitForURL(origin + '/');
    await page.getByRole('heading',{name:'Clareza para cada etapa.',exact:true}).waitFor();
    if (await page.locator('.motion-root').getAttribute('data-motion') !== 'running') throw new Error('Navigation test requires active motion');
  }
  return {runningWordmarkNavigation:'passed',mouseRoundTrips:2,keyboardRoundTrips:1};
}

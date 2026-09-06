async (page) => {
  const origin=await page.evaluate(()=>location.origin);
  const context=await page.context().browser().newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const phone=await context.newPage();const results=[];
  const check=(value,label)=>{if(!value)throw new Error(label);results.push(label);};
  try {
    await phone.goto(origin);
    await phone.locator('.motion-root[data-ready=true]').waitFor();
    check(await phone.evaluate(()=>matchMedia('(pointer:coarse)').matches),'coarse touch pointer');
    await phone.locator('.mobile-menu summary').tap();
    check(await phone.locator('.mobile-menu').getAttribute('open')!==null,'touch opens menu');
    await phone.getByRole('link',{name:'Como funciona',exact:true}).tap();
    check(await phone.locator('.mobile-menu').getAttribute('open')===null,'touch navigation closes menu');
    await phone.getByRole('button',{name:'Etapa 5: Verificação',exact:true}).tap();
    check((await phone.locator('.mobile-stage-title').textContent()).includes('Verificação'),'touch selects final stage');
    check(await phone.locator('.flow-chapter').getAttribute('data-scroll')==='false','touch flow avoids sticky scroll');
    await phone.goto(origin+'/manual');
    await phone.locator('.manual-mobile-index summary').tap();
    await phone.getByRole('link',{name:'04 Estrutura',exact:true}).tap();
    check(await phone.locator('.manual-mobile-index').getAttribute('open')===null,'touch closes manual index');
    await phone.waitForFunction(()=>{const r=document.querySelector('#estrutura').getBoundingClientRect();return r.top>=48&&r.top<innerHeight;});
    check(await phone.locator('[data-format=tree] pre').evaluate(el=>getComputedStyle(el).whiteSpace==='pre'),'touch manual keeps tree indentation');
    for(const viewport of [{width:320,height:740},{width:844,height:390}]) {
      await phone.setViewportSize(viewport);
      for(const route of ['/','/manual']) {
        await phone.goto(origin+route);
        check(await phone.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),route+' touch fits '+viewport.width);
      }
    }
    await phone.emulateMedia({reducedMotion:'reduce'});
    await phone.goto(origin);
    await phone.locator('.motion-root[data-ready=true]').waitFor();
    check(await phone.locator('.motion-root').getAttribute('data-motion')==='reduced','touch respects reduced motion');
    return results;
  } finally {await context.close();}
}

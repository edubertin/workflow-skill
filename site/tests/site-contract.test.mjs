import assert from 'node:assert/strict';
import { test } from 'node:test';
const origin = process.env.SITE_TEST_ORIGIN || 'http://localhost:3000';
const publicOrigin = 'https://workflow-skill.edubertin.chatgpt.site';
const pages = ['/', '/manual'];
function meta(html, key) {
  const tags = html.match(/<meta\b[^>]*>/g) || [];
  const tag = tags.find(item => item.includes('property="' + key + '"') || item.includes('name="' + key + '"'));
  return tag?.match(/content="([^"]*)"/)?.[1];
}
const documents = new Map();
for (const route of pages) {
  test('HTTP, identidade e preview social: ' + route, async () => {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200);
    const html = await response.text();
    documents.set(route, html);
    assert.match(html, /<html[^>]*lang="pt-BR"/);
    assert.match(html, /<title>[^<]*Workflow[^<]*<\/title>/);
    assert.equal(meta(html, 'og:image'), publicOrigin + '/og.png');
    assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
    assert.equal(meta(html, 'twitter:image'), publicOrigin + '/og.png');
    assert.equal(new URL(meta(html, 'og:url')).href, new URL(publicOrigin + route).href);
    assert.ok(meta(html, 'description')?.length > 50);
  });
}
test('Todas as âncoras internas e rotas renderizadas resolvem', async () => {
  for (const [route, html] of documents) {
    const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(item => item[1]);
    for (const href of new Set(hrefs)) {
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const target = new URL(href, origin + route);
      if (target.pathname === '/docs/piloto-portatil.md') {
        assert.equal((await fetch(target)).status, 200);
        continue;
      }
      const document = documents.get(target.pathname);
      assert.ok(document, 'Rota inexistente: ' + href);
      if (target.hash) assert.ok(document.includes('id="' + target.hash.slice(1) + '"'), 'Âncora inexistente: ' + href);
    }
  }
});
test('Card social e assets estão disponíveis com formatos corretos', async () => {
  const social = await fetch(origin + '/og.png');
  assert.equal(social.status, 200);
  assert.match(social.headers.get('content-type') || '', /image\/png/);
  const image = Buffer.from(await social.arrayBuffer());
  assert.equal(image.toString('hex', 0, 8), '89504e470d0a1a0a');
  assert.equal(image.readUInt32BE(16), 1731);
  assert.equal(image.readUInt32BE(20), 909);
  assert.ok(image.length < 5000000);
  for (const asset of ['/hero-ribbon.png', '/icon.svg']) assert.equal((await fetch(origin + asset)).status, 200);
  const mobile = await fetch(origin + '/hero-ribbon-mobile.webp');
  assert.equal(mobile.status, 200);
  assert.match(mobile.headers.get('content-type') || '', /image\/webp/);
  const mobileImage = Buffer.from(await mobile.arrayBuffer());
  assert.equal(mobileImage.toString('ascii', 0, 4), 'RIFF');
  assert.equal(mobileImage.toString('ascii', 8, 12), 'WEBP');
  assert.ok(mobileImage.length < 900000);
});
test('Manual publica instruções e limites verificáveis', () => {
  const html = documents.get('/manual');
  for (const chapter of ['instalacao', 'estrutura', 'especialistas', 'autorizacoes', 'continuidade', 'validacao', 'manutencao']) {
    assert.ok(html.includes('id="' + chapter + '"'), chapter);
  }
  assert.match(html, /--destination/);
  assert.match(html, /--check/);
  assert.match(html, /não estava autenticado/);
  assert.match(html, /37 cenários/);
});

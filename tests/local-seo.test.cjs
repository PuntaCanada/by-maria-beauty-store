const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const home = fs.readFileSync('index.html', 'utf8');
const braids = fs.readFileSync('trenzas.html', 'utf8');
const dictionary = fs.readFileSync('i18n.js', 'utf8');
test('Local service area is visible on the homepage without inventing an address', () => {
  assert.match(home, /<span class="eyebrow">Maquillaje en Higüey · República Dominicana<\/span>/);
  assert.match(home, /Si estás en Higüey o sus alrededores, escríbeme/);
  assert.match(home, /<p>Maquillaje en Higüey, República Dominicana ♡<\/p>/);
  assert.match(home, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(home, /@media\(max-width:700px\)/);
});
test('Both canonical pages retain local SEO metadata and Spanish language', () => {
  for (const [html, address, title] of [
    [home, 'https://by-maria-beauty-store.pages.dev/', 'Maquillaje en Higüey'],
    [braids, 'https://by-maria-beauty-store.pages.dev/trenzas.html', 'Trenzas en Higüey']
  ]) {
    assert.match(html, /<html lang="es">/);
    assert.ok(html.includes('<link rel="canonical" href="' + address + '"'));
    assert.ok(html.includes('<title>' + title));
    assert.match(html, /<meta name="description" content="[^"]*Higüey/);
    assert.doesNotMatch(html, /<meta name="robots" content="noindex/);
  }
  assert.match(braids, /Consultas de trenzas en Higüey, República Dominicana/);
  assert.match(braids, /data-en="Braiding inquiries in Higüey, Dominican Republic\."/);
});
test('English translations exist and JS remains parseable', () => {
  new vm.Script(dictionary);
  for(const phrase of ['Makeup in Higüey · Dominican Republic','Beautiful makeup for unforgettable moments in Higüey','If you are in Higüey or nearby','Makeup in Higüey, Dominican Republic ♡']) {
    assert.ok(dictionary.includes(phrase), phrase);
  }
});

test('FAQ offers local booking guidance and clearly distinguishes braiding practice',()=>{
 assert.match(home, /id="preguntas" class="section faq"/);
 assert.equal((home.match(/<details>/g)||[]).length, 3);
 assert.match(home, /Los precios y la disponibilidad se consultan directamente por WhatsApp/);
 assert.match(home, /Estoy practicando estilos de trenzas sin una tarifa fija/);
 assert.match(home, /class="faq-link" href="trenzas.html"/);
 assert.match(home, /\.faq-list summary:focus-visible/);
 for(const phrase of ['Frequently asked questions','How much does it cost, and how do I book?','Explore braids ♡'])assert.ok(dictionary.includes(phrase));
});

test('small-screen navigation keeps the Spanish and English switches and the critical links touch-friendly',()=>{
 assert.match(home,/\.nav-links \.trenzas-link,\.nav-links \.nav-action\{display:inline-flex/);
 assert.match(home,/\.lang-button\{min-height:44px\}/);
 assert.match(home,/@media\(max-width:380px\)/);
 assert.match(home,/\.nav-links \.trenzas-link,\.nav-links \.nav-action\{flex:1 1 105px\}/);
 assert.match(braids,/#cita\{scroll-margin-top:16px\}/);
 assert.match(braids,/\.field input,\.field select\{font-size:16px;min-height:48px\}/);
 assert.match(braids,/\.footer\{padding-bottom:78px\}/);
 assert.match(braids,/prefers-reduced-motion:reduce/);
});

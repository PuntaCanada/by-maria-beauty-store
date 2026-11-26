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
  assert.match(home, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
  assert.match(home, /@media\(max-width:700px\)/);
});
test('Both canonical pages retain local SEO metadata and Spanish language', () => {
  for (const [html, address, title] of [
    [home, 'https://by-maria-beauty-store.pages.dev/', 'Maquillaje en Higüey'],
    [braids, 'https://by-maria-beauty-store.pages.dev/trenzas', 'Trenzas en Higüey']
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
  for(const phrase of ['Makeup in Higüey · Dominican Republic','Makeup for birthdays, events and other special occasions in and around Higüey.','If you are in Higüey or nearby','Makeup in Higüey, Dominican Republic ♡']) {
    assert.ok(dictionary.includes(phrase), phrase);
  }
});

test('FAQ offers local booking guidance and clearly distinguishes braiding practice',()=>{
 assert.match(home, /id="preguntas" class="section faq"/);
 assert.equal((home.match(/<details>/g)||[]).length, 3);
 assert.match(home, /Los precios y la disponibilidad se consultan directamente por WhatsApp/);
 assert.match(home, /Estoy practicando estilos de trenzas sin una tarifa fija/);
 assert.match(home, /class="faq-link" href="\/trenzas"/);
 assert.match(home, /\.faq-list summary:focus-visible/);
 for(const phrase of ['Frequently asked questions','How much does it cost, and how do I book?','Braids in Higüey'])assert.ok(dictionary.includes(phrase));
});

test('small-screen navigation keeps the Spanish and English switches and the critical links touch-friendly',()=>{
 assert.match(home,/\.nav-links \.trenzas-link,\.nav-links \.nav-action\{display:inline-flex/);
 assert.match(home,/\.lang-button\{min-height:44px\}/);
 assert.match(home,/@media\(max-width:380px\)/);
 assert.match(home,/\.nav-links \.trenzas-link,\.nav-links \.nav-action\{flex:1 1 105px\}/);
 assert.match(braids,/#cita\{scroll-margin-top:16px\}/);
 assert.match(braids,/\.field input,\.field select\{font-size:16px;min-height:48px\}/);
 assert.match(braids,/\.footer\{padding-bottom:calc\(78px \+ env\(safe-area-inset-bottom, 0px\)\)\}/);
 assert.match(braids,/prefers-reduced-motion:reduce/);
});

test('makeup request is accessible, locally handled and bilingual without saving data',()=>{
  assert.match(home, /id="makeup-request"/);
  assert.match(home, /id="makeup-name"[^>]*maxlength="70"/);
  assert.match(home, /id="makeup-occasion" required/);
  assert.match(home, /id="makeup-date" type="date"/);
  assert.match(home, /makeupForm\.addEventListener\('submit',event=>/);
  assert.match(home, /event\.preventDefault\(\)/);
  assert.match(home, /document\.documentElement\.lang==='en'/);
  assert.match(home, /encodeURIComponent\(message\)/);
  assert.match(home, /window\.open\('https:\/\/wa\.me\/'\+whatsappNumber/);
  assert.match(home, /font-size:16px/);
  assert.match(home, /Los datos solo se usan para preparar el mensaje de WhatsApp y no se guardan aquí/);
  for(const phrase of ['Your name (optional)', "What's the occasion?",'Preferred date (optional)','Prepare WhatsApp inquiry ♡','This does not confirm an appointment'])assert.ok(dictionary.includes(phrase),phrase);
  new vm.Script(home.match(/<script>([\s\S]*?)<\/script>/g).at(-1).replace(/^<script>|<\/script>$/g,''));
});

test('Floating WhatsApp links offer a Spanish inquiry without JavaScript', () => {
  for (const [html, service] of [[home, 'maquillaje'], [braids, 'trenzas en Higüey']]) {
    const href = html.match(/<a class="floating-whatsapp"[^>]* href="([^"]+)"/)[1];
    const url = new URL(href);
    assert.equal(url.origin + url.pathname, 'https://wa.me/18293249535');
    assert.match(url.searchParams.get('text'), /Hola, María/);
    assert.ok(url.searchParams.get('text').includes(service));
  }
});

test('Bilingual partner directories and discreet homepage links',()=>{assert.ok(home.includes('id="partners-link" href="/partners.html"'));assert.ok(dictionary.includes("language==='en'?'/en/partners.html':'/partners.html'"));assert.ok(dictionary.includes('Related projects · Self-promotion'));const sitemap=fs.readFileSync('sitemap.xml','utf8');for(const lang of ['es','en']){const path=lang==='es'?'partners.html':'en/partners.html';const page=fs.readFileSync(path,'utf8');const links=[...page.matchAll(/<li><a href="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(links,["https://comparanetrd.pages.dev/","https://islaviva-rd.pages.dev/","https://vuelosrd.pages.dev/","https://oficiord.pages.dev/","https://recarganet-rd.pages.dev/","https://gewinnradar.pages.dev/","https://demoradar.pages.dev/","https://ahorrord.pages.dev/","https://hablard.pages.dev/","https://transporterd.pages.dev/","https://aprenderd.pages.dev/","https://handyfix.pages.dev/","https://dateiwerk.pages.dev/","https://voicefix.pages.dev/"]);assert.equal(new Set(links).size,14);assert.match(page,/simulat|simulaci/i);assert.ok(page.includes('<html lang="'+lang+'">'));assert.ok(page.includes('<link rel="canonical" href="https://by-maria-beauty-store.pages.dev/'+path+'">'));assert.ok(sitemap.includes('<loc>https://by-maria-beauty-store.pages.dev/'+path+'</loc>'));for(const other of ['es','en','x-default'])assert.ok(page.includes('hreflang="'+other+'" href="https://by-maria-beauty-store.pages.dev/'+(other==='en'?'en/':'')+'partners.html"'));}});

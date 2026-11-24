const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const home=fs.readFileSync('index.html','utf8');
const braids=fs.readFileSync('trenzas.html','utf8');
const sitemap=fs.readFileSync('sitemap.xml','utf8');
test('home retains its makeup navigation and links gently to braids',()=>{
 assert.match(home,/href="#servicios"/);
 assert.match(home,/href="\/trenzas" class="trenzas-link"/);
 assert.match(home,/\.nav-links a:not\(\.nav-action\):not\(\.trenzas-link\)/);
});
test('braids has bilingual content, safe direct WhatsApp request, and only the supplied original flyers',()=>{
 assert.match(braids,/<html lang="es">/);
 assert.match(braids,/data-es="Trenzas clásicas" data-en="Classic braids"/);
 assert.match(braids,/id="booking"/);
 assert.match(braids,/e\.preventDefault\(\)/);
 assert.match(braids,/encodeURIComponent\(message\)/);
 assert.match(braids,/https:\/\/wa\.me\//);
 assert.match(braids,/window\.open\(link,'_blank','noopener,noreferrer'\)/);
 assert.match(braids,/No es una reserva confirmada/);
 for(const img of ['maria-trenzas-gratis.jpg','maria-trenzas-trabajos.jpg','maria-trenzas-servicios.jpg']){
  assert.match(braids,new RegExp(img));
  assert.ok(fs.existsSync('assets/'+img),'Missing original flyer: '+img);
 }
 assert.equal((braids.match(/<img\b/g)||[]).length,3);
});
test('braids page is discoverable without modifying homepage canonical',()=>{
 assert.match(sitemap,/https:\/\/by-maria-beauty-store\.pages\.dev\/trenzas<\/loc>/);
 assert.match(home,/rel="canonical" href="https:\/\/by-maria-beauty-store\.pages\.dev\/"/);
});

test('braids offers an always-visible, accessible and bilingual WhatsApp shortcut independent of booking',()=>{
 assert.match(braids,/class="floating-whatsapp" id="floating-whatsapp-trenzas"/);
 assert.match(braids,/\.floating-whatsapp\{position:fixed;/);
 assert.match(braids,/env\(safe-area-inset-bottom, 0px\)/);
 assert.match(braids,/\.floating-whatsapp:focus-visible/);
 assert.match(braids,/prefers-reduced-motion:reduce/);
 assert.match(braids,/data-umami-event="whatsapp-trenzas-fijo"/);
 assert.match(braids,/function updateFloatingWhatsApp\(\)/);
 assert.match(braids,/floatingWhatsApp\.href='https:\/\/wa\.me\/'\+WA\+'\?text='\+encodeURIComponent\(message\)/);
 assert.match(braids,/updateFloatingWhatsApp\(\);/);
 assert.match(braids,/Ask María about braids on WhatsApp/);
});

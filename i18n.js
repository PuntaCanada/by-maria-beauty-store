/* By María Beauty & Store: English and Spanish without remote translation. */
(function(){
'use strict';
const dictionary={"Maquillaje en Higüey | By María Beauty & Store":"Makeup in Higüey | By María Beauty & Store","Atiendo principalmente en español. También hablo un poquito de inglés. Si puedes, escríbeme en español. ♡":"I mainly communicate in Spanish and speak a little English. If possible, please message me in Spanish. ♡","Sobre mí":"About me","Servicios":"Services","Galería":"Gallery","Contacto":"Contact","Resalta tu":"Highlight your","belleza":"beauty","en cada ocasión.":"for every occasion.","Un maquillaje especial para momentos inolvidables. Realza tu estilo y siéntete tú misma.":"Beautiful makeup for unforgettable moments. Express your style and feel like yourself.","Consultar por WhatsApp":"Ask on WhatsApp","Precios, disponibilidad y citas por WhatsApp":"Prices, availability and appointments via WhatsApp","Beauty by María ♡":"Beauty by María ♡","La belleza está en cada detalle.":"Beauty is in every detail.","Conoce a María":"Meet María","Hola, soy María.":"Hi, I'm María.","Me encanta el mundo del maquillaje y ayudar a cada persona a sentirse hermosa y segura en sus momentos especiales. Cada look es una oportunidad para resaltar tu belleza y tu estilo.":"I love the world of makeup and helping people feel beautiful and confident on special occasions. Every look is a chance to highlight your beauty and personal style.","Con cariño, María ♡":"With love, María ♡","Un toque especial":"A special touch","Servicios de maquillaje":"Makeup services","Maquillaje social":"Occasion makeup","Para una salida especial, una celebración o un momento para ti.":"For a special night out, a celebration or a moment just for you.","Eventos y cumpleaños":"Events and birthdays","Un look especial para acompañarte en una ocasión inolvidable.":"A beautiful look to complement your unforgettable occasion.","Natural o glam":"Natural or glam","Desde un estilo delicado hasta un maquillaje más llamativo.":"From a subtle finish to a more striking makeup look.","¿Tienes una idea diferente? Cuéntasela a María por WhatsApp.":"Have another idea? Tell María about it on WhatsApp.","Inspiración y estilo":"Inspiration and style","Próximamente":"Coming soon","Muy pronto compartiremos aquí nuevos looks y trabajos de maquillaje.":"We'll share new looks and makeup work here soon.","Tu próximo look empieza aquí":"Your next look starts here","¿Lista para brillar?":"Ready to shine?","Escríbeme para consultar precios, disponibilidad y detalles de tu maquillaje. ¡Será un placer atenderte!":"Message me to ask about pricing, availability and makeup details. I'd love to help!","Escríbeme por WhatsApp":"Message me on WhatsApp","Maquillaje, belleza y mucho cariño ♡":"Makeup, beauty and lots of love ♡","Volver arriba ↑":"Back to top ↑","By María Beauty & Store":"By María Beauty & Store","By María Beauty &amp; Store":"By María Beauty & Store","Escribir a María por WhatsApp (abre WhatsApp)":"Message María on WhatsApp (opens WhatsApp)","By María Beauty & Store, inicio":"By María Beauty & Store, homepage"};
const key='by-maria-language';
const originals=new WeakMap();
let language='es',observer,syncQueued=false;
function translate(value){const trimmed=value.trim();return Object.prototype.hasOwnProperty.call(dictionary,trimmed)?value.replace(trimmed,dictionary[trimmed]):value}
function preferred(){
 try{const stored=localStorage.getItem(key);if(stored==='es'||stored==='en')return stored}catch(_){}
 const userLocale=(navigator.languages&&navigator.languages[0])||navigator.language||'';
 const primary=String(userLocale).toLowerCase().split('-')[0];
 return primary==='es'?'es':['en','de','fr','it','nl'].includes(primary)?'en':'es';
}
function refresh(){
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  if(!node.parentElement||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|SVG)$/i.test(node.parentElement.tagName)||node.parentElement.closest('svg'))continue;
  const current=node.nodeValue;
  let original=originals.get(node);
  if(!original||(current!==original.es&&current!==original.en)){
   original={es:current,en:translate(current)};originals.set(node,original);
  }
  const next=original[language];
  if(current!==next)node.nodeValue=next;
 }
 const title=document.querySelector('title');
 if(title)title.textContent=language==='en'?'Makeup in Higüey | By María Beauty & Store':'Maquillaje en Higüey | By María Beauty & Store';
 document.documentElement.lang=language;
 for(const btn of document.querySelectorAll('[data-lang]')){
  const active=btn.getAttribute('data-lang')===language;
  btn.setAttribute('aria-pressed',active?'true':'false');
  btn.classList.toggle('active',active);
 }
 for(const a of document.querySelectorAll('[data-whatsapp]')){
  a.setAttribute('aria-label',language==='en'?'Message María on WhatsApp (opens WhatsApp)':'Escribir a María por WhatsApp (abre WhatsApp)');
  // Keep the page-specific friendly WhatsApp request in the visitor's language.
  const message=language==='en'
    ?'Hello María! 💄 I would like to ask about prices and availability for makeup.'
    :'¡Hola, María! 💄 Me gustaría consultar los precios y la disponibilidad para un maquillaje.';
  a.href='https://wa.me/18293249535?text='+encodeURIComponent(message);
 }
}
function apply(next,save){
 language=next==='en'?'en':'es';
 if(save)try{localStorage.setItem(key,language)}catch(_){}
 refresh();
}
function init(){
 for(const btn of document.querySelectorAll('[data-lang]'))btn.addEventListener('click',()=>apply(btn.getAttribute('data-lang'),true));
 apply(preferred(),false);
 observer=new MutationObserver(()=>{if(syncQueued)return;syncQueued=true;queueMicrotask(()=>{syncQueued=false;refresh()})});
 observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

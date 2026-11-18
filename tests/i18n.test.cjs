const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const i18n=fs.readFileSync('i18n.js','utf8');
test('Both language buttons show real vector flags',()=>{
 assert.match(html,/data-lang="es"/);
 assert.match(html,/data-lang="en"/);
 assert.equal((html.match(/class="lang-flag"/g)||[]).length,2);
 assert.match(html,/src="\/i18n\.js"/);
 assert.match(html,/data-whatsapp/);
 assert.match(html,/cloud\.umami\.is\/script\.js/);
 new vm.Script(i18n);
});
test('Automatic browser locale, manual preference and WhatsApp language',()=>{
 function check(locale,stored,expected){
  const button=lang=>({lang,events:{},getAttribute(){return lang},setAttribute(k,v){this[k]=v},classList:{toggle(){}},addEventListener(ev,fn){this.events[ev]=fn}});
  const buttons=[button('es'),button('en')];
  const words=['Servicios de maquillaje','¿Lista para brillar?'].map(nodeValue=>({nodeValue,parentElement:{tagName:'H2',closest(){return null}}}));
  const links=[{attrs:{},setAttribute(k,v){this.attrs[k]=v},href:''}];
  const title={textContent:''};
  const doc={
   readyState:'complete',body:{},documentElement:{lang:'es'},
   querySelector(q){return q==='title'?title:null},
   querySelectorAll(q){return q==='[data-lang]'?buttons:q==='[data-whatsapp]'?links:[]},
   createTreeWalker(){let at=-1;return {currentNode:null,nextNode(){this.currentNode=words[++at];return !!this.currentNode}}}
  };
  const storage={stored,getItem(){return this.stored},setItem(k,v){this.stored=v}};
  class MutationObserver {observe(){}}
  const ctx={document:doc,navigator:{languages:locale?[locale]:[],language:locale||''},localStorage:storage,MutationObserver,NodeFilter:{SHOW_TEXT:4},queueMicrotask:fn=>fn(),encodeURIComponent};
  vm.runInNewContext(i18n,ctx);
  assert.equal(doc.documentElement.lang,expected);
  assert.equal(words[0].nodeValue,expected==='en'?'Makeup services':'Servicios de maquillaje');
  assert.ok(links[0].href.includes(expected==='en'?'Hello%20Mar%C3%ADa':'Hola%2C%20Mar%C3%ADa'));
  buttons[1].events.click();
  assert.equal(storage.stored,'en');
  assert.equal(words[1].nodeValue,'Ready to shine?');
  buttons[0].events.click();
  assert.equal(storage.stored,'es');
  assert.equal(words[1].nodeValue,'¿Lista para brillar?');
 }
 check('es-DO',null,'es');
 check('en-US',null,'en');
 check('de-DE',null,'en');
 check('pt-BR',null,'es');
 check('es-DO','en','en');
 check('en-US','es','es');
});

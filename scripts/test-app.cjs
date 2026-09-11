const fs=require('fs'),vm=require('vm'),assert=require('assert');
const events={},elements={},storage={};
const base=()=>({innerHTML:'',value:'',open:false,dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(type,fn){(this.listeners??={})[type]=fn},append(){},showModal(){this.open=true},close(){this.open=false}});
const audio={...base(),paused:true,currentTime:0,duration:80,volume:1,playbackRate:1,seeking:false,addEventListener(type,fn){(events[type]??=[]).push(fn)},play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true}};
elements.audio=audio;
const document={body:base(),documentElement:base(),getElementById:id=>elements[id]??=(base()),querySelectorAll:()=>[],createElement:base};
const ctx={document,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Date,setTimeout:()=>1,clearTimeout(){},window:{matchMedia:()=>({matches:false}),addEventListener(){},scrollTo(){}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);const run=x=>vm.runInContext(x,ctx);
assert.equal(run('journeyCount()'),0);assert.equal(run("isUnlocked('noah')"),true);assert.equal(run("isUnlocked('david')"),false);assert.equal(run('stories.length'),6);assert(run('content()').includes('O Jardim da Fé'));
run("startStory('david')");assert.equal(run('current.id'),'noah');assert.equal(audio.paused,true);
run("startStory('noah')");assert(elements.player.innerHTML.includes('sound-scape'));assert(elements.player.open);
function emit(t){for(const cb of events[t]||[])cb()}
audio.currentTime=77;emit('seeking');emit('timeupdate');assert.equal(run('journeyCount()'),0,'Seeking must not unlock');
audio.currentTime=0;emit('seeking');for(let i=1;i<=72;i++){audio.currentTime=i;emit('timeupdate')}
assert.equal(run('journeyCount()'),1);assert.equal(run("isUnlocked('david')"),true);assert.equal(run("isUnlocked('night')"),false);assert(run('journeyData.days[dateKey()]')>=72);assert(storage['sementinha-journey']);
for(let i=1;i<=72;i++){audio.currentTime=i;emit('seeking');emit('timeupdate')}
assert.equal(run('journeyCount()'),1,'Replaying completed stage cannot unlock twice');
run("page='library';filter='Coragem';query=''");assert(run('content()').includes('Pequeno pastor'));assert(!run('content()').includes('data-story="noah"'));
run("filter='Todas';query='ceu'");assert(run('content()').includes('Um céu de agradecimentos'));
run("page='journey';query='';monthOffset=-1");assert(run('calendar()').includes('calendar-grid'));
const themeToggle={...base(),dataset:{},hasAttribute:a=>a==='data-toggle-theme'};
document.documentElement.innerHTML='APP ROOT MUST SURVIVE';
document.querySelectorAll=selector=>selector==='[data-theme]'?[document.documentElement]:selector==='button[data-toggle-theme]'?[themeToggle]:[];
const appBefore=elements.app.innerHTML;
for(const expected of ['dark','light','dark']){
 elements.app.listeners.click({target:{closest:()=>themeToggle}});
 assert.equal(document.documentElement.dataset.theme,expected);
 assert.equal(JSON.parse(storage['sementinha-theme']),expected);
 assert.equal(document.documentElement.innerHTML,'APP ROOT MUST SURVIVE');
 assert.equal(elements.app.innerHTML,appBefore);
 assert(themeToggle.innerHTML.includes('<svg'));
}
console.log('PASS: six stages, unlock order, seek protection, completion, duplicate protection, listening days, persistence, search, category, calendar, theme, animated player.');

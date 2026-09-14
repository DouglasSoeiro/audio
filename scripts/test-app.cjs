const fs=require('fs'),vm=require('vm'),assert=require('assert');
const events={},elements={},storage={};
const base=()=>({innerHTML:'',value:'',open:false,dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(type,fn){((this.listeners??={})[type]??=[]).push(fn)},append(){},showModal(){this.open=true},close(){this.open=false}});
const audio={...base(),paused:true,currentTime:0,duration:80,volume:1,playbackRate:1,seeking:false,addEventListener(type,fn){(events[type]??=[]).push(fn)},play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true}};
elements.audio=audio;
const document={body:base(),documentElement:base(),getElementById:id=>elements[id]??=(base()),querySelector:()=>null,querySelectorAll:()=>[],createElement:base};
const ctx={document,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Date,setTimeout:()=>1,clearTimeout(){},window:{matchMedia:()=>({matches:false}),addEventListener(){},scrollTo(){}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);const run=x=>vm.runInContext(x,ctx);
assert.equal(run('journeyCount()'),0);assert.equal(run("isUnlocked('noah')"),true);assert.equal(run("isUnlocked('david')"),false);assert.equal(run('stories.length'),6);assert(run('content()').includes('Sua jornada com Deus'));
run("startStory('david')");assert.equal(run('current.id'),'david');assert.equal(audio.paused,false,'Any story must be playable outside the journey order');
audio.pause();run("startStory('noah')");assert.equal(run('current.id'),'noah');assert(elements.player.innerHTML.includes('np-stage'));assert(elements.player.open);assert.equal(audio.paused,false,'Play must work without an audio visualizer');
const skipButton=seconds=>({dataset:{skip:String(seconds)},hasAttribute:name=>name==='data-skip',closest:selector=>selector==='button'?skipButton.current:null});
for(const [start,seconds,expected] of [[30,15,45],[30,-15,15],[5,-15,0],[75,15,80]]){audio.duration=80;audio.currentTime=start;skipButton.current=skipButton(seconds);elements.app.listeners.click.forEach(fn=>fn({target:skipButton.current}));assert.equal(audio.currentTime,expected,`Skip ${seconds} must move playback and respect boundaries`)}
audio.duration=Infinity;audio.currentTime=10;run('skipAudio(15)');assert.equal(audio.currentTime,25,'Skip must work while duration metadata is not finite');audio.duration=80;
const seekInput={id:'',value:'50',hasAttribute:name=>name==='data-seek'};audio.currentTime=0;elements.app.listeners.input.forEach(fn=>fn({target:seekInput}));assert.equal(audio.currentTime,40,'Dragging the seek bar must move playback to the selected percentage');
function emit(t){for(const cb of events[t]||[])cb()}
audio.currentTime=77;emit('seeking');emit('timeupdate');assert.equal(run('journeyCount()'),0,'Seeking must not unlock');
audio.currentTime=0;emit('seeking');for(let i=1;i<=72;i++){audio.currentTime=i;emit('timeupdate')}
assert.equal(run('journeyCount()'),1);assert.equal(run("isUnlocked('david')"),true);assert.equal(run("isUnlocked('night')"),false);assert(run('journeyData.days[dateKey()]')>=72);assert(storage['sementinha-journey']);
for(let i=1;i<=72;i++){audio.currentTime=i;emit('seeking');emit('timeupdate')}
assert.equal(run('journeyCount()'),1,'Replaying completed stage cannot unlock twice');
run("page='library';filter='Coragem';query=''");assert(run('content()').includes('Pequeno pastor'));assert(!run('content()').includes('data-story="noah"'));
run("filter='Todas';query='ceu'");assert(run('content()').includes('Um céu de agradecimentos'));
run("page='journey';query='';monthOffset=-1");assert(run('calendar()').includes('jy-cal-grid'));
const themeToggle={...base(),dataset:{},hasAttribute:a=>a==='data-toggle-theme'};
document.documentElement.innerHTML='APP ROOT MUST SURVIVE';
document.querySelectorAll=selector=>selector==='[data-theme]'?[document.documentElement]:selector==='button[data-toggle-theme]'?[themeToggle]:[];
const appBefore=elements.app.innerHTML;
for(const expected of ['dark','light','dark']){
 elements.app.listeners.click.forEach(fn=>fn({target:{closest:()=>themeToggle}}));
 assert.equal(document.documentElement.dataset.theme,expected);
 assert.equal(JSON.parse(storage['sementinha-theme']),expected);
 assert.equal(document.documentElement.innerHTML,'APP ROOT MUST SURVIVE');
 assert.equal(elements.app.innerHTML,appBefore);
 assert(themeToggle.innerHTML.includes('<svg'));
}
console.log('PASS: free listening, ordered journey progress, player controls, 15-second skips, draggable seek bar, seek protection, completion, duplicate protection, listening days, persistence, search, category, calendar and theme.');

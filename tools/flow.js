const fs=require('fs'),vm=require('vm');const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const listeners={}; const app={innerHTML:'',addEventListener(){},querySelector(){return null},querySelectorAll(){return []}};
const win={console,Math,Date,JSON,Set,Map,Array,Object,Number,String,parseInt,parseFloat,isNaN,Infinity,NaN,Error,setTimeout,clearTimeout,URLSearchParams,
 document:{getElementById:id=>id==='app'?app:null,addEventListener(t,f){listeners[t]=f}},localStorage:{_:{},getItem(k){return this._[k]??null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}},
 location:{search:'',hash:'',href:''},navigator:{},performance:{now:()=>Date.now()},scrollTo(){}};
win.window=win; vm.createContext(win); scripts.forEach((s,i)=>vm.runInContext(s,win,{filename:'s'+i}));
const X=win.__bb, S=X.S;
function click(attr,val){ const re=new RegExp(attr+(val!=null?'="'+val+'"':'(=|[\\s>])')); if(!re.test(app.innerHTML)) throw new Error('no element '+attr+(val!=null?'='+val:'')+' in view');
  const el={dataset:{}}; const key=attr.replace(/^data-/,'').replace(/-([a-z])/g,(m,c)=>c.toUpperCase()); el.dataset[key]=val!=null?String(val):'';
  el.closest=sel=>{const m=sel.match(/^\[([^\]=]+)(?:="([^"]*)")?\]$/); return (m&&m[1]===attr&&(m[2]==null||m[2]===String(val)))?el:null;}; listeners.click({target:el}); }
const has=t=>app.innerHTML.includes(t); let fails=0; const ok=(c,m)=>{ if(!c){fails++;console.log('FAIL',m);} else console.log('ok  ',m); };
ok(S.tab==='build'&&has('data-chooser')&&has('73-9')&&!has('data-draft="daily"'),'start: Build a five, 73-9, no daily');
click('data-chooser'); click('data-draft','free'); if(!S.pack) click('data-lock'); ok(S.view==='draft'&&S.pack&&has('class="kboard"')&&has('class="dock"'),'draft: wheel landed, board + dock');
for(let i=0;i<5;i++){ if(!S.pack){ok(false,'no pack '+i);break;} const m=[...app.innerHTML.matchAll(/data-pick="([^"]+)" data-now="1"/g)].map(x=>[x[0],x[1],'']);
  if(!m.length){ if(has('data-reroll')){ click('data-reroll'); i--; continue; } ok(false,'no signable in pack '+i); break; }
  const pairs=m.map(x=>[x[1],'']).sort((a,b)=>X.E.P[b[0]].capPct-X.E.P[a[0]].capPct); if(S.picks.length>=2) pairs.reverse(); const [pid,slot]=pairs[0];
  const el={dataset:{pick:pid,slot}}; el.closest=sel=>sel==='[data-pick]'?el:null; listeners.click({target:el}); }
ok(S.view==='lineup'&&has('class="lineup"')&&has('data-play-season'),'five signed → line-up screen');
const before=S.lineup.slice(); click('data-lu',0); click('data-lu',1); ok(S.lineup[0]===before[1]&&S.lineup[1]===before[0],'tap two men to swap'); click('data-lu-best'); ok(S.lineup.join()===before.join(),'best line-up restores');
click('data-play-season'); ok(S.team&&S.team.length===5&&S.season&&S.tab==='season','season played: '+S.season.w+'-'+S.season.l);
ok(S.season.w+S.season.l===82&&S.season.games.length===82,'82 games');
ok(has('class="ladder"')&&has('Your five · season 1')&&has('of ')&&has('real seasons'),'ladder with your rank');
ok(has('Where the '+S.season.l+' losses came from'),'loss lessons header');
ok(has('data-share')&&has('data-draft="free"'),'build again + share');
ok(has('data-share'),'share button');
click('data-kinfo',S.team[0]); ok(has('class="ph"')&&!has('psfoot'),'player sheet from the five strip (no footer outside the draft)'); click('data-close');
click('data-tab','you'); ok(has('Best season')&&has('class="hist"')&&(app.innerHTML.match(/class="h /g)||[]).length>=1,'you: best + history');
click('data-tab','build'); ok(has('Your best')&&has(String(S.bestW)+'-'+String(S.bestL)),'build tab shows your best');
click('data-tab','you'); click('data-reset'); click('data-reset'); ok(!S.bestTeam&&S.seasons.length===0&&S.tab==='build','reset');
ok(!/NaN|undefined/.test(app.innerHTML),'no NaN/undefined');
console.log(fails?'FAILURES '+fails:'ALL PASS');

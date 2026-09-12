const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../src/app.js','utf8');const html=fs.readFileSync(__dirname+'/../index.html','utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const app={innerHTML:'',addEventListener(){}};const win={console,Math,Date,JSON,Set,Map,Array,Object,Number,String,parseInt,parseFloat,isNaN,Infinity,NaN,Error,setTimeout,clearTimeout,URLSearchParams,document:{getElementById:id=>id==='app'?app:null,addEventListener(){}},localStorage:{getItem(){return null},setItem(){},removeItem(){}},location:{search:''},navigator:{},performance:{now:()=>Date.now()},scrollTo(){}};win.window=win;vm.createContext(win);
const bundle=scripts.find(s=>s.includes('BEATBALL_V2=')), eng=scripts.find(s=>s.includes('makeEngine')&&!s.includes('__bb')); vm.runInContext(bundle,win); vm.runInContext(eng,win); vm.runInContext(src,win);
const r=vm.runInContext(`(function(){
 // a good human: uses the best-five search on the packs he was dealt (= what the coach block shows), so this is the CEILING for a given rule set
 function run(cfg){ const rng=mulberry32(cfg.seed||7); const W=[]; const oldCap=CAP; const oldOOP=OOP.slice();
   OOP[1]=cfg.oop[0]; OOP[2]=cfg.oop[1];
   for(let i=0;i<cfg.n;i++){ const pool=cfg.minW?PACK_TEAMS.filter(t=>t.record.w>=cfg.minW):PACK_TEAMS; const teams=shuffle(pool,rng).slice(0,cfg.packs); let packs=teams.map(t=>({team:t,players:t.players.map(id=>E.P[id]).filter(p=>p&&p.capPct!=null)}));
     // choose best cfg.packs→5: try dropping each extra pack if packs>5
     let best=null; const combos=[]; (function rec(st,acc){ if(acc.length===5){combos.push(acc);return;} for(let j=st;j<packs.length;j++) rec(j+1,acc.concat([packs[j]])); })(0,[]);
     for(const c of combos){ const b=(function(){ const save=CAP; globalThis.__cap=cfg.cap; const res=bestFromPacksCap(c,cfg.cap); return res; })(); if(b&&(!best||b.net>best.net)) best=b; }
     if(!best) continue; const sn=playSeason(best.five,i*13+1); W.push(sn.w); }
   OOP[1]=oldOOP[1]; OOP[2]=oldOOP[2];
   W.sort((a,b)=>a-b); const avg=W.reduce((a,b)=>a+b,0)/W.length; return {n:W.length,avg:avg.toFixed(1),p50:W[W.length>>1],p90:W[Math.floor(W.length*.9)],max:W[W.length-1],ge60:W.filter(x=>x>=60).length,ge70:W.filter(x=>x>=70).length}; }
 // bestFromPacks with an explicit cap
 function bestFromPacksCap(packs,cap){ const legal=f=>{const used={}; for(const p of f){const sl=p.eligible.find(x=>!used[x]); if(!sl) return false; used[sl]=p;} return f.reduce((a,p)=>a+price(p),0)<=cap;};
   const arrange=f=>{const used={}; for(const p of f){used[p.eligible.find(x=>!used[x])]=p;} return SLOTS.map(sl=>used[sl]);};
   const cands=packs.map(pk=>pk.players.filter(p=>p.capPct!=null)); let five=[];
   for(const c of cands){ let bp=null,bv=-1e9; for(const p of c){ const f=five.concat([p]); if(!legal(f)) continue; const g=f.slice(); while(g.length<5) g.push(g[g.length-1]); const v=E.rate(g).net; if(v>bv){bv=v;bp=p;} } if(bp) five.push(bp); }
   if(five.length<5) return null; let cur=five,cv=fiveNet(arrange(cur)),imp=true,g=0;
   while(imp&&g++<30){ imp=false; for(let i=0;i<5;i++) for(const p of cands[i]){ if(p.id===cur[i].id) continue; const f=cur.slice(); f[i]=p; if(!legal(f)) continue; const v=fiveNet(arrange(f)); if(v>cv+1e-6){cur=f;cv=v;imp=true;} } }
   return {five:arrange(cur),net:cv}; }
 const out={};
 for(const cfg of [
   {k:'now',cap:100,packs:5,oop:[.5,1]},
   {k:'7 packs pick 5',cap:100,packs:7,oop:[.5,1]},
   {k:'clubs ≥45 wins',cap:100,packs:5,oop:[.5,1],minW:45},
   {k:'clubs ≥50 wins',cap:100,packs:5,oop:[.5,1],minW:50},
   {k:'≥45 wins + 7 packs',cap:100,packs:7,oop:[.5,1],minW:45},
   {k:'≥50 wins + 7 packs',cap:100,packs:7,oop:[.5,1],minW:50},
   {k:'≥50 wins + 7 packs + $80M',cap:80,packs:7,oop:[.5,1],minW:50}]){ cfg.n=30; out[cfg.k]=run(cfg); }
 return out; })()`,win);
for(const [k,v] of Object.entries(r)) console.log(k.padEnd(34),JSON.stringify(v));

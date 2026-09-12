const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../src/app.js','utf8');const html=fs.readFileSync(__dirname+'/../index.html','utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const app={innerHTML:'',addEventListener(){}};const win={console,Math,Date,JSON,Set,Map,Array,Object,Number,String,parseInt,parseFloat,isNaN,Infinity,NaN,Error,setTimeout,clearTimeout,URLSearchParams,document:{getElementById:id=>id==='app'?app:null,addEventListener(){}},localStorage:{_:{},getItem(k){return this._[k]??null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}},location:{search:''},navigator:{},performance:{now:()=>Date.now()},scrollTo(){}};win.window=win;vm.createContext(win);
const bundle=scripts.find(s=>s.includes('BEATBALL_V2=')), eng=scripts.find(s=>s.includes('makeEngine')&&!s.includes('__bb')); vm.runInContext(bundle,win); vm.runInContext(eng,win); vm.runInContext(src,win);
const N=+process.argv[2]||40;
const r=vm.runInContext(`(function(N){ const rec={pts:[],greedy:[]}; const rng=mulberry32(99);
 for(const st of ['pts','greedy']) for(let i=0;i<N;i++){ const packs=makePacks(rng); const picks=[]; const slots={};
  for(const pk of packs){ const c=pk.players.filter(p=>{const sl=p.eligible.find(x=>!slots[x]); if(!sl) return false; if(picks.some(q=>q.id===p.id)) return false; return picks.reduce((a,q)=>a+price(q),0)+price(p)+(4-picks.length)<=CAP;}); if(!c.length) continue;
    let pick; if(st==='pts') pick=c.slice().sort((a,b)=>pg(b,'pts')-pg(a,'pts'))[0]; else { let best=-1e9; for(const p of c){ const f=picks.concat([p]); while(f.length<5) f.push(f[f.length-1]); const v=E.rate(f).net; if(v>best){best=v;pick=p;} } }
    const sl=pick.eligible.find(x=>!slots[x]); slots[sl]=pick; picks.push(pick); }
  if(picks.length<5) continue; const five=['PG','SG','SF','PF','C'].map(sl=>slots[sl]); const sn=playSeason(five,i*7+1); rec[st].push([sn.w,sn.net]); }
 return Object.fromEntries(Object.entries(rec).map(([k,v])=>[k,{n:v.length,avgW:(v.reduce((a,b)=>a+b[0],0)/v.length).toFixed(1),avgNet:(v.reduce((a,b)=>a+b[1],0)/v.length).toFixed(1),max:Math.max(...v.map(x=>x[0])),min:Math.min(...v.map(x=>x[0])),ge60:v.filter(x=>x[0]>=60).length,ge70:v.filter(x=>x[0]>=70).length}])); })(${N})`,win);
console.log(JSON.stringify(r,null,1));

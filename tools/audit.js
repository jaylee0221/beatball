const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../src/app.js','utf8');const html=fs.readFileSync(__dirname+'/../index.html','utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const app={innerHTML:'',addEventListener(){}};const win={console,Math,Date,JSON,Set,Map,Array,Object,Number,String,parseInt,parseFloat,isNaN,Infinity,NaN,Error,setTimeout,clearTimeout,URLSearchParams,document:{getElementById:id=>id==='app'?app:null,addEventListener(){}},localStorage:{getItem(){return null},setItem(){},removeItem(){}},location:{search:''},navigator:{},performance:{now:()=>Date.now()},scrollTo(){}};win.window=win;vm.createContext(win);
const bundle=scripts.find(s=>s.includes('BEATBALL_V2=')), eng=scripts.find(s=>s.includes('makeEngine')&&!s.includes('__bb')); vm.runInContext(bundle,win); vm.runInContext(eng,win); vm.runInContext(src,win);
console.log(vm.runInContext(`(function(){
  // expected wins for EVERY real five vs the field (no position penalty: real fives are at their natural spots by construction)
  const exp=f=>{ let e=0; for(let i=0;i<200;i++){ const x=FIELD[(i*4463)%FIELD.length]; e+=gameProb(E.series(f,x.five,i%2?1:-1).p); } return 82*e/200; };
  const rows=FIELD.map(x=>({id:x.id,team:x.t.team,season:x.t.season,real:x.t.record.w*82/(x.t.record.w+x.t.record.l),exp:exp(x.five),net:E.rate(x.five).net,usg:x.five.reduce((a,p)=>a+adv(p,'usg'),0)*100}));
  const n=rows.length, mx=rows.reduce((a,r)=>a+r.exp,0)/n, my=rows.reduce((a,r)=>a+r.real,0)/n;
  let sxy=0,sxx=0,syy=0; rows.forEach(r=>{sxy+=(r.exp-mx)*(r.real-my);sxx+=(r.exp-mx)**2;syy+=(r.real-my)**2;});
  const corr=sxy/Math.sqrt(sxx*syy), slope=sxy/sxx, mae=rows.reduce((a,r)=>a+Math.abs(r.exp-r.real),0)/n;
  const sd=Math.sqrt(rows.reduce((a,r)=>a+(r.exp-mx)**2,0)/n), sdr=Math.sqrt(syy/n);
  const top=rows.slice().sort((a,b)=>b.real-a.real).slice(0,12).map(r=>r.team.split(' ').slice(-1)[0]+" '"+r.season.slice(2,4)+' real '+Math.round(r.real)+' → sim '+Math.round(r.exp)+' (net '+r.net.toFixed(1)+', usg '+Math.round(r.usg)+')');
  const simtop=rows.slice().sort((a,b)=>b.exp-a.exp).slice(0,6).map(r=>r.team.split(' ').slice(-1)[0]+" '"+r.season.slice(2,4)+' sim '+Math.round(r.exp)+' real '+Math.round(r.real));
  // usage tax magnitude: how much net does the tax remove, for fives over 100?
  const taxed=rows.filter(r=>r.usg>100); const loss=taxed.map(r=>{ const f=FIELD_BY_ID[r.id].five; const t=E.tax(f); return t.reduce((a,v)=>a+(1-v),0); });
  const avgTaxCut=loss.reduce((a,b)=>a+b,0)/loss.length;
  return JSON.stringify({n,corr:corr.toFixed(3),slope:slope.toFixed(2),mae:mae.toFixed(1),sdSim:sd.toFixed(1),sdReal:sdr.toFixed(1),simRange:[Math.round(Math.min(...rows.map(r=>r.exp))),Math.round(Math.max(...rows.map(r=>r.exp)))],usgOver100:taxed.length+'/'+n,avgUsageCutSum:avgTaxCut.toFixed(2)},null,1)+'\\nREAL TOP:\\n'+top.join('\\n')+'\\nSIM TOP:\\n'+simtop.join('\\n'); })()`,win));

const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../src/app.js','utf8');const html=fs.readFileSync(__dirname+'/../index.html','utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const app={innerHTML:'',addEventListener(){}};const win={console,Math,Date,JSON,Set,Map,Array,Object,Number,String,parseInt,parseFloat,isNaN,Infinity,NaN,Error,setTimeout,clearTimeout,URLSearchParams,document:{getElementById:id=>id==='app'?app:null,addEventListener(){}},localStorage:{getItem(){return null},setItem(){},removeItem(){}},location:{search:''},navigator:{},performance:{now:()=>Date.now()},scrollTo(){}};win.window=win;vm.createContext(win);
const bundle=scripts.find(s=>s.includes('BEATBALL_V2=')), eng=scripts.find(s=>s.includes('makeEngine')&&!s.includes('__bb')); vm.runInContext(bundle,win); vm.runInContext(eng,win); vm.runInContext(src,win);
console.log(vm.runInContext(`(function(){
  const sig=x=>1/(1+Math.exp(-x));
  const rows=FIELD.map(x=>({net:E.rate(x.five).net,wp:x.t.record.w/(x.t.record.w+x.t.record.l),gp:x.t.record.w+x.t.record.l,t:x.t,five:x.five}));
  const mean=a=>a.reduce((x,y)=>x+y,0)/a.length; const mnet=mean(rows.map(r=>r.net));
  // fit win% = sig(k*(net-mnet)+b) by grid search on least squares
  let best=null; for(let k=.05;k<=.6;k+=.005) for(let b=-.3;b<=.3;b+=.02){ let e=0; for(const r of rows){ const p=sig(k*(r.net-mnet)+b); e+=(p-r.wp)**2; } if(!best||e<best.e) best={k,b,e}; }
  const k=best.k,b=best.b;
  // check: expected wins with the new game model vs the field (opponent net drawn from the field, home ±h)
  const h=0.42; // ≈ 60% home win rate in the NBA → logit(.60)=0.405
  const expW=f=>{ const nf=E.rate(f).net; let e=0; for(let i=0;i<300;i++){ const x=FIELD[(i*4463)%FIELD.length]; e+=sig(k*(nf-E.rate(x.five).net)+(i%2?h:-h)); } return 82*e/300; };
  const out=rows.map(r=>({t:r.t,real:r.wp*82,exp:expW(r.five)}));
  const mx=mean(out.map(o=>o.exp)), my=mean(out.map(o=>o.real)); let sxy=0,sxx=0,syy=0; out.forEach(o=>{sxy+=(o.exp-mx)*(o.real-my);sxx+=(o.exp-mx)**2;syy+=(o.real-my)**2;});
  const top=out.slice().sort((a,b)=>b.real-a.real).slice(0,10).map(o=>o.t.team.split(' ').slice(-1)[0]+" '"+o.t.season.slice(2,4)+' real '+Math.round(o.real)+' → sim '+Math.round(o.exp));
  // usage tax magnitude on a few stacked fives: net with tax vs. if the tax were switched off
  const notax=f=>{ const T=E.tax; const saved=E.tax; return null; };
  return JSON.stringify({k:k.toFixed(3),b:b.toFixed(2),corr:(sxy/Math.sqrt(sxx*syy)).toFixed(3),slope:(sxy/sxx).toFixed(2),sdSim:Math.sqrt(sxx/out.length).toFixed(1),sdReal:Math.sqrt(syy/out.length).toFixed(1),mae:(out.reduce((a,o)=>a+Math.abs(o.exp-o.real),0)/out.length).toFixed(1),range:[Math.round(Math.min(...out.map(o=>o.exp))),Math.round(Math.max(...out.map(o=>o.exp)))]})+'\\n'+top.join('\\n'); })()`,win));

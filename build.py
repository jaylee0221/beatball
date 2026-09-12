TRAP='<script>'+'window.onerror=function(m,s,l,c){var a=document.getElementById("app");if(a)a.innerHTML="<pre style=\'padding:20px;color:#FF5A1F;font:12px/1.5 monospace;white-space:pre-wrap\'>"+m+" @ "+l+":"+c+"</pre>";}'+'</script>'
import os,sys; os.chdir(os.path.dirname(os.path.abspath(__file__)))
flame=open('src/flame.txt').read()
css=open('src/fonts.css').read()+open('src/style.css').read().replace('var(--flame)',f'url({flame})'); assert sum((c=='{')-(c=='}') for c in css)==0, 'CSS braces unbalanced'; app=open('src/app.js').read(); eng=open('src/engine.js').read().split("if(typeof module!=='undefined')")[0]; import json as _json
_raw=open('data/bundle-lite.json').read()
bundle='const BEATBALL_V2=JSON.parse('+_json.dumps(_raw)+');'
html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Fantasyball</title><meta name="theme-color" content="#0E1013">
<!-- fonts are embedded below: Barlow Condensed (display) + Barlow (body), OFL -->
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Fantasyball"><meta name="mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="{flame}"><link rel="icon" href="{flame}">
<link rel="manifest" href="data:application/manifest+json,{{&quot;name&quot;:&quot;Fantasyball&quot;,&quot;short_name&quot;:&quot;Fantasyball&quot;,&quot;display&quot;:&quot;standalone&quot;,&quot;background_color&quot;:&quot;%230E1013&quot;,&quot;theme_color&quot;:&quot;%230E1013&quot;,&quot;start_url&quot;:&quot;.&quot;}}">
<style>{css}</style></head><body><div id="app"><div style="padding:40px 20px;font:500 14px/1.5 -apple-system,Archivo,sans-serif;color:#8A9099">Loading Fantasyball…</div></div><pre id="bootlog" hidden></pre><script>window.__t0=Date.now();window.__log=function(m){{var b=document.getElementById("bootlog");if(b)b.textContent+="\\n"+m+" · "+(Date.now()-window.__t0)+"ms";}};window.__stage="html";window.addEventListener("error",function(e){{var a=document.getElementById("app");var d=(e.error&&e.error.stack)?e.error.stack:(e.message+" @ "+e.filename+":"+e.lineno+":"+e.colno);if(a)a.innerHTML='<pre style="padding:20px;color:#FF5A1F;font:12px/1.5 monospace;white-space:pre-wrap">stage: '+window.__stage+'\\n'+d+'</pre>';}});window.__log("boot 1 · scripts start");</script>
<script>window.__stage="data";</script><script>{bundle}</script><script>window.__stage="engine";</script><script>window.__log("boot 2 · data parsed, "+BEATBALL_V2.players.length+" men");</script><script>window.__log('boot 2 · data parsed, '+BEATBALL_V2.players.length+' men');</script>
<script>{eng}</script><script>window.__stage="app";</script><script>window.__log("boot 3 · engine loaded");</script><script>window.__log('boot 3 · engine loaded');</script>
{TRAP}
<script>try{{{app}
window.__bb={{S,E,FIELD,TIERS,tagOf,cardHTML,startDraft,startRun,playRound,render,slotFor,pick,makeEngine}}; window.__log('boot 4 · app rendered'); setTimeout(function(){{var b=document.getElementById('bootlog'); if(b) b.remove();}},4000);
}}catch(e){{document.getElementById('app').innerHTML='<pre style="padding:20px;color:#FF5A1F;font:12px/1.5 monospace;white-space:pre-wrap">'+(e&&e.stack||e)+'</pre>';}}</script>
</body></html>'''
open('index.html','w').write(html)

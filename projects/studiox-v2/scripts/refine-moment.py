"""Rebuild the full-frame chart close-up after build_visuals.py. Deterministic geometry."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
points = [(-240,860),(-40,790),(150,838),(360,675),(550,770),(740,690),(930,805),(1120,590),(1310,650),(1500,490),(1690,585),(1880,470),(2070,540),(2280,410)]
d = 'M ' + ' L '.join(f'{x},{y}' for x,y in points)
grid = ''.join(f'<line x1="{x}" y1="410" x2="{x}" y2="1180"/>' for x in range(-240,2401,160)) + ''.join(f'<line x1="-240" y1="{y}" x2="2400" y2="{y}"/>' for y in range(460,1181,120))
html = r'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>sx2-moment</title></head><body><template id="sx2-moment-template"><style>
@font-face{font-family:ViewportDisplay;src:url('assets/Display.ttf') format('truetype');font-weight:700;font-display:block}
@font-face{font-family:ViewportSerif;src:url('assets/Serif.ttf') format('truetype');font-weight:400;font-display:block}
@font-face{font-family:ViewportMono;src:url('assets/Mono.ttf') format('truetype');font-weight:400;font-display:block}
#sx2-moment-root{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#F2EEE5;color:#071424}
#sx2-moment-root *{box-sizing:border-box}
#sx2-moment-root .stage{position:absolute;inset:0;overflow:hidden;color:#071424;font-family:ViewportDisplay,sans-serif}
#sx2-moment-root .chapter{position:absolute;left:100px;top:74px;font-family:ViewportMono,monospace;font-size:23px;letter-spacing:.1em}
#sx2-moment-root .scene-no{position:absolute;right:96px;top:74px;font-family:ViewportMono,monospace;font-size:22px;color:#52677F}
#sx2-moment-root .hairline{position:absolute;left:100px;right:100px;top:119px;height:1px;background:#07142433}
#sx2-moment-title{position:absolute;left:100px;top:176px;z-index:3;font-size:104px;line-height:1.06;letter-spacing:-.055em;font-weight:700;margin:0;white-space:nowrap}
#sx2-moment-title .mask{overflow:hidden;padding:8px 0 14px}
#sx2-moment-title .word{display:inline-block}
#sx2-moment-title .serif{font-family:ViewportSerif,serif;font-weight:400;font-size:118px;color:#165DFF}
#sx2-moment-chart{position:absolute;inset:0;width:100%;height:100%;overflow:hidden}
#sx2-moment-note{position:absolute;left:104px;bottom:43px;font-family:ViewportMono,monospace;font-size:18px;letter-spacing:.045em;color:#52677F;background:#F2EEE5;padding:8px 12px 8px 0}
#sx2-moment-focus{position:absolute;right:101px;top:279px;font-family:ViewportMono,monospace;font-size:20px;letter-spacing:.1em;line-height:1.7;color:#52677F;text-align:right}
</style><div id="sx2-moment-root" data-composition-id="sx2-moment" data-width="1920" data-height="1080" data-duration="4.5"><div class="stage">
<svg id="sx2-moment-chart" viewBox="0 0 1920 1080" aria-label="Illustrative market line with a crosshair following the plotted line">
<defs><clipPath id="sx2-moment-chart-crop"><rect x="0" y="410" width="1920" height="670"/></clipPath><linearGradient id="sx2-moment-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#165DFF" stop-opacity=".12"/><stop offset="1" stop-color="#165DFF" stop-opacity="0"/></linearGradient></defs>
<g clip-path="url(#sx2-moment-chart-crop)"><g id="sx2-moment-world">
<g stroke="#071424" stroke-opacity=".085" stroke-width="1">__GRID__</g>
<path d="__PATH__ L2280,1180 L-240,1180Z" fill="url(#sx2-moment-fill)"/>
<path id="sx2-moment-line" class="price-path" d="__PATH__" fill="none" stroke="#165DFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<g id="sx2-moment-cursor"><line x1="-2600" y1="0" x2="2600" y2="0" stroke="#165DFF" stroke-opacity=".42" stroke-width="1.3" stroke-dasharray="5 8"/><line x1="0" y1="-1000" x2="0" y2="1000" stroke="#165DFF" stroke-opacity=".42" stroke-width="1.3" stroke-dasharray="5 8"/><circle id="sx2-moment-halo" r="30" fill="#165DFF" fill-opacity=".1"/><circle r="10" fill="#F2EEE5" stroke="#165DFF" stroke-width="4"/><circle r="3" fill="#165DFF"/></g>
</g></g></svg>
<div class="chapter">03 / FOCUS ON WHAT MOVES</div><div class="scene-no">04 — 07</div><div class="hairline"></div>
<h2 id="sx2-moment-title"><div class="mask"><span class="word">Stay in</span></div><div class="mask"><span class="word serif">the moment.</span></div></h2>
<div id="sx2-moment-focus">LESS NOISE.<br>A CLOSER LOOK.</div>
<div id="sx2-moment-note">ILLUSTRATIVE CHART · NOT LIVE DATA</div>
</div></div><script>(()=>{
const tl=gsap.timeline({paused:true});
const E=(s,a,b,t)=>tl.fromTo(s,a,{...b,immediateRender:false},t);
E('#sx2-moment-title .word',{y:145},{y:0,duration:.62,stagger:.12,ease:'power4.out'},.05);
E('#sx2-moment-focus',{opacity:0,y:10},{opacity:1,y:0,duration:.5,ease:'power2.out'},.45);
E('#sx2-moment-world',{x:65,y:20,scale:1.01},{x:-95,y:-15,scale:1.08,svgOrigin:'1080 760',duration:3.6,ease:'sine.inOut'},.1);
const route=__ROUTE__;
tl.set('#sx2-moment-cursor',{x:route[0][0],y:route[0][1]},0);
E('#sx2-moment-cursor',{opacity:0},{opacity:1,duration:.3,ease:'power2.out'},.35);
// Straight segments share exactly the path's vertices. A common parent applies camera motion.
route.slice(1).forEach((p,i)=>tl.to('#sx2-moment-cursor',{x:p[0],y:p[1],duration:.47,ease:'none'},.55+i*.47));
E('#sx2-moment-halo',{scale:.65,opacity:.45},{scale:1.25,opacity:1,duration:.6,transformOrigin:'center',ease:'sine.inOut'},3.25);
window.__timelines=window.__timelines||{};window.__timelines['sx2-moment']=tl;
})();</script></template></body></html>'''
html=html.replace('__GRID__',grid).replace('__PATH__',d).replace('__ROUTE__',json.dumps(points[4:11]))
(ROOT/'compositions'/'sx2-moment.html').write_text(html)
print('Updated compositions/sx2-moment.html')

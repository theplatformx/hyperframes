/* Every visible state is a deterministic function of the Hyperframes-seeked GSAP timeline. */
(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const $ = (s) => document.querySelector(s);
  const make = (tag, attributes, parent) => {
    const n = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attributes)) n.setAttribute(key, value);
    parent.appendChild(n);
    return n;
  };
  const grid1 = $('#grid1');
  for (let x = 110; x <= 1810; x += 100) make('line', { x1:x, x2:x, y1:145, y2:914 }, grid1);
  for (let y = 200; y <= 900; y += 100) make('line', { x1:110, x2:1810, y1:y, y2:y }, grid1);

  const points = Array.from({length:65}, (_,i) => {
    const x = 90 + i*27;
    const y = 642 - i*3.35 + 68*Math.sin(i*.49) + 30*Math.cos(i*.21) + 13*Math.sin(i*1.8);
    return [x,Math.round(y)];
  });
  const path = (p) => p.map(([x,y],i) => `${i?'L':'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  $('#price').setAttribute('d',path(points));
  const priceLength = $('#price').getTotalLength();
  $('#price').style.strokeDasharray = `${priceLength}`;
  $('#price').style.strokeDashoffset = `${priceLength}`;

  const candles = [];
  for (let i=0;i<43;i++) {
    const a = points[Math.min(i*1+5,60)], x = 220+i*31.5;
    const span = 19+14*(1+Math.sin(i*1.7));
    const top = a[1] - span/2, down = i%5===1 || i%7===3;
    const wick = make('line',{x1:x+7,x2:x+7,y1:top-21,y2:top+span+24,stroke:down?'#ff695d':'#5de5e1'},$('#candles'));
    const body = make('rect',{x,y:top,width:14,height:span,rx:1,class:down?'down':''},$('#candles'));
    candles.push(wick,body);
  }

  const graphShape = (mode) => Array.from({length:72},(_,i) => {
    const x = 24+i*23.7;
    const y = mode===0 ? 376-i*2.3+64*Math.sin(i*.38)+16*Math.cos(i*1.2)
      : mode===1 ? 355-i*1.25+103*Math.sin(i*.21)+33*Math.cos(i*.57)
      : 401-i*3.2+69*Math.sin(i*.13)+65*Math.cos(i*.37);
    return [x,Math.max(64,Math.min(542,y))];
  });
  const shapes = [0,1,2].map((m)=>path(graphShape(m)));
  $('#graphPath').setAttribute('d',shapes[0]);
  $('#graphFill').setAttribute('d',`${shapes[0]} L 1706 589 L 24 589 Z`);
  const graphLength = $('#graphPath').getTotalLength();
  $('#graphPath').style.strokeDasharray = `${graphLength*2}`;
  $('#graphPath').style.strokeDashoffset = `${graphLength*2}`;

  for(let i=0;i<3;i++) {
    const p = Array.from({length:25},(_,j)=>[12+j*19,330-j*5+67*Math.sin(j*(.37+i*.14))+28*Math.cos(j*(.77+i*.23))]);
    const el = $(`#panel${i+1}`); el.setAttribute('d',path(p));
    const length=el.getTotalLength(); el.style.strokeDasharray=`${length}`; el.style.strokeDashoffset=`${length}`;
  }
  for(let i=0;i<14;i++) {
    const line=document.createElement('i');line.style.top=`${156+i*53}px`;line.style.width=`${250+(i*97)%550}px`;
    $('#speed').appendChild(line);
  }

  const tl=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});
  tl.set('#act2',{opacity:0},0).set('#act3',{opacity:0},0)
    .set('#tf1',{backgroundColor:'#5de5e1',color:'#071629'},0)
    .set('#surface',{opacity:0,y:68,scale:.92},0).set('#see',{opacity:0,y:70},0)
    .set('#hook .kicker',{opacity:0},0).set('#market',{opacity:0,y:180},0).set('#wait',{opacity:0,y:180},0)
    .set('#chartWorld',{scale:1.52,x:-245,y:96},0).set('#candles',{opacity:0},0)
    .set('#cross1, #cross2, #trend',{opacity:0},0).set('#cursor',{opacity:0},0)
    .set('#wipe1',{scale:0,opacity:0},0)
    .set('#graphPath',{strokeDashoffset:graphLength*2},0).set('#scan',{opacity:0,x:0},0)
    .set('#panels',{opacity:0},0).set('#merge',{scaleX:0,opacity:0},0)
    .set('#wipe2',{scale:0,opacity:0},0)
    .set('#great, #ideas, #should, #move, #faster',{opacity:0},0)
    .set('#endcard',{clipPath:'inset(100% 0 0 0)'},0)
    .set('#brand,#tag,#studio,#foot',{opacity:0},0);

  // 0–10: the signal draws a chart, becomes a cursor, and marks a cause on that chart.
  tl.fromTo('#hook .kicker',{opacity:0},{opacity:1,duration:.45},.08)
    .fromTo('#market',{opacity:0,y:180},{opacity:1,y:0,duration:.62,ease:'power4.out'},.40)
    .fromTo('#wait',{opacity:0,y:180},{opacity:1,y:0,duration:.55,ease:'power4.out'},1.04)
    .to('#price',{strokeDashoffset:0,duration:3.55,ease:'power1.inOut'},.12)
    .fromTo('#signal',{x:82,y:635},{x:598,y:654,duration:1.08,ease:'power1.inOut'},.16)
    .to('#signal',{x:1085,y:410,duration:1.08,ease:'power1.inOut'},1.24)
    .to('#signal',{x:1772,y:405,duration:1.22,ease:'power1.inOut'},2.32)
    .to('#hook',{opacity:0,y:-95,duration:.54,ease:'power2.in'},2.07)
    .to('#chartWorld',{scale:1,x:0,y:0,duration:1.35,ease:'power3.out'},2.35)
    .to('#candles',{opacity:1,duration:.23},2.55)
    .fromTo(candles,{scaleY:0,transformOrigin:'50% 100%'},{scaleY:1,duration:.45,stagger:.035,ease:'power3.out'},2.49)
    .to('#signal',{opacity:0,duration:.25},3.60)
    .to('#surface',{opacity:1,y:0,scale:1,duration:.72,ease:'power3.out'},3.85)
    .to('#cross1, #cross2',{opacity:.68,duration:.24},4.35)
    .fromTo('#cursor',{opacity:0,x:260,y:850},{opacity:1,x:449,y:693,duration:.78,ease:'power2.inOut'},4.28)
    .to('#cursor',{x:1170,y:450,duration:1.70,ease:'power1.inOut'},5.13)
    .to('#cross1',{attr:{y1:452,y2:452},duration:1.64,ease:'power1.inOut'},5.13)
    .to('#cross2',{attr:{x1:1170,x2:1170},duration:1.64,ease:'power1.inOut'},5.13)
    .to('#trend',{opacity:1,strokeDashoffset:0,duration:1.68,ease:'power1.inOut'},5.15)
    .fromTo('#see',{opacity:0,y:72},{opacity:1,y:0,duration:.60},6.82)
    .to('#cursor',{scale:.62,x:1330,y:355,duration:.52,ease:'power2.in'},7.76)
    .to('#chartWorld',{scale:2.4,x:-1130,y:390,duration:1.38,ease:'power2.inOut'},8.14)
    .to('#surface',{opacity:0,duration:.28,ease:'power2.in'},8.50)
    .to('#see',{opacity:0,x:-205,duration:.42,ease:'power2.in'},8.54)
    .to('#wipe1',{opacity:1,scale:31,duration:.61,ease:'power3.in'},9.39);

  // 10–20: one chart changes its time basis; three perspectives converge into one stroke.
  tl.set('#act2',{opacity:1},10).set('#act1',{opacity:0},10.12)
    .fromTo('#viewTitle',{opacity:0,y:65},{opacity:1,y:0,duration:.58},10.15)
    .fromTo('#act2 .kicker',{opacity:0},{opacity:1,duration:.55},10.18)
    .to('#wipe1',{opacity:0,duration:.12},10.10)
    .to('#graphPath',{strokeDashoffset:0,duration:2.15,ease:'power1.inOut'},10.30)
    .fromTo('#scan',{opacity:0,x:78},{opacity:1,x:832,duration:1.93,ease:'power1.inOut'},10.42)
    .to('#scan',{x:1420,duration:1.42,ease:'power1.inOut'},12.35)
    .to('#tf1',{backgroundColor:'#112b42',color:'#9db4c1',duration:.15},12.86)
    .to('#tf2',{backgroundColor:'#5de5e1',color:'#071629',duration:.15},12.86)
    .to('#graphPath',{attr:{d:shapes[1]},duration:1.2,ease:'power2.inOut'},12.85)
    .to('#graphFill',{attr:{d:`${shapes[1]} L 1706 589 L 24 589 Z`},duration:1.2,ease:'power2.inOut'},12.85)
    .to('#tf2',{backgroundColor:'#112b42',color:'#9db4c1',duration:.15},14.50)
    .to('#tf3',{backgroundColor:'#5de5e1',color:'#071629',duration:.15},14.50)
    .to('#graphPath',{attr:{d:shapes[2]},duration:1.2,ease:'power2.inOut'},14.50)
    .to('#graphFill',{attr:{d:`${shapes[2]} L 1706 589 L 24 589 Z`},duration:1.2,ease:'power2.inOut'},14.50)
    .to('#graph',{scale:1.08,x:-66,duration:.65,ease:'power2.inOut'},15.5)
    .to('#viewTitle',{opacity:0,y:-75,duration:.36,ease:'power2.in'},16.15)
    .to('#graph,#timeframes,#viewFoot,#dataFoot',{opacity:0,duration:.28},16.34)
    .fromTo('#panels',{opacity:0},{opacity:1,duration:.22},16.55)
    .fromTo('.panel',{scale:.25,y:420,rotationY:35,opacity:0},{scale:1,y:0,rotationY:0,opacity:1,duration:.80,stagger:.13,ease:'power3.out'},16.57)
    .to('#panel1,#panel2,#panel3',{strokeDashoffset:0,duration:1.55,stagger:.15,ease:'power1.inOut'},16.80)
    .to('.panel',{x:(i)=>[595,0,-595][i],scale:.08,rotationY:0,duration:.63,ease:'power2.inOut'},18.66)
    .to('#panels',{opacity:0,duration:.10},19.27)
    .to('#merge',{opacity:1,scaleX:1,duration:.52,ease:'power2.inOut'},19.10)
    .to('#wipe2',{opacity:1,scale:32,duration:.52,ease:'power3.in'},19.48);

  // 20–30: typography physically collides with the travelling line, then gives the brand a hold.
  tl.set('#act3',{opacity:1},20).set('#act2',{opacity:0},20.12)
    .to('#wipe2',{opacity:0,duration:.12},20.10)
    .fromTo('#great',{opacity:0,x:-560},{opacity:1,x:0,duration:.56,ease:'power4.out'},20.18)
    .fromTo('#ideas',{opacity:0,x:680},{opacity:1,x:0,duration:.62,ease:'power4.out'},21.08)
    .to('#seam',{scaleX:.84,x:146,duration:.82,ease:'power2.inOut'},21.55)
    .to('#great,#ideas',{opacity:0,x:-650,duration:.42,ease:'power3.in'},22.60)
    .fromTo('#should',{opacity:0,y:-175},{opacity:1,y:0,duration:.51,ease:'power4.out'},22.95)
    .fromTo('#move',{opacity:0,x:470},{opacity:1,x:0,duration:.49,ease:'power4.out'},23.68)
    .fromTo('#speed i',{opacity:0,x:750},{opacity:.32,x:-1150,duration:.93,stagger:.025,ease:'power2.in'},24.06)
    .to('#should,#move',{opacity:0,x:-410,duration:.42,ease:'power3.in'},24.65)
    .fromTo('#faster',{opacity:0,scale:1.52,x:510,filter:'blur(12px)'},{opacity:1,scale:1,x:0,filter:'blur(0px)',duration:.64,ease:'power4.out'},25.04)
    .to('#seam',{scaleX:1,x:0,duration:.50},25.23)
    .to('#faster',{opacity:0,scale:.96,duration:.37,ease:'power2.in'},26.60)
    .to('#act3 .kicker',{opacity:0,duration:.20},26.77)
    .to('#endcard',{clipPath:'inset(0% 0 0 0)',duration:.53,ease:'power3.inOut'},26.93)
    .fromTo('#brand',{opacity:0,y:120},{opacity:1,y:0,duration:.55},27.40)
    .fromTo('#tag',{opacity:0,y:35},{opacity:1,y:0,duration:.52},27.84)
    .to('#creditline',{width:1640,duration:.68,ease:'power2.inOut'},28.05)
    .fromTo('#studio,#foot',{opacity:0,y:25},{opacity:1,y:0,duration:.40,stagger:.14},28.40);

  window.__timelines=window.__timelines||{};
  window.__timelines['studiox-v3']=tl;
})();

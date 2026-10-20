from pathlib import Path
p=Path('gallog.html');s=p.read_text(encoding='utf8')
a=s.index('// 함선 실루엣:');b=s.index('// Shared 24px paths',a)
s=s[:a]+'''// Circular survey craft: independent concentric armor, iris core and rim thrusters.
let shipCacheKey='', shipImg=null, shipNoz=[], shipTips=[], shipGlow=null;
const SHIP_LV=[1,4,7,10,14,18,23,29];
function shipTier(lv){let t=0;for(let i=0;i<SHIP_LV.length;i++)if(lv>=SHIP_LV[i])t=i;return t;}
function buildShip(r,tier,gold){
  const C=Math.ceil(r*1.32+6),c=mkCv(C*2,C*2),g=c.getContext('2d'),R=r*(.88+tier*.009);
  g.translate(C,C);g.lineCap='round';
  const shell=gold?'#ddc689':'#8bbfce',light=gold?'#fff0ba':'#cceef5',shade=gold?'#8e7035':'#3e7487',
        core=gold?'#ffe08a':UNIT_ART.cyan[Math.min(tier,7)],dark=gold?'#211c18':'#101e2c';
  function circle(rad,fill,stroke,width=1){g.beginPath();g.arc(0,0,rad,0,Math.PI*2);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}}
  // A continuous white perimeter makes the round silhouette unmistakably friendly.
  circle(R,shell,'#fff',Math.max(1.3,r*.075));
  g.strokeStyle=shade;g.lineWidth=r*.12;g.beginPath();g.arc(0,0,R*.86,.18,Math.PI*1.93);g.stroke();
  g.strokeStyle=light;g.lineWidth=r*.09;g.beginPath();g.arc(0,0,R*.84,-Math.PI*.86,-Math.PI*.15);g.stroke();
  const panels=tier>=6?10:tier>=2?6:0;
  if(panels){g.strokeStyle=shade;g.lineWidth=Math.max(.7,r*.035);g.beginPath();for(let i=0;i<panels;i++){const a=i*Math.PI*2/panels+.25;g.moveTo(Math.cos(a)*R*.68,Math.sin(a)*R*.68);g.lineTo(Math.cos(a)*R*.93,Math.sin(a)*R*.93);}g.stroke();}
  // Dark central aperture and stepped metal rings, kept simple at the smallest tier.
  circle(R*.63,shade,light,Math.max(.7,r*.025));
  circle(R*.55,dark,core,Math.max(.8,r*.035));
  if(tier>=3){g.strokeStyle=shade;g.lineWidth=Math.max(.7,r*.025);g.beginPath();g.arc(0,0,R*.44,0,Math.PI*2);g.stroke();g.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;g.moveTo(Math.cos(a)*R*.28,Math.sin(a)*R*.28);g.lineTo(Math.cos(a+.25)*R*.45,Math.sin(a+.25)*R*.45);}g.stroke();}
  circle(R*(tier>=7?.27:.22),shade,light,Math.max(.8,r*.03));
  circle(R*.12,core);
  // A dark crescent at the front is the canopy; the bright rim arc indicates heading.
  g.strokeStyle=dark;g.lineWidth=Math.max(2,r*.15);g.beginPath();g.arc(0,0,R*.73,-.34,.34);g.stroke();
  g.strokeStyle=light;g.lineWidth=Math.max(.8,r*.045);g.beginPath();g.arc(0,0,R*.97,-.27,.27);g.stroke();
  const nn=tier<1?1:tier<4?2:tier<6?3:4,nz=[];
  for(let i=0;i<nn;i++){const a=Math.PI+(i-(nn-1)/2)*.25,x=Math.cos(a)*R*.87,y=Math.sin(a)*R*.87;
    nz.push({x,y,s:1/Math.sqrt(nn)});g.save();g.translate(x,y);g.rotate(a);g.fillStyle=dark;g.fillRect(-r*.04,-r*.045,r*.13,r*.09);g.fillStyle=core;g.fillRect(r*.02,-r*.026,r*.07,r*.052);g.restore();}
  if(tier>=4){g.strokeStyle=core;g.lineWidth=Math.max(1,r*.055);for(const a of [Math.PI*.4,Math.PI,Math.PI*1.6]){g.beginPath();g.arc(0,0,R*.91,a-.15,a+.15);g.stroke();}}
  const tips=[];if(tier>=5)tips.push({x:0,y:-R*.9,c:'#ff7889'},{x:0,y:R*.9,c:'#7affbe'});
  c.c=C;shipImg=c;shipNoz=nz;shipTips=tips;
  // Cache engine glow too: no per-frame gradients, including the four-nozzle tier.
  const glow=mkCv(48,48),gg=glow.getContext('2d'),gr=gg.createRadialGradient(24,24,0,24,24,24);
  gr.addColorStop(0,hexA(core,.8));gr.addColorStop(.35,hexA(core,.28));gr.addColorStop(1,hexA(core,0));gg.fillStyle=gr;gg.fillRect(0,0,48,48);shipGlow=glow;
}
function drawShip(x,y,r,tier,ang,col,ecol,thrusting){
  const gold=col!=='#5ce1ff',key=r.toFixed(1)+'_'+tier+'_'+Number(gold);
  if(shipCacheKey!==key){shipCacheKey=key;buildShip(r,tier,gold);}
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  for(const n of shipNoz){const er=r*(thrusting?.43:.26)*(.55+.45*n.s);ctx.drawImage(shipGlow,n.x-er,n.y-er,er*2,er*2);}
  ctx.drawImage(shipImg,-shipImg.c,-shipImg.c);
  if(tier>=7){ctx.strokeStyle=gold?'#fff0bc':'#bafaff';ctx.lineWidth=Math.max(.8,r*.035);ctx.globalAlpha=.5+.25*Math.sin(time*4);ctx.beginPath();ctx.arc(0,0,r*.35,time*.7,time*.7+Math.PI*1.2);ctx.stroke();ctx.globalAlpha=1;}
  if(shipTips.length){ctx.globalAlpha=.35+.65*Math.abs(Math.sin(time*3));for(const t of shipTips){ctx.fillStyle=t.c;ctx.beginPath();ctx.arc(t.x,t.y,Math.max(1.1,r*.055),0,Math.PI*2);ctx.fill();}}
  ctx.restore();
}
''' +s[b:]
p.write_text(s,encoding='utf8')

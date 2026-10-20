from pathlib import Path
p=Path('gallog.html');s=p.read_text(encoding='utf-8')
a=s.index('  spread:{');b=s.index('  nova:{',a)
s=s[:a]+s[a:b].replace("emitWeaponFx('muzzle'","emitWeaponFx('scatter'")+s[b:]
s=s.replace("kind==='jet'?.42:.10","kind==='jet'?.42:kind==='scatter'?.22:.10")
a=s.index("  else if(f.kind==='jet'){")
s=s[:a]+"""  else if(f.kind==='scatter'){
    ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.ang);
    const color=f.evo?'#8cffe1':'#ffd184',n=f.evo?14:7;
    ctx.globalAlpha=(1-k)*.85;ctx.strokeStyle=color;ctx.lineWidth=2;
    for(let i=0;i<n;i++){const a=f.evo?i/n*6.283:(i/(n-1)-.5)*.85;
      const near=18+k*15,far=near+12*(1-k);
      ctx.beginPath();ctx.moveTo(Math.cos(a)*near,Math.sin(a)*near);ctx.lineTo(Math.cos(a)*far,Math.sin(a)*far);ctx.stroke();}
    ctx.globalAlpha=(1-k)*.4;ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(0,0,22+k*31,f.evo?0:-.48,f.evo?6.283:.48);ctx.stroke();
    ctx.restore();ctx.beginPath();
  }
""" +s[a:]
a=s.index('function pelletSprite(evo)');b=s.index('function drawArrow',a)
s=s[:a]+"""function pelletSprite(evo){
  if(pelletCache.has(evo))return pelletCache.get(evo);
  const c=mkCv(64,24),g=c.getContext('2d');g.translate(40,12);
  const bright=evo?'#c8fff0':'#fff0bf',edge=evo?'#52d8bc':'#e9a64c';
  // Baked tapered wake and faceted shell; no per-projectile blur.
  g.fillStyle=evo?'rgba(76,232,197,.16)':'rgba(255,186,76,.16)';
  g.beginPath();g.moveTo(-38,0);g.lineTo(-8,-5);g.lineTo(8,0);g.lineTo(-8,5);g.closePath();g.fill();
  g.strokeStyle=edge;g.globalAlpha=.55;g.lineWidth=1;g.beginPath();g.moveTo(-29,0);g.lineTo(-9,0);g.stroke();g.globalAlpha=1;
  g.fillStyle=edge;g.beginPath();g.moveTo(-9,-3);g.lineTo(4,-3);g.lineTo(10,0);g.lineTo(4,3);g.lineTo(-9,3);g.closePath();g.fill();
  g.fillStyle=bright;g.beginPath();g.moveTo(-8,-2);g.lineTo(4,-2);g.lineTo(9,0);g.lineTo(-8,0);g.closePath();g.fill();
  g.fillStyle='#fffdf0';g.fillRect(-5,-2,9,1);g.fillStyle=evo?'#167c70':'#9a5c22';g.fillRect(-9,-3,2,6);
  if(evo){g.strokeStyle=bright;g.lineWidth=1;g.beginPath();g.moveTo(1,-6);g.lineTo(1,6);g.moveTo(-3,0);g.lineTo(6,0);g.stroke();}
  pelletCache.set(evo,c);return c;
}
function drawPellet(b){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.drawImage(pelletSprite(!!player.evolved.spread),-40,-12);ctx.restore();}
""" +s[b:]
p.write_text(s,encoding='utf-8')

from pathlib import Path
p=Path('gallog.html')
s=p.read_text(encoding='utf-8')
a=s.index('  // Three pre-baked irregular tongues')
b=s.index('  flameFrames[frame]=c;',a)
s=s[:a]+"""  // Opaque, layered fire tongues keep the burning area readable.
  for(let band=0;band<3;band++){g.save();g.scale([1,.72,.40][band],[1,.72,.40][band]);const w=Math.sin(frame*2)*5;g.fillStyle=['#e94b19','#ffad26','#fff4b0'][band];g.beginPath();g.moveTo(-40,18);g.quadraticCurveTo(-55,-6,-34,-20);g.quadraticCurveTo(-25,-16,-26+w,-42);g.quadraticCurveTo(-8,-30,-9-w,-54);g.quadraticCurveTo(12,-40,15,-20);g.quadraticCurveTo(23,-32,33+w,-36);g.quadraticCurveTo(36,-10,49,6);g.quadraticCurveTo(35,42,0,49);g.quadraticCurveTo(-32,38,-40,18);g.closePath();g.fill();g.restore();}
""" +s[b:]
s=s.replace("kind==='jet'?.16","kind==='jet'?.42")
a=s.index("  else if(f.kind==='jet'){")
b=s.index("\n  else if(f.kind==='blast')",a)
s=s[:a]+"""  else if(f.kind==='jet'){
    ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.ang);ctx.globalAlpha=Math.min(1,f.life/.10);
    ctx.fillStyle='#354456';ctx.strokeStyle='#a5b9c9';ctx.lineWidth=1.5;ctx.fillRect(12,-6,17,12);ctx.strokeRect(12,-6,17,12);
    ctx.fillStyle='#18212d';ctx.fillRect(26,-7,6,14);
    const pulse=Math.sin(k*24)*3;
    for(let band=0;band<3;band++){ctx.fillStyle=['#ee4e18','#ffb52c','#fff8cf'][band];ctx.beginPath();
      const w=[15,10,4][band],tip=[92,80,61][band];
      ctx.moveTo(31,-3);ctx.quadraticCurveTo(49,-w,65,-w-pulse);ctx.lineTo(tip-13,-w*.5);ctx.lineTo(tip+4+pulse,0);ctx.lineTo(tip-8,w*.6);ctx.quadraticCurveTo(57,w+3,31,3);ctx.closePath();ctx.fill();}
    ctx.fillStyle='#ffe79b';for(let i=0;i<4;i++){const x=57+i*11+k*12,y=Math.sin(i*3+k*18)*(9+i*2);ctx.fillRect(x,y,2,2);}
    ctx.restore();ctx.beginPath();
  }""" +s[b:]
s=s.replace("ctx.globalAlpha=Math.max(0,f.life/f.max)*.65;ctx.translate(f.x,f.y);ctx.rotate((f.x+f.y)*.01);","ctx.globalAlpha=Math.min(1,f.life/.45)*.86;ctx.translate(f.x,f.y);")
p.write_text(s,encoding='utf-8')

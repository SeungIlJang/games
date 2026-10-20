from pathlib import Path
p=Path('gallog.html');s=p.read_text(encoding='utf-8')
a=s.index('  // 참격 찌릿찌릿 —');b=s.index('  // Three physical swords;',a)
s=s[:a]+"""  // Sweeping, tapered blade crescents communicate the radial melee hit.
  for(const fx of player.slashFx)drawSlash(fx);
"""+s[b:]
a=s.index('function drawCombatBanner(){')
s=s[:a]+"""function drawSlash(s){
  const k=Math.min(1,s.t/s.max),fade=Math.min(1,(1-k)*2.2),r=s.r;
  ctx.save();ctx.translate(player.x,player.y);ctx.rotate(s.ang0+k*1.15);
  const count=s.evo?4:3,span=s.evo?1.55:1.65,edge=s.evo?'#a3ffe1':'#9beaff';
  function crescent(radius,width,start,alpha,color){
    ctx.globalAlpha=fade*alpha;ctx.fillStyle=color;ctx.beginPath();
    for(let j=0;j<=24;j++){const u=j/24,a=start+u*span;const rr=radius;const x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    for(let j=24;j>=0;j--){const u=j/24,a=start+u*span,rr=radius-width*Math.sin(Math.PI*u);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
    ctx.closePath();ctx.fill();
  }
  for(let i=0;i<count;i++){
    const start=i*6.283/count;
    crescent(r*.98,r*(s.evo?.21:.15),start,.20,edge);
    crescent(r*.96,r*(s.evo?.12:.09),start+.08,.92,edge);
    crescent(r*.96,r*.027,start+.08,1,'#f1ffff');
    crescent(r*.82,r*.025,start-.20,.42,edge);
    ctx.strokeStyle=edge;ctx.lineWidth=s.evo?2:1.4;ctx.globalAlpha=fade*.8;
    for(let q=0;q<3;q++){const a=start+span-.13+q*.12,rr=r*(.90+q*.035);
      ctx.beginPath();ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);ctx.lineTo(Math.cos(a+.12+q*.025)*rr,Math.sin(a+.12+q*.025)*rr);ctx.stroke();}
    const tip=start+span+.08;ctx.fillStyle='#fff8d7';ctx.globalAlpha=fade;
    ctx.save();ctx.translate(Math.cos(tip)*r*.96,Math.sin(tip)*r*.96);ctx.rotate(tip);
    ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(0,-7);ctx.lineTo(2,0);ctx.lineTo(0,7);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
}
"""+s[a:];p.write_text(s,encoding='utf-8')

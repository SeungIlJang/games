from pathlib import Path
p=Path('gallog.html');s=p.read_text(encoding='utf8')
helper='''// Straight-edged swords with separate steel blade, crossguard and wrapped grip.
const swordSprites=new Map();
function swordSprite(r,evo){
  const key=r+'_'+Number(evo);if(swordSprites.has(key))return swordSprites.get(key);
  const pad=5,half=Math.ceil(r*.15+pad),c=mkCv(Math.ceil(r+pad*2),half*2),g=c.getContext('2d');
  g.translate(pad,half);g.scale(r,r);g.lineJoin='round';
  const steel=evo?'#c8ffe7':'#dcecf5',shade=evo?'#6bbfa2':'#7ca5bc',edge='#f7ffff',metal=evo?'#ffe7a4':'#dac28c',w=evo?.050:.043;
  const blade=new Path2D();blade.moveTo(.43,-w);blade.lineTo(.77,-w);blade.lineTo(.91,0);blade.lineTo(.77,w);blade.lineTo(.43,w);blade.closePath();
  g.fillStyle=steel;g.fill(blade);g.strokeStyle='#38586c';g.lineWidth=.018;g.stroke(blade);
  g.fillStyle=shade;g.beginPath();g.moveTo(.43,0);g.lineTo(.91,0);g.lineTo(.77,w);g.lineTo(.43,w);g.closePath();g.fill();
  g.strokeStyle=edge;g.lineWidth=.013;g.beginPath();g.moveTo(.46,-w*.58);g.lineTo(.77,-w*.58);g.lineTo(.88,0);g.stroke();
  // Dark handle and bright bindings remain visible when the blade overlaps effects.
  g.fillStyle='#1b283c';g.fillRect(.25,-.026,.17,.052);g.strokeStyle=metal;g.lineWidth=.012;g.beginPath();
  for(let i=0;i<3;i++){const x=.28+i*.04;g.moveTo(x,-.026);g.lineTo(x+.025,.026);}g.stroke();
  g.fillStyle=metal;g.strokeStyle='#56647b';g.lineWidth=.012;
  g.beginPath();g.moveTo(.405,-.12);g.lineTo(.445,-.12);g.lineTo(.455,-.075);g.lineTo(.455,.075);g.lineTo(.445,.12);g.lineTo(.405,.12);g.lineTo(.405,.075);g.lineTo(.415,0);g.lineTo(.405,-.075);g.closePath();g.fill();g.stroke();
  g.fillStyle=metal;g.beginPath();g.arc(.245,0,.037,0,Math.PI*2);g.fill();
  if(evo){g.fillStyle='#a8ffe1';g.beginPath();g.moveTo(.425,-.027);g.lineTo(.45,0);g.lineTo(.425,.027);g.lineTo(.40,0);g.closePath();g.fill();}
  c.pad=pad;c.half=half;swordSprites.set(key,c);return c;
}
function drawSword(bl){const fade=Math.max(0,bl.life/bl.max),sprite=swordSprite(bl.r,!!bl.evo);ctx.save();ctx.translate(player.x,player.y);ctx.rotate(bl.ang);
  ctx.globalAlpha=fade*.16;ctx.strokeStyle=bl.evo?'#a7ffdc':'#d8f4ff';ctx.lineWidth=bl.evo?2:1.2;ctx.beginPath();ctx.arc(0,0,bl.r*.85,-(bl.evo?.24:.12),0);ctx.stroke();
  ctx.globalAlpha=Math.min(1,fade*1.7);ctx.drawImage(sprite,-sprite.pad,-sprite.half);ctx.restore();
}
'''
s=s.replace('function render(){',helper+'function render(){',1)
a=s.index('  // 삼도류 검기(크레센트 슬래시)');b=s.index('  ctx.globalAlpha=1;\n  // bullets',a)
s=s[:a]+'  // Three physical swords; simulation and hit arcs are unchanged.\n  for(const bl of player.blades)drawSword(bl);\n'+s[b:]
p.write_text(s,encoding='utf8')

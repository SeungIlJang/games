from pathlib import Path
p=Path('gallog.html');s=p.read_text(encoding='utf-8')
a=s.index('  // 배너\n');b=s.index('  // joystick',a)
s=s[:a]+"  // Responsive combat announcement panel.\n  if(bannerT>0)drawCombatBanner();\n"+s[b:]
a=s.index('function render(){')
helper="""function drawCombatBanner(){
  const boss=/^[⬢👑]/u.test(banner),gold=banner.includes('👑')||banner===t('bnWin');
  const stageNotice=banner.startsWith('STAGE')||banner.startsWith(t('bnStage'));
  const color=gold?'#ffd47b':boss?'#ff88b2':stageNotice?'#78deff':'#bca7ff';
  const title=banner.replace(/^[⬢👑⚡🌟🏆]\\s*/u,'').trim();
  const label=boss?'HOSTILE DETECTED':gold?'MISSION COMPLETE':stageNotice?'STAGE UPDATE':'SYSTEM NOTICE';
  const width=Math.min(440,W-32),inner=width-62,fontSize=W<400?22:26;
  ctx.save();ctx.globalAlpha=Math.min(1,bannerT/.25);ctx.font=fTech(fontSize,true);
  // Character wrapping also handles Korean and Japanese without spaces.
  const lines=[];let line='';
  for(const ch of title){if(ctx.measureText(line+ch).width>inner&&line){lines.push(line);line=ch;}else line+=ch;}if(line)lines.push(line);
  const height=56+lines.length*(fontSize+6),x=(W-width)/2,y=Math.max(146,H*.25);
  ctx.translate(0,Math.max(0,.25-bannerT)*-8);
  ctx.fillStyle='rgba(5,12,25,.94)';ctx.strokeStyle=color;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x+12,y);ctx.lineTo(x+width,y);ctx.lineTo(x+width,y+height-12);ctx.lineTo(x+width-12,y+height);ctx.lineTo(x,y+height);ctx.lineTo(x,y+12);ctx.closePath();ctx.fill();ctx.globalAlpha*=.65;ctx.stroke();ctx.globalAlpha=Math.min(1,bannerT/.25);
  ctx.fillStyle=color;ctx.fillRect(x+15,y+18,3,height-36);
  ctx.font=fTech(10,true);ctx.textAlign='left';ctx.fillStyle=color;
  ctx.fillText(label,x+31,y+24);
  ctx.strokeStyle='rgba(185,213,242,.18)';ctx.beginPath();ctx.moveTo(x+31,y+33);ctx.lineTo(x+width-20,y+33);ctx.stroke();
  ctx.font=fTech(fontSize,true);ctx.fillStyle='#f3f7ff';ctx.textBaseline='middle';
  lines.forEach((text,i)=>ctx.fillText(text,x+31,y+53+i*(fontSize+6)));
  ctx.fillStyle=color;ctx.fillRect(x+width-22,y+15,6,3);ctx.restore();
}
"""
s=s[:a]+helper+s[a:];p.write_text(s,encoding='utf-8')

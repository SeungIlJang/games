const fs=require('fs'),path=require('path');
const file=path.join(__dirname,'baedal.html');let h=fs.readFileSync(file,'utf8');
if(h.includes('BAEDAL_ART_V1'))throw Error('Art already installed');
h=h.replace('<title>모두의 배달</title>','<title>모두의 배달</title>\n<link rel="icon" href="assets/baedal/icon-a-192.png"/>');
h=h.replace('</style>',`.brand-art{width:88px;height:88px;border-radius:24px;object-fit:cover}.up .ic img{width:46px;height:46px;display:block}.result-art{width:120px;height:120px;object-fit:contain}#over{gap:8px}#onboard{position:fixed;inset:0;z-index:30;background:#0e1626;display:flex;align-items:center;justify-content:center;padding:20px}#onboard .card{width:min(100%,420px);text-align:center}#onboard img{width:100%;max-height:42dvh;object-fit:contain;border-radius:20px}#onboard h2{color:#ffd34d;font-size:24px;margin:16px 0 10px}#onboard p{color:#bccde0;line-height:1.7;min-height:54px}#onboard .actions{display:flex;gap:10px;justify-content:center}#onboard .step{color:#7f98ba;font-size:13px;margin:14px}@media(max-height:650px){.brand-art{width:60px;height:60px}#start{gap:8px}#start h1{font-size:30px}.result-art{width:85px;height:85px}#changelog{display:none}}\n</style>`);
h=h.replace('<h1>🛵 모두의 배달</h1>','<img class="brand-art" src="assets/baedal/icon-a-192.png" alt="빨간 스쿠터 배달 라이더"/><h1>모두의 배달</h1>');
h=h.replace('같은 색 음식점에서 픽업 → 그 집에 배달!','같은 번호 음식점에서 픽업 → 그 집에 배달!').replace('이 <b>색깔 짝</b>','이 <b>색깔·번호 짝</b>');
h=h.replace("const $=id=>document.getElementById(id);",`const $=id=>document.getElementById(id);
// BAEDAL_ART_V1 — original canvas drawings remain as loading/error fallback.
const art={};
for(const [name,count] of Object.entries({shops:8,homes:8,badges:3,scooter:8,upgrades:4,stamps:3,district:6,exhaust:4,sparkles:4})){
 art[name]=Array.from({length:count},(_,i)=>{const im=new Image();im.src='assets/baedal/'+name+'-'+(name==='district'?i+1:i)+'.png';return im;});
}
function artDraw(name,index,x,y,w,h){const im=art[name]?.[index];if(!im?.complete||!im.naturalWidth)return false;ctx.drawImage(im,x,y,w,h||w);return true;}
function artNode(n,num,done,picked){const group=n.type==='shop'?'shops':'homes',im=art[group][n.pair];if(!im.complete||!im.naturalWidth)return false;
 ctx.save();if(done)ctx.globalAlpha=.45;ctx.fillStyle=PAIRCOL[n.pair]+'28';ctx.beginPath();ctx.arc(n.x,n.y,24,0,Math.PI*2);ctx.fill();artDraw(group,n.pair,n.x-25,n.y-26,50,50);
 ctx.globalAlpha=1;ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#0e1626';roundRect(n.x-22,n.y+25,44,14,6);ctx.fill();ctx.fillStyle=PAIRCOL[n.pair];ctx.fillText((n.type==='shop'?'픽업 ':'배달 ')+(n.pair+1),n.x,n.y+32);
 const status=done?2:(n.type==='home'?(picked?1:0):-1);if(status>=0)artDraw('badges',status,n.x+9,n.y+6,20,20);
 if(num>0)badge(n.x+18,n.y-22,num);ctx.restore();return true;
}`);
h=h.replace('function drawShop(n,num,done){','function drawShop(n,num,done){ if(artNode(n,num,done,false))return;');
h=h.replace('function drawHome(n,num,done,picked){','function drawHome(n,num,done,picked){ if(artNode(n,num,done,picked))return;');
h=h.replace('ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);',`ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
 const di=daily?dailyKey%6:Math.floor((stage-1)/3)%6;ctx.save();ctx.globalAlpha=.24;
 const tile=art.district[di];if(tile.complete&&tile.naturalWidth){const pattern=ctx.createPattern(tile,'repeat');if(pattern){ctx.fillStyle=pattern;ctx.fillRect(0,0,W,H);}}ctx.restore();`);
h=h.replace("b.x<scoot.x?-1:1, 1.15", "Math.atan2(b.y-scoot.y,b.x-scoot.x), 1.15");
h=h.replace('drawScooter(start.x, start.y-5, 1, 1.0)','drawScooter(start.x, start.y-5, Math.PI/2, 1.0)');
h=h.replace('function drawScooter(x,y,dir,sc){',`function drawScooter(x,y,dir,sc){
 const heading=((Math.round((dir+Math.PI/2)/(Math.PI/4))%8)+8)%8;
 if(art.scooter[heading].complete&&art.scooter[heading].naturalWidth){
  if(state==='run'){const frame=Math.floor(performance.now()/110)%4;artDraw('exhaust',frame,x-Math.cos(dir)*24-12,y-Math.sin(dir)*24-12,24);}
  artDraw('scooter',heading,x-28*(sc||1),y-31*(sc||1),56*(sc||1));return;
 }
`);
h=h.replace("function showOver(){ const s=state;",`function showOver(){ const stamp=state==='fail'?2:(lastStars===3?0:1);$('resultArt').src='assets/baedal/stamps-'+stamp+'.png';$('resultArt').alt=['완벽 배달 별 세 개','따끈한 배달 별 두 개','차갑게 식은 배달'][stamp]; const s=state;`);
h=h.replace('<div id="stars">','<img id="resultArt" class="result-art" alt="배달 결과"/><div id="stars">');
h=h.replace("'<div class=\"ic\">'+u.ic+'</div><div><div class=\"nm\">'",`'<div class="ic"><img src="assets/baedal/upgrades-'+UPGRADES.indexOf(u)+'.png" alt=""/></div><div><div class="nm">'`);
h=h.replace('function dropFx(p,fresh){','function dropFx(p,fresh){ deliveryBursts.push({x:p.x,y:p.y,t:performance.now()});');
h=h.replace('let parts=[], scoot=null, runSpeed=1;','let parts=[], scoot=null, runSpeed=1; let deliveryBursts=[];');
h=h.replace('  drawStart();',`  deliveryBursts=deliveryBursts.filter(b=>performance.now()-b.t<480);for(const b of deliveryBursts){const frame=Math.min(3,Math.floor((performance.now()-b.t)/120));artDraw('sparkles',frame,b.x-30,b.y-30,60);}
  drawStart();`);
const onboarding=`
// Illustrated first-run guide; starts only after an explicit user choice.
const guideCopy=[['음식점 먼저, 집은 다음','같은 번호의 음식점과 집이 한 쌍이에요. 음식점을 먼저 누르고 집을 눌러요.'],['짧고 깔끔한 길을 만들어요','꼬이는 길은 음식이 식기 쉬워요. 초록 경로처럼 짧게 연결해 보세요.'],['따끈하게 배달하고 성장해요','출발을 누르면 라이더가 달려요. 별과 코인을 모아 장비를 업그레이드하세요.']];
function openGuide(after){let step=0;const overlay=document.createElement('div');overlay.id='onboard';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','배달 안내');overlay.innerHTML='<div class="card"><img id="guideImg" alt=""/><div class="step" id="guideStep"></div><h2 id="guideTitle"></h2><p id="guideDesc"></p><div class="actions"><button class="btn d sm" id="guideSkip">건너뛰기</button><button class="btn d sm" id="guideBack">이전</button><button class="btn g sm" id="guideNext">다음 →</button></div></div>';document.body.appendChild(overlay);
 const close=()=>{LS.set('baedal_art_guide','1');overlay.remove();if(after)after();else $('howtoBtn').focus();};
 function paint(){$('guideImg').src='assets/baedal/onboarding-'+(step+1)+'.png';$('guideImg').alt=guideCopy[step][1];$('guideStep').textContent=(step+1)+' / 3';$('guideTitle').textContent=guideCopy[step][0];$('guideDesc').textContent=guideCopy[step][1];$('guideBack').disabled=step===0;$('guideNext').textContent=step===2?'배달 시작!':'다음 →';}
 $('guideSkip').onclick=close;$('guideBack').onclick=()=>{step=Math.max(0,step-1);paint();};$('guideNext').onclick=()=>{if(step===2)close();else{step++;paint();}};paint();$('guideNext').focus();
}
const startWithArt=$('startBtn').onclick;$('startBtn').onclick=()=>{if(LS.get('baedal_art_guide','0')!=='1')openGuide(startWithArt);else startWithArt();};
$('howtoBtn').onclick=()=>openGuide();
`;
h=h.replace('renderRec(); renderWallet(); resize(); requestAnimationFrame(loop);',onboarding+'\nrenderRec(); renderWallet(); resize(); requestAnimationFrame(loop);');
fs.writeFileSync(file,h);console.log('Applied art to baedal.html');

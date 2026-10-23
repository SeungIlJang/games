const fs=require('fs'),path=require('path');
const src=__dirname,app='D:/AI/workspace/game/baedal-app',archive='D:/AI/workspace/game/images/baedal-v1';
const stamp='art-v1';const backup=path.join(app,'backups',stamp);fs.mkdirSync(backup,{recursive:true});
for(const name of ['index.html','package.json','manifest.webmanifest','sw.js']){const p=path.join(app,name);if(fs.existsSync(p)&&!fs.existsSync(path.join(backup,name)))fs.copyFileSync(p,path.join(backup,name));}
const artSrc=path.join(src,'assets/baedal'),artDest=path.join(app,'assets/baedal');fs.mkdirSync(artDest,{recursive:true});fs.mkdirSync(archive,{recursive:true});
for(const name of fs.readdirSync(artSrc)){if(name==='originals'){fs.cpSync(path.join(artSrc,name),archive,{recursive:true});continue;}if(!name.endsWith('.png'))continue;fs.copyFileSync(path.join(artSrc,name),path.join(artDest,name));}
fs.copyFileSync(path.join(src,'baedal.html'),path.join(app,'index.html'));
let h=fs.readFileSync(path.join(app,'index.html'),'utf8').replace('<link rel="icon"','<link rel="manifest" href="manifest.webmanifest"/><meta name="theme-color" content="#0e1626"/><link rel="apple-touch-icon" href="assets/baedal/icon-a-192.png"/><link rel="icon"');
h=h.replace('</body>',"<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});</script></body>");fs.writeFileSync(path.join(app,'index.html'),h);
const manifest={name:'모두의 배달',short_name:'모두의 배달',description:'음식점에서 픽업하고 짧은 경로로 따끈하게 배달하는 퍼즐 게임',start_url:'./',scope:'./',display:'standalone',orientation:'portrait',background_color:'#0e1626',theme_color:'#0e1626',icons:[192,512].map(n=>({src:`assets/baedal/icon-a-${n}.png`,sizes:`${n}x${n}`,type:'image/png',purpose:'any'}))};fs.writeFileSync(path.join(app,'manifest.webmanifest'),JSON.stringify(manifest,null,2));
const assets=fs.readdirSync(artDest).filter(n=>n.endsWith('.png')&&!n.startsWith('preview')&&!n.startsWith('icon-b')&&!n.startsWith('icon-c')&&n!=='feature.png'&&n!=='icon-comparison.png').map(n=>'./assets/baedal/'+n);
fs.writeFileSync(path.join(app,'sw.js'),`const CACHE='baedal-art-v1';const ASSETS=${JSON.stringify(['./','./index.html','./manifest.webmanifest',...assets])};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('baedal-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));});`);
const pkg=JSON.parse(fs.readFileSync(path.join(app,'package.json')));pkg.name='baedal-app';pkg.description='모두의 배달';pkg.scripts.copyweb='node copyweb.cjs';pkg.scripts.start='node server.js';fs.writeFileSync(path.join(app,'package.json'),JSON.stringify(pkg,null,2));
fs.writeFileSync(path.join(app,'copyweb.cjs'),`const fs=require('fs'),path=require('path');const root=__dirname;const web=path.join(root,'www');fs.mkdirSync(web,{recursive:true});for(const n of ['index.html','manifest.webmanifest','sw.js'])fs.copyFileSync(path.join(root,n),path.join(web,n));fs.cpSync(path.join(root,'assets/baedal'),path.join(web,'assets/baedal'),{recursive:true});console.log('모두의 배달 web assets copied');`);
const oldLock=path.join(app,'package-lock.json');if(fs.existsSync(oldLock)){const lock=JSON.parse(fs.readFileSync(oldLock));lock.name=pkg.name;if(lock.packages?.[''])lock.packages[''].name=pkg.name;fs.writeFileSync(oldLock,JSON.stringify(lock,null,2));}
require(path.join(app,'copyweb.cjs'));
const nativeWeb=path.join(app,'android/app/src/main/assets/public');if(fs.existsSync(nativeWeb))fs.cpSync(path.join(app,'www'),nativeWeb,{recursive:true});
const sharp=require('C:/Users/Terry.J/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{const icon=path.join(artDest,'icon-a.png');
// ⚠ 런처 아이콘 가드 (2026-10-23) — DESIGN_PROMPTS.md §0 정오표 1·2
// 아래 아이콘 생성은 icon-a.png(야간 도시 배경이 들어간 완성 일러스트) 한 장을
// icon-only.png 와 icon-foreground.png 에 '똑같이' 굽는다. 그래서 두 파일이 SHA-256까지
// 같아졌고, 전경에 알파가 없어 adaptive 마스크가 헬멧 위·배달통 왼쪽·바퀴 아래를 깎았다.
// v1.1에서 전경(알파 87.9%, 최대반경 297.1px)과 배경 레이어를 따로 만들어 해결했으므로,
// 그 산출물이 하나라도 있으면 여기서는 아이콘을 건드리지 않는다.
// 기기 반영은 npx @capacitor/assets generate 가 맡는다.
const adaptive=['icon-foreground.png','icon-background.png'].map(n=>path.join(app,'assets',n));
const hasAdaptive=adaptive.some(p=>fs.existsSync(p));
if(hasAdaptive){
  console.log('⚠ v1.1 런처 아이콘 레이어 감지 — 아이콘 생성을 건너뜁니다 (기존 파일 보존)');
  console.log('  반영: npx @capacitor/assets generate --android → npx cap sync android');
}else{
for(const [density,size] of Object.entries({ldpi:36,mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})){const dir=path.join(app,'android/app/src/main/res/mipmap-'+density);if(!fs.existsSync(dir))continue;for(const name of ['ic_launcher.png','ic_launcher_round.png'])await sharp(icon).resize(size,size).png().toFile(path.join(dir,name));await sharp(icon).resize(Math.round(size*1.3),Math.round(size*1.3)).extend({top:Math.round(size*.475),bottom:Math.round(size*.475),left:Math.round(size*.475),right:Math.round(size*.475),background:'#0e1626'}).resize(Math.round(size*2.25)).png().toFile(path.join(dir,'ic_launcher_foreground.png'));await sharp({create:{width:size,height:size,channels:4,background:'#0e1626'}}).png().toFile(path.join(dir,'ic_launcher_background.png'));}
for(const n of ['icon-only.png','icon-foreground.png'])await sharp(icon).resize(1024,1024).png().toFile(path.join(app,'assets',n));
}
console.log('Packaged web'+(hasAdaptive?'':', Android launcher icons')+' and original art archive');})().catch(e=>{console.error(e);process.exit(1)});

// OTA 배포본이 소스 저장소보다 뒤처졌는지 검사한다.
//
// 이 레포의 일부 앱은 다른 저장소의 빌드 산출물이다(linedefense/, toilet.html, monsteridle/).
// 소스를 고치고 빌드까지 했는데 여기로 옮기는 걸 빠뜨리면, 앱은 옛 사본을 계속 받으면서도
// 아무 신호가 없다. 실제로 2026-11 에 두 번 그랬다 — 타워디펜스는 하루, 화장실 수비대는
// 한 달 가까이 옛 번들이 서빙됐다. 그 조용한 실패를 시끄러운 실패로 바꾸는 게 이 스크립트다.
//
// 사용: node tools/check-ota-freshness.mjs
// 환경변수 GITHUB_TOKEN 이 있으면 인증해서 쓴다(미인증은 시간당 60회 제한).
import fs from 'node:fs';
import path from 'node:path';

const OWNER = 'SeungIlJang';
// 빌드 산출물에 영향을 주지 않는 경로. 여기만 바뀐 커밋은 '배포 필요'로 치지 않는다.
// 모르는 경로는 전부 '영향 있음'으로 본다 — 놓치는 것보다 헛경보가 낫다.
const IRRELEVANT = [
  /^README/i, /\.md$/i, /^docs\//, /^store-assets\//, /^\.github\//, /^\.vscode\//,
  /^android\//, /^ios\//, /^tests?\//, /\.(apk|aab|keystore)$/i, /^design\//, /^proto\//,
];

const root = path.resolve(import.meta.dirname, '..');
const sourcesFile = path.join(root, 'ota-sources.json');
if (!fs.existsSync(sourcesFile)) {
  console.error('ota-sources.json 이 없다. 각 소스 레포에서 npm run deploy 를 한 번씩 돌려라.');
  process.exit(1);
}
const sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'ota-freshness' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const api = async (url) => {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status} ${await res.text().then(t => t.slice(0, 120))}`);
  return res.json();
};

let stale = 0, warned = 0;
for (const [target, info] of Object.entries(sources)) {
  const { repo, commit, dirty } = info;
  if (dirty) {
    console.log(`⚠️  ${target} — 커밋 안 된 작업물로 배포됐다. 기록된 ${commit.slice(0, 7)} 이 실제 내용과 다를 수 있다.`);
    warned++;
  }

  const head = (await api(`https://api.github.com/repos/${OWNER}/${repo}/commits/main`)).sha;
  if (head === commit) {
    console.log(`✅ ${target} — ${repo}@${head.slice(0, 7)} 최신`);
    continue;
  }

  // 사이에 낀 커밋들이 실제로 빌드에 영향을 주는지 본다. README 만 고친 커밋으로
  // 빨간불이 뜨면 아무도 이 검사를 안 믿게 된다.
  const cmp = await api(`https://api.github.com/repos/${OWNER}/${repo}/compare/${commit}...${head}`);
  const files = (cmp.files ?? []).map(f => f.filename);
  const relevant = files.filter(f => !IRRELEVANT.some(re => re.test(f)));

  if (relevant.length === 0) {
    console.log(`✅ ${target} — ${repo} 가 ${cmp.commits.length}커밋 앞서지만 빌드와 무관한 변경뿐이다`);
    continue;
  }

  stale++;
  console.log(`❌ ${target} — ${repo} 가 ${cmp.commits.length}커밋 앞서 있다`);
  console.log(`     배포본 ${commit.slice(0, 7)} → 소스 ${head.slice(0, 7)}`);
  for (const c of cmp.commits.slice(-5)) console.log(`     · ${c.sha.slice(0, 7)} ${c.commit.message.split('\n')[0].slice(0, 60)}`);
  console.log(`     영향 파일 ${relevant.length}개: ${relevant.slice(0, 6).join(', ')}`);
  console.log(`     → ${repo} 에서 npm run deploy 후 이 레포에 커밋·푸시`);
}

if (stale) {
  console.error(`\n배포본 ${stale}개가 뒤처져 있다. 앱은 옛 코드를 받고 있다.`);
  process.exit(1);
}
console.log(`\n전부 최신${warned ? ` (경고 ${warned}건)` : ''}`);

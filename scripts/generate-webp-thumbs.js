/**
 * public/images の画像から public/webp に軽量WebPサムネを生成するスクリプト
 *
 * - 目的: 静的ホスティング(Cloudflare Pages)でも転送量を極限まで削る
 * - 方式: cwebp を使用して max-width 640 / quality 30 / metadata none
 * - 出力名: `${元ファイル名}.webp`（拡張子も含めて保持するので衝突しない）
 *
 * 使い方:
 *   node scripts/generate-webp-thumbs.js
 *
 * オプション（環境変数）:
 *   WEBP_WIDTH=640
 *   WEBP_QUALITY=30
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/webp');

// “攻め”設定: さらに小さく・さらに低品質（見る専用）
const WIDTH = String(process.env.WEBP_WIDTH || '480');
const QUALITY = String(process.env.WEBP_QUALITY || '25');

function findCwebp() {
  const candidates = [
    process.env.CWEBP,
    '/opt/homebrew/bin/cwebp',
    '/usr/local/bin/cwebp',
    '/usr/bin/cwebp',
  ].filter(Boolean);

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore
    }
  }

  const which = spawnSync('which', ['cwebp'], { encoding: 'utf-8' });
  if (which.status === 0) {
    const resolved = (which.stdout || '').trim();
    if (resolved) return resolved;
  }
  return null;
}

function isImageFile(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
}

function main() {
  const cwebp = findCwebp();
  if (!cwebp) {
    console.error('❌ cwebp が見つかりません。Homebrewで `brew install webp` を実行してください。');
    process.exit(1);
  }

  if (!fs.existsSync(inputDir)) {
    console.error(`❌ 入力ディレクトリが存在しません: ${inputDir}`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs
    .readdirSync(inputDir)
    .filter(isImageFile)
    .sort((a, b) => a.localeCompare(b));

  let converted = 0;
  let skipped = 0;

  console.log(`🖼️  入力: ${files.length} files`);
  console.log(`⚙️  cwebp: ${cwebp}`);
  console.log(`⚙️  WEBP_WIDTH=${WIDTH}, WEBP_QUALITY=${QUALITY}`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inPath = path.join(inputDir, file);
    const outPath = path.join(outputDir, `${file}.webp`);

    try {
      const inStat = fs.statSync(inPath);
      if (fs.existsSync(outPath)) {
        const outStat = fs.statSync(outPath);
        if (outStat.mtimeMs >= inStat.mtimeMs && outStat.size > 0) {
          skipped++;
          continue;
        }
      }
    } catch {
      // 何かあれば作り直す
    }

    const args = [
      '-quiet',
      '-mt',
      '-q',
      QUALITY,
      '-resize',
      WIDTH,
      '0',
      '-metadata',
      'none',
      inPath,
      '-o',
      outPath,
    ];

    const res = spawnSync(cwebp, args, { stdio: 'inherit' });
    if (res.status !== 0) {
      console.error(`❌ 変換に失敗しました: ${file}`);
      process.exit(res.status || 1);
    }

    converted++;
    const done = converted + skipped;
    if (done % 25 === 0 || done === files.length) {
      console.log(`✅ progress: ${done}/${files.length} (converted=${converted}, skipped=${skipped})`);
    }
  }

  console.log(`🎉 完了: converted=${converted}, skipped=${skipped}`);
  console.log(`📁 出力: ${outputDir}`);
}

main();



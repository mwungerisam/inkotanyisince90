import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES = path.join('public', 'images');
const OUT = path.join('public', 'products');
const CANVAS = 1000;
const SHIRT_WIDTH = 760;
const WHITE_THRESH = 16;

const pairs = [
  { front: 'ink.front.png', back: 'ink.back.png', slug: 'ink' },
  { front: '1990.front.png', back: '1990.back.png', slug: '1990' },
  { front: 'urugwiro.front.png', back: 'urugwiro.back.png', slug: 'urugwiro' },
  { front: 'ifeel.front.png', back: 'ifeel.bak.png', slug: 'ifeel' },
];

async function findContentBox(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const dist = Math.max(255 - data[i], 255 - data[i + 1], 255 - data[i + 2]);
      if (dist > WHITE_THRESH) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) return { left: 0, top: 0, width, height };

  const pad = Math.round(Math.min(width, height) * 0.008);
  return {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(width - 1, maxX + pad) - Math.max(0, minX - pad) + 1,
    height: Math.min(height - 1, maxY + pad) - Math.max(0, minY - pad) + 1,
  };
}

async function normalizeOne(srcName, outName) {
  const srcPath = path.join(IMAGES, srcName);
  if (!fs.existsSync(srcPath)) throw new Error(`Missing: ${srcPath}`);

  const flat = await sharp(srcPath)
    .rotate()
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 95 })
    .toBuffer();

  const tmp = path.join(OUT, `${outName}.tmp-src.jpg`);
  fs.writeFileSync(tmp, flat);

  const box = await findContentBox(tmp);
  const extracted = await sharp(tmp).extract(box).toBuffer();

  let resized = await sharp(extracted)
    .resize({ width: SHIRT_WIDTH, withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });

  let rw = resized.info.width;
  let rh = resized.info.height;
  let buffer = resized.data;
  const maxH = Math.round(CANVAS * 0.86);

  if (rh > maxH) {
    const capped = await sharp(resized.data)
      .resize({ height: maxH, withoutEnlargement: false })
      .toBuffer({ resolveWithObject: true });
    buffer = capped.data;
    rw = capped.info.width;
    rh = capped.info.height;
  }

  const left = Math.round((CANVAS - rw) / 2);
  const top = Math.round((CANVAS - rh) / 2);
  const outPath = path.join(OUT, outName);

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: buffer, left, top }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);

  fs.unlinkSync(tmp);
  console.log(`${srcName} -> ${outName} (${rw}x${rh})`);
}

(async () => {
  for (const file of fs.readdirSync(OUT)) {
    if (file.startsWith('tee-') || file.endsWith('.jpg')) {
      fs.unlinkSync(path.join(OUT, file));
    }
  }

  for (const pair of pairs) {
    await normalizeOne(pair.front, `${pair.slug}-front.jpg`);
    await normalizeOne(pair.back, `${pair.slug}-back.jpg`);
  }
  console.log('DONE');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

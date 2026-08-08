const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

const sizes = [16, 32, 48, 64, 128, 192, 256, 512];

async function generate() {
  if (!fs.existsSync(svgPath)) {
    console.error('favicon.svg not found in public/');
    process.exit(1);
  }

  const pngBuffers = [];

  for (const size of sizes) {
    const outPath = path.join(publicDir, `favicon-${size}x${size}.png`);
    console.log('Generating', outPath);
    await sharp(svgPath)
      .resize(size, size, { fit: 'contain' })
      .png({ quality: 100 })
      .toFile(outPath);
    if ([16, 32, 48].includes(size)) {
      const buf = await fs.promises.readFile(outPath);
      pngBuffers.push(buf);
    }
  }

  // Create multi-size ICO from 16/32/48 using to-ico
  const icoPath = path.join(publicDir, 'favicon.ico');
  console.log('Generating', icoPath);
  const icoBuffer = await toIco(pngBuffers);
  await fs.promises.writeFile(icoPath, icoBuffer);
  console.log('Done. Generated PNGs and ICO in public/');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});

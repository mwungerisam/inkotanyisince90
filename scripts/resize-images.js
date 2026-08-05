import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.join(process.cwd(), 'public', 'products');
const files = ['island-front.png', 'island-back.png'];

async function resizeImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const resizedPath = inputPath.replace('.png', '-resized.png');

    try {
      await sharp(inputPath)
        .resize(800, 1000, {
          fit: 'cover',
          position: 'center',
        })
        .toFile(resizedPath);

      fs.unlinkSync(inputPath);
      fs.renameSync(resizedPath, inputPath);

      console.log(`Resized ${file} successfully`);
    } catch (error) {
      console.error(`Error resizing ${file}:`, error);
    }
  }
}

resizeImages();

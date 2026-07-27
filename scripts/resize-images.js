const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/products');
const files = ['island-front.png', 'island-back.png'];

async function resizeImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(inputDir, file);

    try {
      // Resize to match typical t-shirt image dimensions (around 800x1000)
      await sharp(inputPath)
        .resize(800, 1000, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(outputPath.replace('.png', '-resized.png'));

      // Replace original with resized version
      fs.unlinkSync(inputPath);
      fs.renameSync(outputPath.replace('.png', '-resized.png'), outputPath);
      
      console.log(`Resized ${file} successfully`);
    } catch (error) {
      console.error(`Error resizing ${file}:`, error);
    }
  }
}

resizeImages();

import sharp from 'sharp';
import { readdir, stat, mkdir, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const sourceDir = 'public/img/罗小黑节气';
const targetDir = 'public/img/new-wallpaper/static-mobile';
const previewWidth = 480;

async function main() {
  const files = await readdir(sourceDir);
  let index = 1;
  
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
    
    const folderName = String(index).padStart(4, '0');
    const folderPath = join(targetDir, folderName);
    
    await mkdir(folderPath, { recursive: true });
    
    const inputPath = join(sourceDir, file);
    const pngPath = join(folderPath, 'image.png');
    const prePath = join(folderPath, 'image-pre.webp');
    
    try {
      await sharp(inputPath)
        .png()
        .toFile(pngPath);
      console.log(`Created: ${pngPath}`);
      
      await sharp(inputPath)
        .resize(previewWidth)
        .webp({ quality: 80 })
        .toFile(prePath);
      console.log(`Created: ${prePath}`);
      
      index++;
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
  
  console.log('Done!');
}

main();

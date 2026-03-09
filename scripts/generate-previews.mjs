import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname } from 'path';

const staticDir = 'public/img/new-wallpaper/static';
const previewWidth = 480;

async function processFolder(folderPath) {
  const files = await readdir(folderPath);
  const imageFile = files.find(f => f.startsWith('image.') && !f.includes('-pre'));
  
  if (!imageFile) {
    console.log(`No image file found in ${folderPath}`);
    return;
  }
  
  const ext = extname(imageFile).toLowerCase();
  const inputPath = join(folderPath, imageFile);
  const pngPath = join(folderPath, 'image.png');
  const prePath = join(folderPath, 'image-pre.webp');
  
  try {
    if (ext !== '.png') {
      await sharp(inputPath)
        .png()
        .toFile(pngPath);
      console.log(`Converted to PNG: ${pngPath}`);
      await unlink(inputPath);
      console.log(`Deleted: ${inputPath}`);
      
      await sharp(pngPath)
        .resize(previewWidth)
        .webp({ quality: 80 })
        .toFile(prePath);
      console.log(`Updated preview: ${prePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err.message);
  }
}

async function main() {
  const folders = await readdir(staticDir);
  
  for (const folder of folders) {
    const folderPath = join(staticDir, folder);
    const stats = await stat(folderPath);
    
    if (stats.isDirectory()) {
      await processFolder(folderPath);
    }
  }
  
  console.log('Done!');
}

main();

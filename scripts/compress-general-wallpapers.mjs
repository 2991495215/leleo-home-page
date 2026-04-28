import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const targetDir = 'public/img/General Wallpaper/compressed_images';
const maxWidth = 2560;

async function processFile(filePath, ext) {
  const transformer = sharp(filePath).rotate().resize({
    width: maxWidth,
    withoutEnlargement: true,
    fit: 'inside'
  });

  if (ext === '.png') {
    await transformer
      .png({ compressionLevel: 9, palette: true, quality: 80 })
      .toFile(`${filePath}.tmp`);
  } else {
    await transformer
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(`${filePath}.tmp`);
  }
}

async function main() {
  const files = await readdir(targetDir);

  for (const file of files) {
    const filePath = join(targetDir, file);
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) continue;

    const ext = extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    try {
      await processFile(filePath, ext);
      await sharp(`${filePath}.tmp`).toFile(filePath);
      console.log(`Compressed: ${file}`);
    } catch (error) {
      console.error(`Failed: ${file}`, error.message);
    }
  }
}

main();

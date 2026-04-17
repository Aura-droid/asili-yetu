const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = './public/destinations';

fs.readdirSync(directory).forEach(file => {
  if (file.endsWith('.jpg')) {
    const filePath = path.join(directory, file);
    const tempPath = path.join(directory, 'temp_' + file);
    
    console.log(`Optimizing ${file}...`);
    
    sharp(filePath)
      .resize(1920) // Max width for high-fidelity
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tempPath)
      .then(() => {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        console.log(`Finished ${file}`);
      })
      .catch(err => {
        console.error(`Error optimizing ${file}:`, err);
      });
  }
});

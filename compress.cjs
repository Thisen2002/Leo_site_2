const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const projectImages = [
  "BOD Board Transition 2026.jpeg",
  "Eco Tide 2026.jpeg",
  "Samagi Sathkara 2026.jpeg"
];

const galleryImages = [
  "FB_IMG_1786779694639.jpg.jpeg",
  "FB_IMG_1786779699946.jpg.jpeg",
  "FB_IMG_1786779712381.jpg.jpeg",
  "FB_IMG_1786779743882.jpg.jpeg",
  "FB_IMG_1786779798663.jpg.jpeg",
  "FB_IMG_1786779819445.jpg.jpeg",
  "FB_IMG_1786779848440.jpg.jpeg",
  "FB_IMG_1786779883026.jpg.jpeg",
  "FB_IMG_1786780018362.jpg.jpeg",
  "Eco Tide 2.JPG.jpeg",
  "GDFN6340.JPG.jpeg",
  "IMG_0444.JPG.jpeg",
  "IMG_0457.JPG.jpeg",
  "IMG_4785.JPG.jpeg",
  "IMG_4788.JPG.jpeg",
  "IMG_4806.JPG.jpeg",
  "IMG_4809.JPG.jpeg",
  "IMG_E4830.JPG.jpeg",
  "Samagi Sathkara -10.jpg.jpeg",
  "Samagi Sathkara -11 (1).jpg.jpeg",
  "Samagi Sathkara -26 (1).jpg.jpeg",
  "Samagi Sathkara -30.jpg.jpeg",
  "Samagi Sathkara -34.jpg.jpeg",
  "Samagi Sathkara -39 (2).jpg.jpeg",
  "Samagi Sathkara -40.jpg.jpeg",
  "Samagi Sathkara -44.jpg.jpeg",
  "Samagi Sathkara -57.jpg.jpeg",
  "Samagi Sathkara -8.jpg.jpeg",
  "සමඟි සත්කාර '26 - Phase 1  project banner.jpg.jpeg"
];

const processImage = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  const stats = fs.statSync(filePath);
  const sizeBefore = (stats.size / 1024 / 1024).toFixed(2);
  
  try {
    const inputBuffer = fs.readFileSync(filePath);
    const outputBuffer = await sharp(inputBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();
      
    fs.writeFileSync(filePath, outputBuffer);
    
    const sizeAfter = (outputBuffer.length / 1024 / 1024).toFixed(2);
    
    console.log(`Compressed ${path.basename(filePath)}: ${sizeBefore}MB -> ${sizeAfter}MB`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
};

const run = async () => {
  const projectDir = path.join(__dirname, 'public', 'Pic', 'Project');
  const galleryDir = path.join(__dirname, 'public', 'Pic', 'Gallery');
  
  console.log("Compressing project images...");
  for (const img of projectImages) {
    await processImage(path.join(projectDir, img));
  }
  
  console.log("\\nCompressing gallery images...");
  for (const img of galleryImages) {
    await processImage(path.join(galleryDir, img));
  }
  
  console.log("\\nAll done!");
};

run();

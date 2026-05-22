import fs from 'fs';
import path from 'path';

const htmlPath = 'c:\\Users\\Dani\\Desktop\\CNNB\\index.html';
const outputDir = 'c:\\Users\\Dani\\Desktop\\CNNB';

console.log('--- HTML Asset Extractor ---');
console.log('Extracting embedded base64 assets back to separate files...\n');

let html = fs.readFileSync(htmlPath, 'utf8');

// ============================================================
// STEP 1: Extract header_bg.jpg from CSS background
// ============================================================
console.log('📸 Extracting header_bg.jpg...');
const bgMatch = html.match(/url\(['"]?(data:image\/jpeg;base64,([A-Za-z0-9+/=]+))['"]?\)/);
if (bgMatch) {
    const base64Data = bgMatch[2];
    fs.writeFileSync(path.join(outputDir, 'header_bg.jpg'), Buffer.from(base64Data, 'base64'));
    html = html.replace(bgMatch[1], "header_bg.jpg");
    console.log('  ✅ header_bg.jpg extracted!\n');
} else {
    console.log('  ⚠️  header_bg.jpg not found as embedded, skipping.\n');
}

// ============================================================
// STEP 2: Extract diploma images (diplome/...)
// ============================================================
console.log('🎓 Extracting diploma images...');
const diplomeDir = path.join(outputDir, 'diplome');
if (!fs.existsSync(diplomeDir)) fs.mkdirSync(diplomeDir);

// Find all data URIs that replaced diplome/filename references
// We need to look in the _embedded dict for the original filenames
let diplomaCount = 0;
const imgRegex = /src=['"]?(data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+))['"]?/g;
let imgMatch;
const imgReplacements = [];
while ((imgMatch = imgRegex.exec(html)) !== null) {
    imgReplacements.push({ full: imgMatch[1], mime: imgMatch[2], data: imgMatch[3] });
}
console.log(`  Found ${imgReplacements.length} embedded images in img tags.`);

// ============================================================
// STEP 3: Extract the _embedded PDF/file dictionary
// ============================================================
console.log('\n📄 Extracting embedded PDF dictionary...');

// Find the _embedded = { ... } block inside downloadFile
const embeddedMatch = html.match(/const _embedded = \{([\s\S]*?)\};[\s\S]*?const data = _embedded/);
if (!embeddedMatch) {
    console.error('❌ Could not find _embedded dictionary in HTML!');
    process.exit(1);
}

const dictContent = embeddedMatch[1];
// Parse key: value pairs
const entryRegex = /"([^"]+)":\s*"data:(application\/pdf|image\/jpeg|image\/png);base64,([A-Za-z0-9+/=]+)"/g;
let entryMatch;
const extractedFiles = {};
let fileCount = 0;

while ((entryMatch = entryRegex.exec(dictContent)) !== null) {
    const filename = entryMatch[1];
    const mime = entryMatch[2];
    const base64Data = entryMatch[3];
    extractedFiles[filename] = { mime, data: base64Data };
    fileCount++;
}

console.log(`  Found ${fileCount} files in embedded dictionary.`);

// Save each file
for (const [filename, { mime, data }] of Object.entries(extractedFiles)) {
    const filePath = path.join(outputDir, filename);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    const sizeMB = (fs.statSync(filePath).size / 1024).toFixed(0);
    console.log(`  ✅ ${filename} (${sizeMB} KB)`);
}

// ============================================================
// STEP 4: Replace downloadFile() back to simple version
// ============================================================
console.log('\n🔧 Restoring downloadFile() to simple version...');

const newDownloadFn = `function downloadFile(filename) {
            const link = document.createElement('a');
            link.href = filename;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }`;

// Replace the entire embedded downloadFile block
html = html.replace(
    /function downloadFile\(filename\) \{[\s\S]*?const data = _embedded\[filename\];[\s\S]*?document\.body\.removeChild\(link\);\s*\}/,
    newDownloadFn
);
console.log('  ✅ downloadFile() restored.\n');

// ============================================================
// STEP 5: Write the slim index.html
// ============================================================
console.log('💾 Writing slim index.html...');
fs.writeFileSync(htmlPath, html, 'utf8');
const finalSizeMB = (fs.statSync(htmlPath).size / (1024 * 1024)).toFixed(2);
console.log(`\n🎉 DONE!`);
console.log(`📦 New index.html size: ${finalSizeMB} MB (was 80 MB)`);
console.log(`📁 Extracted ${fileCount} files to separate folders`);

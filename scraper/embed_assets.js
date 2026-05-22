import fs from 'fs';
import path from 'path';

const htmlPath = 'c:\\Users\\Dani\\Desktop\\CNNB\\index.html';
const assetsDir = 'c:\\Users\\Dani\\Desktop\\VNB';
const diplomeDir = 'c:\\Users\\Dani\\Desktop\\VNB\\diplome';

console.log('--- HTML Asset Embedding Tool ---');
console.log('This will embed all PDFs and images INSIDE index.html');
console.log('Result: a single self-contained file that works anywhere.\n');

if (!fs.existsSync(htmlPath)) {
    console.error('❌ HTML file not found at:', htmlPath);
    process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// ==========================================================
// STEP 1: Embed header_bg.jpg as base64 in CSS
// ==========================================================
const headerBgPath = path.join(assetsDir, 'header_bg.jpg');
if (fs.existsSync(headerBgPath)) {
    console.log('📸 Embedding header_bg.jpg...');
    const bgBase64 = fs.readFileSync(headerBgPath).toString('base64');
    const bgDataUri = `data:image/jpeg;base64,${bgBase64}`;
    html = html.split(`url('header_bg.jpg')`).join(`url('${bgDataUri}')`);
    html = html.split(`url("header_bg.jpg")`).join(`url("${bgDataUri}")`);
    html = html.split(`url(header_bg.jpg)`).join(`url("${bgDataUri}")`);
    console.log('✅ header_bg.jpg embedded!\n');
} else {
    console.warn('⚠️  header_bg.jpg not found, skipping.\n');
}

// ==========================================================
// STEP 2: Embed all diploma images (diplome/*.jpg)
// ==========================================================
console.log('🎓 Embedding diploma images...');
const diplomaFiles = fs.readdirSync(diplomeDir);
let diplomasEmbedded = 0;
diplomaFiles.forEach(file => {
    if (!file.endsWith('.jpg') && !file.endsWith('.png')) return;
    const filePath = path.join(diplomeDir, file);
    const base64 = fs.readFileSync(filePath).toString('base64');
    const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const dataUri = `data:${mime};base64,${base64}`;
    const searchStr = `diplome/${file}`;
    if (html.includes(searchStr)) {
        html = html.split(searchStr).join(dataUri);
        console.log(`  ✅ ${file}`);
        diplomasEmbedded++;
    } else {
        console.log(`  ⚠️  Not referenced in HTML: ${file}`);
    }
});
console.log(`✅ ${diplomasEmbedded} diploma images embedded!\n`);

// ==========================================================
// STEP 3: Build embedded PDF + JPG dictionary
// ==========================================================
console.log('📄 Reading all PDF documents and extra images...');
const embeddedFiles = {};
const topLevelFiles = fs.readdirSync(assetsDir);
topLevelFiles.forEach(file => {
    const stat = fs.statSync(path.join(assetsDir, file));
    if (stat.isDirectory()) return;

    const isPdf = file.endsWith('.pdf');
    const isJpg = file.endsWith('.jpg') || file.endsWith('.png');
    if (!isPdf && !isJpg) return;
    if (file === 'header_bg.jpg') return; // already embedded above

    const filePath = path.join(assetsDir, file);
    const base64 = fs.readFileSync(filePath).toString('base64');
    let mime = 'application/pdf';
    if (file.endsWith('.jpg')) mime = 'image/jpeg';
    else if (file.endsWith('.png')) mime = 'image/png';

    embeddedFiles[file] = `data:${mime};base64,${base64}`;
    console.log(`  ✅ ${file} (${(fs.statSync(filePath).size / 1024).toFixed(0)} KB)`);
});
console.log(`✅ ${Object.keys(embeddedFiles).length} documents indexed!\n`);

// ==========================================================
// STEP 4: Replace downloadFile function with embedded version
// ==========================================================
console.log('🔧 Replacing downloadFile() function...');

const originalBlock = `function downloadFile(filename) {
            const link = document.createElement('a');
            link.href = filename;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }`;

if (!html.includes(originalBlock)) {
    console.error('❌ Could not find downloadFile() block — check formatting!');
    process.exit(1);
}

// Serialize the dictionary (only keys/values, no circular refs)
const dictEntries = Object.entries(embeddedFiles)
    .map(([k, v]) => `            ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
    .join(',\n');

const newBlock = `function downloadFile(filename) {
            // Embedded files dictionary (auto-generated)
            const _embedded = {
${dictEntries}
            };
            const data = _embedded[filename];
            const link = document.createElement('a');
            link.href = data || filename;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }`;

html = html.replace(originalBlock, newBlock);
console.log('✅ downloadFile() patched with embedded dictionary!\n');

// ==========================================================
// STEP 5: Write the final self-contained HTML file
// ==========================================================
console.log('💾 Writing final self-contained index.html...');
fs.writeFileSync(htmlPath, html, 'utf8');
const finalSizeMB = (fs.statSync(htmlPath).size / (1024 * 1024)).toFixed(2);
console.log(`\n🎉 DONE! Self-contained index.html is ready.`);
console.log(`📦 Final file size: ${finalSizeMB} MB`);
console.log(`📁 Location: ${htmlPath}`);
console.log(`\nYou can now upload ONLY index.html to GitHub — everything is embedded inside!`);

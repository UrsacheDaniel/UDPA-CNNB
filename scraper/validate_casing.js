import fs from 'fs';
import path from 'path';

const htmlPath = 'c:\\Users\\Dani\\Desktop\\VNB\\index.html';
const dirPath = 'c:\\Users\\Dani\\Desktop\\VNB';
const diplomePath = 'c:\\Users\\Dani\\Desktop\\VNB\\diplome';

if (!fs.existsSync(htmlPath)) {
    console.log('HTML file not found in VNB!');
    process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

// Read physical files on disk
const physicalFiles = new Set(fs.readdirSync(dirPath));
const physicalDiplomas = new Set(fs.readdirSync(diplomePath));

console.log('--- DIAGNOSTICS: Physical Files vs HTML References ---');
let hasMismatch = false;

// 1. Check downloadFile calls
const downloadRegex = /downloadFile\('([^']+)'\)/g;
let match;
console.log('\n[1] Checking downloadFile references...');
while ((match = downloadRegex.exec(html)) !== null) {
    const file = match[1];
    // Find case-insensitive match
    const found = [...physicalFiles].find(f => f.toLowerCase() === file.toLowerCase());
    if (!found) {
        console.log(`❌ FILE MISSING ENTIRELY: "${file}"`);
        hasMismatch = true;
    } else if (found !== file) {
        console.log(`⚠️ CASE MISMATCH: HTML has "${file}" | Disk has "${found}"`);
        hasMismatch = true;
    } else {
        console.log(`✅ MATCH: "${file}"`);
    }
}

// 2. Check legislatieDocs array files
const legislatieRegex = /file:\s*\"([^\"]+)\"/g;
console.log('\n[2] Checking legislatieDocs array...');
while ((match = legislatieRegex.exec(html)) !== null) {
    const file = match[1];
    const found = [...physicalFiles].find(f => f.toLowerCase() === file.toLowerCase());
    if (!found) {
        console.log(`❌ FILE MISSING ENTIRELY: "${file}"`);
        hasMismatch = true;
    } else if (found !== file) {
        console.log(`⚠️ CASE MISMATCH: HTML has "${file}" | Disk has "${found}"`);
        hasMismatch = true;
    } else {
        console.log(`✅ MATCH: "${file}"`);
    }
}

// 3. Check galleryImages urls
const galleryRegex = /url:\s*\"diplome\/([^\"]+)\"/g;
console.log('\n[3] Checking galleryImages urls...');
while ((match = galleryRegex.exec(html)) !== null) {
    const file = match[1];
    const found = [...physicalDiplomas].find(f => f.toLowerCase() === file.toLowerCase());
    if (!found) {
        console.log(`❌ DIPLOMA MISSING ENTIRELY: "diplome/${file}"`);
        hasMismatch = true;
    } else if (found !== file) {
        console.log(`⚠️ CASE MISMATCH: HTML has "diplome/${file}" | Disk has "diplome/${found}"`);
        hasMismatch = true;
    } else {
        console.log(`✅ MATCH: "diplome/${file}"`);
    }
}

if (!hasMismatch) {
    console.log('\n🎉 ALL FILES MATCH PERFECTLY IN CASING AND SPELLING!');
} else {
    console.log('\n🚨 SOME FILE MISMATCHES DETECTED!');
}

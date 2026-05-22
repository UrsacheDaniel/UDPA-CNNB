import fs from 'fs';
import path from 'path';

const srcDir = 'c:\\Users\\Dani\\Desktop\\VNB';
const destDir = 'c:\\Users\\Dani\\Desktop\\CNNB';

console.log('Starting asset copy...');
console.log('Source:', srcDir);
console.log('Destination:', destDir);

if (!fs.existsSync(srcDir)) {
    console.error('❌ Source directory VNB does not exist!');
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('Created destination directory');
}

// 1. Copy top-level files
const files = fs.readdirSync(srcDir);
let filesCopied = 0;
files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const stat = fs.statSync(srcPath);
    if (stat.isFile()) {
        if (file.endsWith('.pdf') || file.endsWith('.jpg') || file === 'index.html') {
            fs.copyFileSync(srcPath, path.join(destDir, file));
            console.log(`✅ Copied file: ${file}`);
            filesCopied++;
        }
    }
});
console.log(`Finished copying files. Total: ${filesCopied}`);

// 2. Copy diplome folder
const srcDiplome = path.join(srcDir, 'diplome');
const destDiplome = path.join(destDir, 'diplome');

if (fs.existsSync(srcDiplome)) {
    if (!fs.existsSync(destDiplome)) {
        fs.mkdirSync(destDiplome, { recursive: true });
        console.log('Created diplome destination folder');
    }
    const diplomas = fs.readdirSync(srcDiplome);
    let diplomasCopied = 0;
    diplomas.forEach(file => {
        fs.copyFileSync(path.join(srcDiplome, file), path.join(destDiplome, file));
        diplomasCopied++;
    });
    console.log(`✅ Copied all diplomas. Total: ${diplomasCopied}`);
} else {
    console.log('⚠️ Source diplome folder not found!');
}

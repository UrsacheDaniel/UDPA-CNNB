import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content');
const NAV_PATH = path.join(__dirname, '../src/navigation.json');
const BUNDLE_PATH = path.join(CONTENT_DIR, 'all_content.js');

async function buildBundle() {
  console.log('📦 Starting CNNB Content Bundler...');
  
  const bundle = {};
  
  // 1. Load Navigation
  if (fs.existsSync(NAV_PATH)) {
    try {
      const navData = await fs.readJson(NAV_PATH);
      bundle['_navigation'] = navData;
      console.log('✅ Bundled navigation schema.');
    } catch (err) {
      console.error('⚠️ Failed to parse navigation.json:', err.message);
    }
  } else {
    console.warn('⚠️ navigation.json not found!');
  }
  
  // 2. Load all content JSONs
  if (fs.existsSync(CONTENT_DIR)) {
    const files = await fs.readdir(CONTENT_DIR);
    let count = 0;
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const key = file.replace(/\.json$/, '');
        const filePath = path.join(CONTENT_DIR, file);
        try {
          const content = await fs.readJson(filePath);
          bundle[key] = content;
          count++;
        } catch (err) {
          console.error(`⚠️ Failed to parse ${file}:`, err.message);
        }
      }
    }
    console.log(`✅ Bundled ${count} page content files.`);
  } else {
    console.error('❌ Content directory does not exist!');
    return;
  }
  
  // 3. Write all_content.js
  const jsContent = `/* ==========================================================================
   Colegiul Național „Nicolae Bălcescu” Brăila - Offline Content Bundle
   Generated dynamically to bypass browser CORS file protocol restrictions.
   ========================================================================== */
window.CNNB_CONTENT = ${JSON.stringify(bundle, null, 2)};
`;

  await fs.writeFile(BUNDLE_PATH, jsContent, 'utf8');
  console.log(`🎉 Content bundle successfully built at ${BUNDLE_PATH} (${(jsContent.length / 1024 / 1024).toFixed(2)} MB)`);
}

buildBundle();

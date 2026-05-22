import fs from 'fs';
import path from 'path';

const downloadsDir = 'C:\\Users\\Dani\\Downloads';
const query = 'anunturiPage';

try {
  const files = fs.readdirSync(downloadsDir);
  console.log(`Searching for "${query}" in all HTML files in ${downloadsDir}...`);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(downloadsDir, file);
      const stat = fs.statSync(filePath);
      if (stat.size > 2000000) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(query)) {
        console.log(`Found in: ${file} (Size: ${stat.size} bytes)`);
        // Let's print around the query match
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(query) && line.includes('id=')) {
            console.log(`  Line ${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
} catch (e) {
  console.error(e);
}

import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\Dani\\Downloads\\deepseek_html_20260522_6f8e57(1).html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('anun')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});

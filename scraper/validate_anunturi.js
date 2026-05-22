import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('C:\\Users\\Dani\\Downloads\\deepseek_html_20260522_6f8e57(1).html', 'utf8');
const $ = cheerio.load(html);

console.log('Anunturi page element exists:', $('#anunturiPage').length);
if ($('#anunturiPage').length > 0) {
  console.log('Anunturi html length:', $('#anunturiPage').html().length);
  // Check nesting of child elements
  const children = $('#anunturiPage').children();
  console.log('Direct children count:', children.length);
  children.each((i, el) => {
    console.log(`Child ${i}: tag=${el.tagName}, class=${$(el).attr('class')}, id=${$(el).attr('id')}`);
  });
} else {
  console.log('Could not find id="anunturiPage"');
}

import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('C:\\Users\\Dani\\.gemini\\antigravity-ide\\brain\\afc5507f-9c5e-45a5-9e88-525c44685ed5\\.system_generated\\steps\\196\\content.md', 'utf8');
const $ = cheerio.load(html);

console.log('Page Title:', $('title').text());
console.log('Main columns count:', $('#main-column').length);
console.log('Midblock count:', $('#midblock').length);
console.log('Item-page count:', $('.item-page').length);
console.log('Content-panel count:', $('.content-panel').length);
console.log('Insidem count:', $('.insidem').length);
console.log('Contentpane count:', $('.contentpane').length);

const insidemHtml = $('.insidem').first().html();
console.log('\nInsidem content length:', insidemHtml ? insidemHtml.length : 'null');
if (insidemHtml) {
  console.log('Insidem first 1000 chars:', insidemHtml.substring(0, 1000).replace(/\s+/g, ' '));
}

const midblockHtml = $('#midblock').first().html();
console.log('\nMidblock content length:', midblockHtml ? midblockHtml.length : 'null');
if (midblockHtml) {
  console.log('Midblock first 1000 chars:', midblockHtml.substring(0, 1000).replace(/\s+/g, ' '));
}

const mainColumnHtml = $('#main-column').first().html();
console.log('\nMain-column content length:', mainColumnHtml ? mainColumnHtml.length : 'null');
if (mainColumnHtml) {
  console.log('Main-column first 1000 chars:', mainColumnHtml.substring(0, 1000).replace(/\s+/g, ' '));
}

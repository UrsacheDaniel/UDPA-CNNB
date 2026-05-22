import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://www.cnnb.ro';
const CONTENT_DIR = path.join(__dirname, '../content');
const NAV_PATH = path.join(__dirname, '../src/navigation.json');

// Ensure output folder exists
fs.ensureDirSync(CONTENT_DIR);

const visited = new Set();
const queue = [];

// Helper to clean and build dynamic menu structure from live website
async function generateNavigationSchema() {
  console.log('🌐 Fetching live homepage to dynamically build complete navigation.json...');
  try {
    const res = await axios.get(`${BASE_URL}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    const menuCategories = [];
    
    // The main top-level menu list lies under div#horiznav > ul.menunav > li
    $('#horiznav > ul.menunav > li').each((i, topLi) => {
      const $topLi = $(topLi);
      const categoryTitle = $topLi.find('> span > a .yjm_title, > a .yjm_title').first().text().trim() 
        || $topLi.find('> span > a, > a').first().text().trim();
        
      if (!categoryTitle) return;
      
      const category = {
        title: categoryTitle,
        items: []
      };
      
      // Level 1 items (under ul.level1)
      $topLi.find('> ul.level1 > li').each((j, itemLi) => {
        const $itemLi = $(itemLi);
        if ($itemLi.hasClass('bl') || $itemLi.hasClass('tl') || $itemLi.hasClass('tr') || $itemLi.hasClass('br') || $itemLi.hasClass('right')) return;
        
        const itemTitle = $itemLi.find('> span > a .yjm_title, > a .yjm_title').first().text().trim()
          || $itemLi.find('> span > a, > a').first().text().trim();
        let itemRoute = $itemLi.find('> span > a, > a').first().attr('href') || '#';
        
        if (!itemTitle) return;
        
        const item = {
          title: itemTitle,
          route: itemRoute
        };
        
        // Level 2 (children)
        const children = [];
        $itemLi.find('> ul.level2 > li').each((k, subItemLi) => {
          const $subItemLi = $(subItemLi);
          if ($subItemLi.hasClass('bl') || $subItemLi.hasClass('tl') || $subItemLi.hasClass('tr') || $subItemLi.hasClass('br') || $subItemLi.hasClass('right')) return;
          
          const subTitle = $subItemLi.find('> span > a .yjm_title, > a .yjm_title').first().text().trim()
            || $subItemLi.find('> span > a, > a').first().text().trim();
          let subRoute = $subItemLi.find('> span > a, > a').first().attr('href') || '#';
          
          if (!subTitle) return;
          
          const child = {
            title: subTitle,
            route: subRoute
          };
          
          // Level 3 (grandchildren)
          const subChildren = [];
          $subItemLi.find('> ul.level3 > li').each((l, subSubLi) => {
            const $subSubLi = $(subSubLi);
            if ($subSubLi.hasClass('bl') || $subSubLi.hasClass('tl') || $subSubLi.hasClass('tr') || $subSubLi.hasClass('br') || $subSubLi.hasClass('right')) return;
            
            const sTitle = $subSubLi.find('> span > a .yjm_title, > a .yjm_title').first().text().trim()
              || $subSubLi.find('> span > a, > a').first().text().trim();
            let sRoute = $subSubLi.find('> span > a, > a').first().attr('href') || '#';
            
            if (!sTitle) return;
            
            const subChild = {
              title: sTitle,
              route: sRoute
            };
            
            // Level 4 (great-grandchildren)
            const greatSubChildren = [];
            $subSubLi.find('> ul.level4 > li').each((m, subSubSubLi) => {
              const $subSubSubLi = $(subSubSubLi);
              if ($subSubSubLi.hasClass('bl') || $subSubSubLi.hasClass('tl') || $subSubSubLi.hasClass('tr') || $subSubSubLi.hasClass('br') || $subSubSubLi.hasClass('right')) return;
              
              const gTitle = $subSubSubLi.find('> span > a .yjm_title, > a .yjm_title').first().text().trim()
                || $subSubSubLi.find('> span > a, > a').first().text().trim();
              let gRoute = $subSubSubLi.find('> span > a, > a').first().attr('href') || '#';
              
              if (gTitle) {
                greatSubChildren.push({
                  title: gTitle,
                  route: gRoute
                });
              }
            });
            
            if (greatSubChildren.length > 0) {
              subChild.children = greatSubChildren;
            }
            
            subChildren.push(subChild);
          });
          
          if (subChildren.length > 0) {
            child.children = subChildren;
          }
          
          children.push(child);
        });
        
        if (children.length > 0) {
          item.children = children;
        }
        
        category.items.push(item);
      });
      
      menuCategories.push(category);
    });
    
    // Save generated schema to navigation.json
    await fs.writeJson(NAV_PATH, menuCategories, { spaces: 2 });
    console.log(`✨ Rebuilt navigation schema successfully! Saved ${menuCategories.length} categories to src/navigation.json.`);
    return menuCategories;
  } catch (err) {
    console.error('❌ Failed to dynamically scrape main site menu structure:', err.message);
    // Fallback: load existing navigation.json if available
    if (fs.existsSync(NAV_PATH)) {
      console.log('🔄 Loading existing src/navigation.json as fallback...');
      return fs.readJsonSync(NAV_PATH);
    }
  }
  return [];
}

// Recursively extract local routes to crawl from the schema
function extractRoutesFromSchema(schema) {
  const routes = ['/'];
  
  function parseItems(items) {
    if (!items || !Array.isArray(items)) return;
    items.forEach(item => {
      if (item.route && item.route.startsWith('/') && !item.route.startsWith('http')) {
        routes.push(item.route);
      }
      if (item.children) {
        parseItems(item.children);
      }
      if (item.items) {
        parseItems(item.items);
      }
    });
  }
  
  parseItems(schema);
  return [...new Set(routes)];
}

async function scrapePage(route) {
  const fullUrl = route.startsWith('http') ? route : `${BASE_URL}${route}`;
  const normalizedRoute = route.startsWith('http') 
    ? route.replace(BASE_URL, '') 
    : route;

  if (visited.has(normalizedRoute)) return;
  visited.add(normalizedRoute);

  console.log(`[${visited.size}/${queue.length + visited.size}] Scraping: ${fullUrl}`);

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    // Extract page metadata
    const title = $('.item-page h2 a, .componentheading, title').first().text().trim() || 'Informații CNNB';
    
    // Breadcrumbs
    const breadcrumbs = [];
    $('.breadcrumbs span, .breadcrumbs a').each((i, el) => {
      const txt = $(el).text().trim();
      if (txt && txt !== 'You are here:') {
        breadcrumbs.push(txt);
      }
    });

    // Content container selection (Joomla template contents)
    const contentContainer = $('.item-page, #midblock, #main-column, .content-panel').first();
    
    if (contentContainer.length === 0) {
      console.log(`⚠️ Content container not found for ${normalizedRoute}, using dynamic body fallback.`);
      // Fallback to select anything in primary middle panel if main component containers are missing
      const fallbackContainer = $('#stylef6, body').first();
      // Only keep basic nodes
      fallbackContainer.find('script, style, header, footer, #horiznav, #logo, .top_out').remove();
      
      const payload = {
        title,
        route: normalizedRoute,
        breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs : ['Acasă', title],
        contentHtml: fallbackContainer.html() ? fallbackContainer.html().trim() : '<p>Conținut indisponibil offline.</p>',
        scrapedAt: new Date().toISOString()
      };
      
      await savePayload(normalizedRoute, payload);
      return;
    }

    // Look for iframes (wrappers used in Joomla to embed external static HTML pages or documents)
    const iframes = contentContainer.find('iframe');
    for (let i = 0; i < iframes.length; i++) {
      const iframe = $(iframes[i]);
      const src = iframe.attr('src');
      if (src) {
        const iframeUrl = src.startsWith('http') ? src : `${BASE_URL}${src}`;
        console.log(`🔗 Found iframe wrapper pointing to: ${iframeUrl}`);
        
        // Detect PDF or document files
        const isDoc = iframeUrl.toLowerCase().endsWith('.pdf') || 
                      iframeUrl.toLowerCase().endsWith('.doc') || 
                      iframeUrl.toLowerCase().endsWith('.docx') || 
                      iframeUrl.toLowerCase().endsWith('.xls') || 
                      iframeUrl.toLowerCase().endsWith('.xlsx') ||
                      iframeUrl.toLowerCase().endsWith('.ppt') ||
                      iframeUrl.toLowerCase().endsWith('.pptx') ||
                      iframeUrl.toLowerCase().includes('/alte/');
                      
        if (isDoc) {
          console.log(`📎 Preserving document iframe wrapper: ${iframeUrl}`);
          const pdfWrapperHtml = `
<div class="pdf-embed-wrapper" style="margin: 2rem 0;">
  <div class="pdf-placeholder-iframe" data-src="${iframeUrl}"></div>
  <div class="pdf-fallback-card" style="margin-top:1.5rem; display:flex; align-items:center; justify-content:space-between; padding:1.2rem; background:rgba(212, 175, 55, 0.08); border:1px solid rgba(212, 175, 55, 0.3); border-radius:10px; flex-wrap: wrap; gap: 15px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="font-size:2.2rem;">📄</span>
      <div>
        <h4 style="margin:0; color:hsl(var(--primary-deep)); font-size:1.05rem; font-family:'Outfit', sans-serif;">Document PDF Oficial</h4>
        <p style="margin:4px 0 0 0; font-size:0.82rem; color:hsl(var(--text-muted)); font-family:'Outfit', sans-serif;">Dacă documentul nu se încarcă automat, îl puteți accesa sau descărca direct.</p>
      </div>
    </div>
    <a href="${iframeUrl}" target="_blank" class="pdf-download-link" style="background:hsl(var(--primary-deep)); color:white; padding:10px 18px; border-radius:6px; font-weight:600; text-decoration:none; font-size:0.85rem; transition:all 0.3s; box-shadow:0 4px 10px rgba(10,37,64,0.25); font-family:'Outfit', sans-serif;">Deschide PDF-ul</a>
  </div>
</div>`;
          iframe.replaceWith(pdfWrapperHtml);
          continue;
        }

        try {
          const iframeResponse = await axios.get(iframeUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 8000
          });
          const iframe$ = cheerio.load(iframeResponse.data);
          const iframeBody = iframe$('body').html() || iframe$.html();
          if (iframeBody) {
            iframe.replaceWith(`<div class="iframe-extracted-content">${iframeBody}</div>`);
            console.log(`✅ Extracted iframe content successfully!`);
          }
        } catch (iframeErr) {
          console.error(`⚠️ Failed to fetch iframe at ${iframeUrl}:`, iframeErr.message);
        }
      }
    }

    // Clean up unwanted tags (scripts, styles, residual/unwanted iframes, outdated sharing buttons)
    contentContainer.find('script, style, iframe, .sharing-buttons').remove();

    // Restore preserved document iframes in placeholders
    contentContainer.find('.pdf-placeholder-iframe').each((idx, elem) => {
      const $placeholder = $(elem);
      const srcUrl = $placeholder.attr('data-src');
      $placeholder.replaceWith(`<iframe src="${srcUrl}" style="width:100%; height:800px; border:none; border-radius:12px; box-shadow: var(--glass-shadow);" class="pdf-iframe"></iframe>`);
    });

    // Fix absolute URLs for images and attachments
    contentContainer.find('img').each((i, img) => {
      const src = $(img).attr('src');
      if (src && !src.startsWith('http')) {
        $(img).attr('src', `${BASE_URL}${src}`);
      }
      $(img).addClass('responsive-img');
    });

    contentContainer.find('a').each((i, a) => {
      const href = $(a).attr('href');
      if (href && !href.startsWith('http') && href.startsWith('/')) {
        $(a).attr('href', `#${href}`);
      }
    });

    // Extract HTML
    const contentHtml = contentContainer.html().trim();

    // Prepare JSON payload
    const payload = {
      title,
      route: normalizedRoute,
      breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs : ['Acasă', title],
      contentHtml,
      scrapedAt: new Date().toISOString()
    };

    await savePayload(normalizedRoute, payload);

    // Recursively discover more links in the text
    contentContainer.find('a').each((i, a) => {
      const href = $(a).attr('href');
      if (href && href.startsWith('/index.php') && !visited.has(href) && !queue.includes(href)) {
        queue.push(href);
      }
    });

  } catch (error) {
    console.error(`❌ Error scraping ${fullUrl}:`, error.message);
  }
}

async function savePayload(route, payload) {
  let filename = route.toLowerCase()
    .replace(/^\/index\.php/, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/^_+|_+$/g, '');
  
  if (!filename || filename === '_') {
    filename = 'home';
  }

  const destPath = path.join(CONTENT_DIR, `${filename}.json`);
  await fs.writeJson(destPath, payload, { spaces: 2 });
}

async function run() {
  console.log('🚀 Starting CNNB 100% Dynamic Deep Scraper Engine...');
  
  // 1. Rebuild navigation.json dynamically from the live site dropdowns
  const schema = await generateNavigationSchema();
  
  // 2. Extract all unique routes from the menu to scrape
  const schemaRoutes = extractRoutesFromSchema(schema);
  console.log(`🎯 Identified ${schemaRoutes.length} target menu routes to scrape.`);
  
  // 3. Inject them into queue
  schemaRoutes.forEach(r => queue.push(r));

  // 4. Begin crawling
  while (queue.length > 0) {
    const route = queue.shift();
    await scrapePage(route);
    // Add small delay to prevent rate-limiting/overwhelming school server
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  console.log('🎉 Dynamic page scraping complete!');

  // 5. Build the local offline bundle
  try {
    console.log('📦 Rebuilding offline content bundle (content/all_content.js)...');
    const BUNDLE_PATH = path.join(CONTENT_DIR, 'all_content.js');
    const bundle = {};
    
    if (fs.existsSync(NAV_PATH)) {
      bundle['_navigation'] = fs.readJsonSync(NAV_PATH);
    }
    
    const files = fs.readdirSync(CONTENT_DIR);
    let count = 0;
    for (const file of files) {
      if (file.endsWith('.json')) {
        const key = file.replace(/\.json$/, '');
        bundle[key] = fs.readJsonSync(path.join(CONTENT_DIR, file));
        count++;
      }
    }
    
    const jsContent = `/* ==========================================================================
   Colegiul Național „Nicolae Bălcescu” Brăila - Offline Content Bundle
   Generated dynamically to bypass browser CORS file protocol restrictions.
   ========================================================================== */
window.CNNB_CONTENT = ${JSON.stringify(bundle, null, 2)};
`;
    fs.writeFileSync(BUNDLE_PATH, jsContent, 'utf8');
    console.log(`🎉 Offline bundle successfully updated! (${count} files included)`);
  } catch (bundleErr) {
    console.error('⚠️ Failed to auto-generate offline bundle:', bundleErr.message);
  }
}

run();

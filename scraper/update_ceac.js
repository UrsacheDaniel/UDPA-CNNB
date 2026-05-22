import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CEAC_PATH = path.join(__dirname, '../content/menu_5_ceac.json');

async function updateCeac() {
  const data = await fs.readJson(CEAC_PATH);
  
  // Custom styled premium announcements grid
  const announcementsHtml = `
<style>
  .ceac-announcements-container {
    font-family: 'Outfit', 'Inter', sans-serif;
    max-width: 1000px;
    margin: 20px auto;
    padding: 24px;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.06);
  }
  .ceac-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #0a2540;
    text-align: center;
    margin-bottom: 24px;
    position: relative;
    padding-bottom: 12px;
  }
  .ceac-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #d4af37;
    border-radius: 2px;
  }
  .ceac-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .ceac-card {
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 20px 24px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.01);
  }
  .ceac-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.9);
    border-color: #0b407a;
    box-shadow: 0 12px 24px rgba(11, 64, 122, 0.15);
  }
  .ceac-card-icon {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    background: linear-gradient(135deg, #0a2540 0%, #0b407a 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(11, 64, 122, 0.2);
  }
  .ceac-card:hover .ceac-card-icon {
    background: linear-gradient(135deg, #0b407a 0%, #d4af37 100%);
  }
  .ceac-card-content {
    flex-grow: 1;
  }
  .ceac-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0a2540;
    margin-bottom: 4px;
    transition: color 0.2s ease;
  }
  .ceac-card:hover .ceac-card-title {
    color: #0b407a;
  }
  .ceac-card-subtitle {
    font-size: 0.9rem;
    color: #4b5563;
    font-weight: 500;
  }
  .ceac-card-arrow {
    font-size: 1.2rem;
    color: #9ca3af;
    transition: all 0.2s ease;
  }
  .ceac-card:hover .ceac-card-arrow {
    color: #0b407a;
    transform: translateX(4px);
  }
  @media (max-width: 640px) {
    .ceac-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .ceac-card-arrow {
      align-self: flex-end;
    }
  }
</style>
<div class="pg-category-view-desc">
  <div class="ceac-announcements-container">
    <div class="ceac-title">📢 Panou de Anunțuri</div>
    <div class="ceac-grid">
      <!-- 1. Admissions -->
      <a href="#/index.php/using-joomla/extensions/components/content-component/article-categories/349-testare-clasa-a-5a-iunie-2026" class="ceac-card">
        <div class="ceac-card-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div class="ceac-card-content">
          <div class="ceac-card-title">Testare clasa a V-a - an școlar 2026-2027</div>
          <div class="ceac-card-subtitle">📢 ANUNȚ - ÎNSCRIERE CLASA A V-A</div>
        </div>
        <div class="ceac-card-arrow">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </a>

      <!-- 2. Accredited Units -->
      <a href="https://www.isjbraila.ro/" target="_blank" class="ceac-card">
        <div class="ceac-card-icon">
          <i class="fa-solid fa-building-columns"></i>
        </div>
        <div class="ceac-card-content">
          <div class="ceac-card-title">SITEUL: ISJ Brăila</div>
          <div class="ceac-card-subtitle">Inspectoratul Școlar Județean Brăila - lista unităților acreditate</div>
        </div>
        <div class="ceac-card-arrow">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </div>
      </a>

      <!-- 3. Scholarships -->
      <a href="#/index.php/menu-5/managementul-burselor-scolare" class="ceac-card">
        <div class="ceac-card-icon">
          <i class="fa-solid fa-hand-holding-dollar"></i>
        </div>
        <div class="ceac-card-content">
          <div class="ceac-card-title">BURSE ȘCOLARE</div>
          <div class="ceac-card-subtitle">Managementul burselor școlare - formulare și metodologie</div>
        </div>
        <div class="ceac-card-arrow">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </a>

      <!-- 4. Public Transport -->
      <a href="#/alte/2025/ANUNT_TRANSPORT_RURAL_2025_2026.pdf" target="_blank" class="ceac-card">
        <div class="ceac-card-icon">
          <i class="fa-solid fa-bus"></i>
        </div>
        <div class="ceac-card-content">
          <div class="ceac-card-title">ANUNȚ transport gratuit elevi</div>
          <div class="ceac-card-subtitle">Norme de acordare a gratuității pentru transportul elevilor</div>
        </div>
        <div class="ceac-card-arrow">
          <i class="fa-solid fa-file-pdf"></i>
        </div>
      </a>
    </div>
  </div>
</div>`;

  // We find where the pg-category-view-desc div begins and ends in the contentHtml,
  // and replace it with our brand new announcementsHtml block.
  let html = data.contentHtml;
  
  const startMarker = '<div class="pg-category-view-desc">';
  const endMarker = '</div>\n<div id="pg-icons">';
  
  const startIndex = html.indexOf(startMarker);
  const endIndex = html.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    console.error('❌ Could not locate the pg-category-view-desc placeholders in menu_5_ceac.json');
    return;
  }
  
  const updatedHtml = html.substring(0, startIndex) + announcementsHtml + html.substring(endIndex + 6);
  
  data.contentHtml = updatedHtml;
  
  await fs.writeJson(CEAC_PATH, data, { spaces: 2 });
  console.log('🎉 Successfully updated content/menu_5_ceac.json with premium notices!');
}

updateCeac();

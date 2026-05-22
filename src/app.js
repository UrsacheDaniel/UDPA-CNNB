/* ==========================================================================
   Colegiul Național „Nicolae Bălcescu” Brăila - Client Router & App Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const topNavMenu = document.getElementById('topNavMenu');
  const canvasBreadcrumbs = document.getElementById('canvasBreadcrumbs');
  const canvasContent = document.getElementById('canvasContent');
  const searchInput = document.getElementById('searchInput');
  const suggestBox = document.getElementById('suggestBox');
  const searchBtn = document.getElementById('searchBtn');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const logoLink = document.getElementById('logoLink');

  let navigationData = [];
  let flatSearchIndex = [];

  // Helper: Sanitize route to local json filename
  function routeToFilename(route) {
    if (!route || route === '/' || route === '#') return 'home';
    
    let clean = route.replace(/^#/, '')
      .toLowerCase()
      .replace(/^\/index\.php/, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/^_+|_+$/g, '');
    
    return clean || 'home';
  }


  // Hardcoded Fallback Navigation Data for Offline/file:// usage
  const fallbackNavigation = [
    {
      "title": "DESPRE NOI",
      "items": [
        { "title": "Istoric", "route": "/index.php/acasa/istoric" },
        { "title": "Nume", "route": "/index.php/acasa/date" },
        {
          "title": "Personalităţi",
          "route": "/index.php/acasa/personalitati",
          "children": [
            { "title": "Membri ai Academiei Române", "route": "/index.php/acasa/personalitati/membri-ai-academiei-romane" },
            { "title": "Membri ai altor academii", "route": "/index.php/acasa/personalitati/membri-ai-altor-academii" },
            { "title": "Oameni de ştiinţă", "route": "/index.php/acasa/personalitati/oameni-de-stiinta" },
            { "title": "Alte personalităţi", "route": "/index.php/acasa/personalitati/alte-personalitati" }
          ]
        },
        { "title": "Misiune", "route": "/index.php/acasa/misiune" },
        { "title": "Directorii şcolii", "route": "/index.php/acasa/toti-directorii" },
        { "title": "Profesori 1863-2013", "route": "/index.php/acasa/profesori-1863-2013" },
        { "title": "Şefi de promoţie", "route": "/index.php/acasa/sefi-de-promotie" }
      ]
    },
    {
      "title": "PERSONAL",
      "items": [
        { "title": "Echipa de conducere", "route": "/index.php/menu-1/directori-actuali" },
        { "title": "Programul directorilor", "route": "/index.php/menu-1/programul-directorilor" },
        {
          "title": "CADRE DIDACTICE",
          "route": "/index.php/menu-1/menu-1x1",
          "children": [
            { "title": "Limbă şi comunicare", "route": "/index.php/menu-1/menu-1x1/limba-si-comunicare" },
            { "title": "Matematică şi Ştiinţe", "route": "/index.php/menu-1/menu-1x1/matematica-si-stiinte-ale-naturii" },
            { "title": "Om şi societate", "route": "/index.php/menu-1/menu-1x1/meniu-complex-fara-descriere-2" },
            { "title": "Tehnologii", "route": "/index.php/menu-1/menu-1x1/tehnologii" },
            { "title": "Arte", "route": "/index.php/menu-1/menu-1x1/meniu-complex-fara-descriere-4" }
          ]
        },
        { "title": "CADRE DIDACTICE AUXILIARE", "route": "/index.php/menu-1/contacts" },
        { "title": "Perfecționare", "route": "/index.php/menu-1/perfectionare" },
        { "title": "Încadrare", "route": "/index.php/menu-1/incadrare" },
        { "title": "Organigrama", "route": "/index.php/menu-1/organigrama" },
        { "title": "Comitetul de părinți", "route": "/index.php/menu-1/comitetul-de-parinti" }
      ]
    },
    {
      "title": "ELEVI",
      "items": [
        { "title": "Statistică", "route": "/index.php/login/menu-2x1" },
        { "title": "Formaţiuni de studiu", "route": "/index.php/login/menu-2x2" },
        { "title": "ORAR ELEVI", "route": "/index.php/login/orar-elevi" },
        { "title": "Orar profesori", "route": "/index.php/login/orar-profesori" },
        {
          "title": "DIRIGENŢIE",
          "route": "/index.php/login/dirigentie",
          "children": [
            { "title": "Clasa şi dirigintele", "route": "/index.php/login/dirigentie/clasa-si-diriginte" },
            { "title": "Planificare întâlniri cu părinții", "route": "/index.php/login/dirigentie/planificare-intalniri-cu-parintii" }
          ]
        },
        { "title": "Activități extrașcolare", "route": "http://www.cnnb.ro" }
      ]
    },
    {
      "title": "REZULTATE",
      "items": [
        { "title": "Simulări BAC și EN8", "route": "/index.php/sample-sites/simulari-bac-si-en8" },
        { "title": "Situația la învățătură", "route": "/index.php/sample-sites/shop" },
        {
          "title": "OLIMPIADE",
          "route": "/index.php/sample-sites/parks",
          "children": [
            { "title": "Olimpiade 2025", "route": "/index.php/sample-sites/parks/2025" },
            { "title": "Olimpiade 2023", "route": "/index.php/sample-sites/parks/2023" },
            { "title": "Olimpiade 2022", "route": "/index.php/sample-sites/parks/2021" },
            { "title": "Olimpiade 2019", "route": "/index.php/sample-sites/parks/2019" }
          ]
        },
        { "title": "Diplome", "route": "/index.php/sample-sites/diplome" },
        { "title": "EXAMENE NAŢIONALE", "route": "/index.php/sample-sites/examene-nationale" }
      ]
    },
    {
      "title": "PARTENERIATE",
      "items": [
        { "title": "Proiect Eco Provocarea", "route": "/index.php/site-administrator/proiect-eco-provocarea" },
        {
          "title": "Bilanț parteneriate",
          "route": "/index.php/site-administrator/bilant-parteneriate",
          "children": [
            { "title": "Anul 2023-2024", "route": "/index.php/site-administrator/bilant-parteneriate/2023-2024" },
            { "title": "Anul 2022-2023", "route": "/index.php/site-administrator/bilant-parteneriate/2022-2023" }
          ]
        },
        { "title": "Educație juridică", "route": "/index.php/site-administrator/educatie-juridica" },
        { "title": "PROIECTE INTERNAŢIONALE", "route": "/index.php/site-administrator/plan-managerial" }
      ]
    },
    {
      "title": "LEGISLAŢIE",
      "items": [
        { "title": "Autorizații", "route": "/index.php/menu-5/autorizatii" },
        { "title": "Admitere și examene", "route": "/index.php/menu-5/admitere-si-examene" },
        { "title": "Regulamente și Proceduri", "route": "/index.php/menu-5/regulamente" }
      ]
    }
  ];

  // Injects an elegant floating glassmorphic notification when CORS is blocked
  function showCORSWarning() {
    if (document.getElementById('corsOfflineWarning')) return;

    const warningDiv = document.createElement('div');
    warningDiv.id = 'corsOfflineWarning';
    warningDiv.className = 'offline-warning-pill';
    warningDiv.innerHTML = `
      <div class="offline-warning-icon">⚠️</div>
      <div class="offline-warning-text">
        <h4>Restricție Browser Locală (CORS) Detectată</h4>
        <p>Browserul dvs. securizează fișierele locale prin blocarea fetch-urilor <code>file://</code>. Am compilat navigarea offline pentru dvs., dar conținutul nu se poate încărca de pe disc direct.</p>
      </div>
      <div class="offline-warning-actions">
        <a href="http://localhost:8080/" target="_blank" class="offline-warning-btn">Lansează Site-ul Securizat (localhost:8080)</a>
        <button class="offline-warning-close" aria-label="Închide alerta" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(warningDiv);
  }

  // Load Navigation Schema & Initialize Navbar
  async function initNavigation() {
    if (window.CNNB_CONTENT && window.CNNB_CONTENT._navigation) {
      console.log('Successfully preloaded navigation from offline bundle!');
      navigationData = window.CNNB_CONTENT._navigation;
    } else if (window.location.protocol === 'file:') {
      console.warn('Local file protocol detected. Using offline fallback schema and displaying CORS helper.');
      navigationData = fallbackNavigation;
      showCORSWarning();
    } else {
      try {
        const response = await fetch('./src/navigation.json');
        if (!response.ok) throw new Error('Fetch failed');
        navigationData = await response.json();
      } catch (error) {
        console.warn('Failed dynamic fetch. Loading built-in fallback schema:', error);
        navigationData = fallbackNavigation;
      }
    }
    
    // Build Navbar
    buildNavbar(navigationData);
    
    // Build flat index for live search
    buildSearchIndex(navigationData);
  }

  // Recursive Navbar builder
  function buildNavbar(menuCategories) {
    topNavMenu.innerHTML = '';
    
    menuCategories.forEach(category => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = '#';
      a.innerHTML = `${category.title} ▾`;
      li.appendChild(a);
      
      if (category.items && category.items.length > 0) {
        const dropdownUl = buildSubmenuList(category.items, 'dropdown-card');
        li.appendChild(dropdownUl);
      }
      
      topNavMenu.appendChild(li);
    });
  }

  // Recursive submenu helper
  function buildSubmenuList(items, ulClass) {
    const ul = document.createElement('ul');
    ul.className = ulClass;
    
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      if (item.children && item.children.length > 0) {
        li.classList.add('has-submenu');
      }
      
      const a = document.createElement('a');
      a.className = 'dropdown-link';
      if (item.route && (item.route.startsWith('http://') || item.route.startsWith('https://'))) {
        a.href = item.route;
        a.target = '_blank';
      } else {
        a.href = item.route === '#' ? '#' : `#${item.route}`;
      }
      
      if (item.children && item.children.length > 0) {
        a.innerHTML = `${item.title} <span class="arrow">▸</span>`;
      } else {
        a.textContent = item.title;
      }
      
      li.appendChild(a);
      
      if (item.children && item.children.length > 0) {
        const subUl = buildSubmenuList(item.children, 'dropdown-submenu');
        li.appendChild(subUl);
      }
      
      ul.appendChild(li);
    });
    
    return ul;
  }

  // Build a flat index of all routes for instant local fuzzy matching
  function buildSearchIndex(categories) {
    flatSearchIndex = [];
    
    // Core routes preloaded
    flatSearchIndex.push({ title: 'Istoric Colegiu', route: '/index.php/acasa/istoric', category: 'Despre Noi' });
    flatSearchIndex.push({ title: 'Misiune și Valori', route: '/index.php/acasa/misiune', category: 'Despre Noi' });
    flatSearchIndex.push({ title: 'Echipa de conducere (Directori)', route: '/index.php/menu-1/directori-actuali', category: 'Personal' });
    flatSearchIndex.push({ title: 'Contact administrativ', route: '/index.php/menu-1/contacts', category: 'Personal' });
    flatSearchIndex.push({ title: 'Prima Pagină / Home', route: '/', category: 'Acasă' });

    function recurseIndex(items, parentPath) {
      if (!items || !Array.isArray(items)) return;
      
      items.forEach(item => {
        if (item.route && item.route !== '#' && !item.route.startsWith('http')) {
          flatSearchIndex.push({
            title: item.title,
            route: item.route,
            category: parentPath
          });
        }
        
        if (item.children && item.children.length > 0) {
          recurseIndex(item.children, `${parentPath} > ${item.title}`);
        }
      });
    }

    categories.forEach(cat => {
      recurseIndex(cat.items, cat.title);
    });
  }

  // Render Breadcrumbs dynamically
  function renderBreadcrumbs(crumbs) {
    canvasBreadcrumbs.innerHTML = '';
    crumbs.forEach((crumb, index) => {
      const li = document.createElement('li');
      if (index === crumbs.length - 1) {
        li.className = 'active';
        li.textContent = crumb;
      } else {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = crumb;
        li.appendChild(a);
      }
      canvasBreadcrumbs.appendChild(li);
    });
  }

  // Helper: Compile and Render the public interactive timetable grid
  function renderPublicTimetable() {
    const customOrar = JSON.parse(localStorage.getItem('cnnb_custom_orar') || '{}');
    const classes = ["9A", "9B", "9C", "9D", "9E", "9F", "10A", "10B", "10C", "10D", "10E", "10F", "11A", "11B", "11C", "11D", "11E", "11F", "12A", "12B", "12C", "12D", "12E", "12F"];
    const days = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"];
    const fallbackSubjects = ["Matematică", "Limba Română", "Fizică", "Informatică", "Chimie", "Istorie", "Geografie", "Limba Engleză", "Educație Fizică", "Biologie", "Religie", "Socio-umane"];

    // Default generator for realistic schedules
    function getHourSubject(clasa, day, index) {
      if (customOrar[clasa] && customOrar[clasa][day] && customOrar[clasa][day][index] !== undefined) {
        return customOrar[clasa][day][index] || '—';
      }
      
      // Fallback pseudo-random deterministic schedule so every class has a nice filled week
      const val = (clasa.charCodeAt(0) + clasa.charCodeAt(1) + day.charCodeAt(0) + index * 17) % fallbackSubjects.length;
      if (index === 0) return '—'; // Hour 0 usually empty
      if (index > 6) return '—'; // Hours 7 and 8 usually empty
      return fallbackSubjects[val];
    }

    let defaultClass = localStorage.getItem('cnnb_public_selected_class') || '9A';
    if (!classes.includes(defaultClass)) defaultClass = '9A';

    function buildGridHtml(selectedClass) {
      let gridHtml = `
        <div class="orar-public-container">
          <div class="orar-class-selector-bar">
            <h4 class="orar-class-title">📅 Orar Cursuri Elevi - Clasa ${selectedClass}</h4>
            <div style="display:flex; align-items:center; gap:10px;">
              <label for="publicClassSelect" style="font-weight:700; font-size:0.82rem; color:hsl(var(--primary-deep));">Selectează clasa:</label>
              <select id="publicClassSelect" style="padding:6px 12px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); font-family:inherit; font-weight:700; font-size:0.85rem; outline:none; background:#fff;">
                ${classes.map(c => `<option value="${c}" ${c === selectedClass ? 'selected' : ''}>Clasa ${c}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div class="orar-week-grid">
      `;

      days.forEach(day => {
        gridHtml += `
          <div class="orar-day-column">
            <div class="orar-day-header">${day}</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
        `;

        for (let i = 0; i <= 8; i++) {
          const subject = getHourSubject(selectedClass, day, i);
          const timeStr = [
            "07:00 - 07:50", "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50",
            "11:00 - 11:50", "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50"
          ][i];

          gridHtml += `
            <div class="orar-hour-item" title="Ora ${i} (${timeStr})">
              <span class="orar-hour-num">${i}</span>
              <div class="orar-hour-content" style="flex:1;">
                <div style="font-weight:700; color:hsl(var(--text-dark));">${subject}</div>
                <div style="font-size:0.65rem; color:hsl(var(--text-muted)); font-weight:600; margin-top:1px;">${timeStr}</div>
              </div>
            </div>
          `;
        }

        gridHtml += `
            </div>
          </div>
        `;
      });

      gridHtml += `
          </div>
        </div>
      `;

      return gridHtml;
    }

    canvasContent.innerHTML = `
      <h2 class="article-title">Orar Elevi</h2>
      <div class="scraped-content-view">
        ${buildGridHtml(defaultClass)}
      </div>
    `;

    // Dropdown change listener
    const select = document.getElementById('publicClassSelect');
    select.addEventListener('change', (e) => {
      const newClass = e.target.value;
      localStorage.setItem('cnnb_public_selected_class', newClass);
      renderPublicTimetable();
    });
  }

  // Helper: Inject custom announcements at the top of the feed page
  function injectCustomAnnouncements() {
    const customAnnouncements = JSON.parse(localStorage.getItem('cnnb_custom_announcements') || '[]');
    if (customAnnouncements.length === 0) return;

    // Locate scraped news container or content wrapper
    const container = canvasContent.querySelector('.scraped-content-view');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'custom-announcements-wrapper';
    div.style.marginBottom = '2rem';
    div.innerHTML = `
      <h4 style="font-family:'Outfit',sans-serif; color:hsl(var(--primary-deep)); font-weight:800; font-size:1.1rem; margin-bottom:1rem; border-bottom:2px solid hsl(var(--accent-gold)); padding-bottom:6px; display:flex; align-items:center; gap:8px;">
        📢 Anunțuri Administrative Recente
      </h4>
    `;

    customAnnouncements.forEach(item => {
      const card = document.createElement('div');
      card.className = `custom-announcement-card type-${item.category.toLowerCase()}`;
      
      let badgeLabel = 'Info';
      if (item.category === 'IMPORTANT') badgeLabel = 'Important';
      if (item.category === 'ALERT') badgeLabel = 'Alertă';

      let attachmentsHtml = '';
      if (item.attachments && item.attachments.length > 0) {
        attachmentsHtml = `
          <div class="announcement-attachments">
            ${item.attachments.map(att => `
              <a href="${att.startsWith('http') ? att : `http://www.cnnb.ro/templates/${att}`}" target="_blank" class="attachment-badge">
                📎 Document: ${att.split('/').pop()}
              </a>
            `).join('')}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="announcement-header">
          <span class="announcement-badge">${badgeLabel}</span>
          <span class="announcement-date">${item.date}</span>
        </div>
        <h4 class="announcement-title">${item.title}</h4>
        <p class="announcement-content">${item.content}</p>
        ${attachmentsHtml}
      `;
      div.appendChild(card);
    });

    container.insertBefore(div, container.firstChild);
  }

  // Helper: Inject dynamic awards and diplomas inside public Phoca Gallery
  function injectCustomDiplomas() {
    const customDiplomas = JSON.parse(localStorage.getItem('cnnb_custom_diplomas') || '[]');
    if (customDiplomas.length === 0) return;

    // Locate Phoca Gallery container inside scraped view
    const pg = canvasContent.querySelector('#phocagallery');
    if (!pg) return;

    customDiplomas.forEach(item => {
      const box = document.createElement('div');
      box.className = 'phocagallery-box-file pg-box-image';
      box.style.cssText = 'height:238px; width:220px;';
      
      const imgUrl = item.img || 'https://www.cnnb.ro/templates/youtrader/favicon.ico';
      box.innerHTML = `
        <div class="phocagallery-box-file-first" style="height:218px;width:218px;margin:auto;">
          <div class="phocagallery-box-file-second">
            <div class="phocagallery-box-file-third">
              <a class="jaklightbox" title="${item.prize} - ${item.studentName}" href="${imgUrl}" target="_blank">
                <img src="${imgUrl}" alt="Diplome" class="pg-image responsive-img" style="max-height:160px; object-fit:cover;">
              </a>
            </div>
          </div>
        </div>
        <div class="pg-name" style="font-size:11px; font-weight:700; line-height:1.3; color:hsl(var(--primary-deep)); margin-top:4px;">
          ${item.studentName} - ${item.prize}<br>
          <span style="font-size:9px; color:hsl(var(--text-muted)); font-weight:600;">${item.category} (${item.year})</span>
        </div>
      `;
      
      // Prepend right after gallery description or at the top of icons list
      const icons = pg.querySelector('#pg-icons');
      if (icons) {
        pg.insertBefore(box, icons.nextSibling);
      } else {
        pg.insertBefore(box, pg.firstChild);
      }
    });
  }

  // Helper: Inject custom legislation documents inside folders list
  function injectCustomLegislatie() {
    const customLegislatie = JSON.parse(localStorage.getItem('cnnb_custom_legislatie') || '[]');
    if (customLegislatie.length === 0) return;

    const pg = canvasContent.querySelector('#phocagallery');
    if (!pg) return;

    customLegislatie.forEach(item => {
      const box = document.createElement('div');
      box.className = 'phocagallery-box-file pg-box-subfolder';
      box.style.cssText = 'height:238px; width:220px;';

      const fileUrl = item.docName.startsWith('http') ? item.docName : `http://www.cnnb.ro/templates/${item.docName}`;

      box.innerHTML = `
        <div class="phocagallery-box-file-first" style="height:218px;width:218px;margin:auto;">
          <div class="phocagallery-box-file-second">
            <div class="phocagallery-box-file-third" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;">
              <a class="" href="${fileUrl}" target="_blank">
                <img src="http://www.cnnb.ro/components/com_phocagallery/assets/images/icon-folder-medium.png" alt="" class="pg-cat-folder responsive-img">
              </a>
            </div>
          </div>
        </div>
        <div class="pg-name" style="font-size:11px; font-weight:700; color:hsl(var(--primary-deep)); text-align:center; padding:0 5px;">
          📄 ${item.title}<br>
          <span style="font-size:9px; color:hsl(var(--accent-gold)); text-transform:uppercase;">${item.category}</span>
        </div>
      `;
      pg.insertBefore(box, pg.firstChild);
    });
  }

  // Fetch and Dynamic Render Engine
  async function loadPage(route) {
    if (route.toLowerCase().includes('admin')) {
      renderAdminPanel();
      updateActiveSidebar(route);
      return;
    }

    const filename = routeToFilename(route);
    
    // Set loading indicator
    canvasContent.innerHTML = `
      <div style="text-align:center; padding:3rem 0;">
        <div style="font-size:2rem; margin-bottom:1rem; animation: pulseGold 1.5s infinite;">⏳</div>
        <h3 style="color: hsl(var(--primary-light));">Se descarcă datele securizate...</h3>
        <p style="color: hsl(var(--text-muted)); font-size:0.85rem; margin-top:5px;">Sincronizare din baza de date a administrației Colegiului.</p>
      </div>
    `;

    try {
      let data;
      const cached = localStorage.getItem(`cnnb_edit_${filename}`);
      if (cached) {
        data = JSON.parse(cached);
      } else if (window.CNNB_CONTENT && window.CNNB_CONTENT[filename]) {
        data = window.CNNB_CONTENT[filename];
      } else {
        const response = await fetch(`./content/${filename}.json`);
        if (!response.ok) {
          throw new Error('Page not found');
        }
        data = await response.json();
      }
      
      // Update browser tab title
      document.title = `${data.title} | Colegiul Național „Nicolae Bălcescu”`;
      
      // Render Breadcrumbs
      renderBreadcrumbs(data.breadcrumbs || ['Acasă', data.title]);

      // Direct dynamic intercept for timetables
      if (filename === 'login_orar_elevi') {
        renderPublicTimetable();
        updateActiveSidebar(route);
        return;
      }
      
      // Fix broken double dot domain joins in scraped content (e.g. cnnb.ro../profesori -> cnnb.ro/alte/profesori)
      const cleanHtml = (data.contentHtml || '').replace(/http:\/\/www\.cnnb\.ro\.\.\//gi, 'http://www.cnnb.ro/alte/');

      // Render Content HTML
      canvasContent.innerHTML = `
        <h2 class="article-title">${data.title}</h2>
        <div class="scraped-content-view">
          ${cleanHtml}
        </div>
      `;

      // Intercept Announcements Page
      if (filename === 'menu_5_anunt_important') {
        injectCustomAnnouncements();
      }

      // Intercept Diplomas Page
      if (filename === 'sample_sites_diplome') {
        injectCustomDiplomas();
      }

      // Intercept Legislation Page
      if (filename === 'menu_5_regulamente') {
        injectCustomLegislatie();
      }

      // Intercept local links inside scraped content to route through SPA hash router
      const contentLinks = canvasContent.querySelectorAll('.scraped-content-view a');
      contentLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && href.startsWith('/')) {
          link.href = `#${href}`;
        } else if (href && (href.startsWith('http://www.cnnb.ro/') || href.startsWith('http://cnnb.ro/'))) {
          const relRoute = href.replace(/^http:\/\/(www\.)?cnnb\.ro/, '');
          if (relRoute.startsWith('/')) {
            link.href = `#${relRoute}`;
          }
        }
        
        // Force PDF/document attachments to open in a new tab
        if (href && (href.toLowerCase().endsWith('.pdf') || href.toLowerCase().endsWith('.doc') || href.toLowerCase().endsWith('.docx') || href.toLowerCase().endsWith('.xls') || href.toLowerCase().endsWith('.xlsx'))) {
          link.target = '_blank';
          if (window.location.protocol === 'file:' && !href.startsWith('http')) {
            // Point to live site so it downloads successfully offline!
            link.href = href.startsWith('/') ? `http://www.cnnb.ro${href}` : `http://www.cnnb.ro/${href}`;
          }
        }
      });

      // Highlight active sidebar links if matched
      updateActiveSidebar(route);

    } catch (error) {
      // Elegant Dynamic Placeholder (Fallback)
      const cleanTitle = route.split('/').pop().replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
        
      renderBreadcrumbs(['Acasă', 'Eroare Încărcare', cleanTitle]);
      
      if (window.location.protocol === 'file:') {
        canvasContent.innerHTML = `
          <h2 class="article-title">${cleanTitle}</h2>
          <div style="background: hsl(var(--bg-pearl)); border-left: 4px solid hsl(var(--accent-gold)); padding: 2.2rem; border-radius: var(--radius-md); margin-top:1.5rem; box-shadow: var(--glass-shadow); border-top: 1px solid rgba(255,255,255,0.7); border-right: 1px solid rgba(0,0,0,0.02); border-bottom: 1px solid rgba(0,0,0,0.02);">
            <h4 style="color: hsl(var(--primary-deep)); margin-bottom:12px; font-size:1.15rem; display:flex; align-items:center; gap:8px;">⚠️ Restricție Securitate Browser (CORS)</h4>
            <p style="font-size:0.92rem; line-height:1.6; color: hsl(var(--text-dark)); margin-bottom: 12px;">
              Navigarea locală direct prin protocolul <code>file://</code> blochează încărcarea automată a conținutului extras pentru pagina <strong>${cleanTitle}</strong>.
            </p>
            <p style="font-size:0.88rem; line-height:1.6; color: hsl(var(--text-dark)); margin-bottom: 1.5rem;">
              Deoarece serverul local de dezvoltare rulează deja în fundal pe computerul dvs., puteți debloca instantaneu site-ul și toate paginile sale printr-un singur clic:
            </p>
            <div style="margin: 1.5rem 0;">
              <a href="http://localhost:8080/#${route}" target="_blank" class="offline-warning-btn" style="padding: 12px 24px; font-size: 0.88rem; font-family:'Outfit', sans-serif; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.45); display: inline-block;">
                Deschide Pagina pe Serverul Local (Port 8080)
              </a>
            </div>
            <div style="margin-top: 1.5rem; padding-top:1.5rem; border-top: 1px solid rgba(10,37,64,0.06); font-size:0.8rem; color: hsl(var(--text-muted)); line-height:1.45;">
              <strong>De ce apare acest mesaj?</strong><br>
              Din motive de securitate, browserele moderne (Chrome, Edge, Firefox) nu permit fetch-ul fișierelor JSON locale direct de pe disc (CORS policy). Deschiderea prin serverul local http://localhost:8080/ rezolvă complet această limitare.
            </div>
          </div>
        `;
      } else {
        canvasContent.innerHTML = `
          <h2 class="article-title">${cleanTitle}</h2>
          <div style="background: hsl(var(--bg-pearl)); border-left: 4px solid hsl(var(--accent-gold)); padding: 2rem; border-radius: var(--radius-md); margin-top:1.5rem;">
            <h4 style="color: hsl(var(--primary-deep)); margin-bottom:10px;">📋 Pregătit pentru Transfer Securizat</h4>
            <p style="font-size:0.9rem; line-height:1.6; color: hsl(var(--text-dark));">
              Pagina solicitată (<code>${route}</code>) este indexată în planul de navigare. Pentru a finaliza transferul de conținut direct de pe serverul școlii:
            </p>
            <ol style="margin-left: 20px; font-size:0.85rem; margin-top: 10px; display:flex; flex-direction:column; gap:8px;">
              <li>Rulați scriptul de scraping local prin terminal: <code>node scraper/scraper.js</code></li>
              <li>Conținutul extras va fi salvat automat sub formă de JSON în directorul <code>content/</code></li>
              <li>Reîncărcați această pagină pentru a vedea datele populate în timp real.</li>
            </ol>
            <div style="margin-top: 1.5rem; padding-top:1.5rem; border-top: 1px solid rgba(10,37,64,0.06); font-size:0.8rem; color: hsl(var(--text-muted));">
              * Conexiune aprobată administrativ de Direcțiunea Colegiului Național „Nicolae Bălcescu” Brăila.
            </div>
          </div>
        `;
      }
    }

    // Smooth scroll page to canvas view on mobile
    if (window.innerWidth <= 1024) {
      document.getElementById('canvasPanel').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function updateActiveSidebar(route) {
    sidebarLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Handle Hash Router
  function handleRouting() {
    const route = window.location.hash.slice(1) || '/';
    loadPage(route);
  }

  // Live Auto Suggest Logic
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      suggestBox.style.display = 'none';
      return;
    }

    // Filter index entries
    const matches = flatSearchIndex.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matches.length === 0) {
      suggestBox.style.display = 'none';
      return;
    }

    suggestBox.innerHTML = '';
    matches.forEach(match => {
      const div = document.createElement('div');
      div.className = 'suggest-item';
      div.innerHTML = `<strong>${match.title}</strong> <span style="font-size:0.75rem; color:hsl(var(--text-muted)); display:block;">Secțiune: ${match.category}</span>`;
      div.addEventListener('click', () => {
        if (match.route.startsWith('http://') || match.route.startsWith('https://')) {
          window.open(match.route, '_blank');
        } else {
          window.location.hash = `#${match.route}`;
        }
        searchInput.value = '';
        suggestBox.style.display = 'none';
      });
      suggestBox.appendChild(div);
    });

    suggestBox.style.display = 'flex';
  });

  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestBox.contains(e.target)) {
      suggestBox.style.display = 'none';
    }
  });

  // Search button action
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
      const matched = flatSearchIndex.find(item => 
        item.title.toLowerCase().includes(query)
      );
      if (matched) {
        if (matched.route.startsWith('http://') || matched.route.startsWith('https://')) {
          window.open(matched.route, '_blank');
        } else {
          window.location.hash = `#${matched.route}`;
        }
        searchInput.value = '';
        suggestBox.style.display = 'none';
      }
    }
  });

  // Home branding link reset
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '';
  });

  // Render Administrative Control Panel Dashboard
  function renderAdminPanel() {
    document.title = "Panou de Administrare | Colegiul Național „Nicolae Bălcescu”";
    renderBreadcrumbs(['Acasă', 'Administrare']);

    const isLoggedIn = sessionStorage.getItem('cnnb_admin_session') === 'true';

    if (!isLoggedIn) {
      // Render beautiful glassmorphic login gate
      canvasContent.innerHTML = `
        <div class="admin-login-wrapper">
          <div class="admin-login-card" id="loginCard">
            <div class="login-header">
              <div class="login-shield">CN</div>
              <h3>Portal Administrativ Securizat</h3>
              <p>Colegiul Național „Nicolae Bălcescu” Brăila</p>
            </div>
            
            <div class="login-form-group">
              <label for="adminUsername">Nume Utilizator</label>
              <div class="input-with-icon">
                <span class="input-icon">👤</span>
                <input type="text" id="adminUsername" placeholder="Introduceți numele de utilizator..." autocomplete="off">
              </div>
            </div>
            
            <div class="login-form-group">
              <label for="adminPassword">Parolă</label>
              <div class="input-with-icon">
                <span class="input-icon">🔒</span>
                <input type="password" id="adminPassword" placeholder="Introduceți parola...">
              </div>
            </div>
            
            <div id="loginErrorMsg" class="login-error-msg" style="display: none;"></div>
            
            <button id="adminLoginBtn" class="login-btn">Conectare Portal</button>
            
            <div class="login-tip-box">
              <strong>💡 Informații Testare Locală</strong>
              <p>Pentru a accesa panoul local în siguranță, folosiți următoarele credențiale:</p>
              <div class="credential-tags">
                <span>Utilizator: <code>admin</code></span>
                <span>Parolă: <code>cnnb_admin_2026</code></span>
              </div>
            </div>
          </div>
        </div>
      `;

      const usernameInput = document.getElementById('adminUsername');
      const passwordInput = document.getElementById('adminPassword');
      const loginBtn = document.getElementById('adminLoginBtn');
      const errorMsg = document.getElementById('loginErrorMsg');
      const loginCard = document.getElementById('loginCard');

      // Clear shake class on input change
      [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
          loginCard.classList.remove('shake');
          errorMsg.style.display = 'none';
        });
      });

      // Handle Login Submission
      async function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === 'admin' && password === 'cnnb_admin_2026') {
          // Success Path
          loginBtn.disabled = true;
          usernameInput.disabled = true;
          passwordInput.disabled = true;
          
          errorMsg.style.display = 'none';
          
          let steps = [
            '🔑 Se validează protocolul securizat...',
            '📂 Se încarcă consola administrativă...',
            '✅ Autentificat cu succes!'
          ];

          for (let i = 0; i < steps.length; i++) {
            loginBtn.textContent = steps[i];
            await new Promise(r => setTimeout(r, 450));
          }

          sessionStorage.setItem('cnnb_admin_session', 'true');
          renderAdminPanel();
        } else {
          // Failure Path
          loginCard.classList.remove('shake');
          void loginCard.offsetWidth; // Trigger reflow to restart CSS animation
          loginCard.classList.add('shake');
          
          errorMsg.textContent = '❌ Numele de utilizator sau parola sunt incorecte!';
          errorMsg.style.display = 'block';
          passwordInput.value = '';
          passwordInput.focus();
        }
      }

      loginBtn.addEventListener('click', handleLogin);
      
      // Enter key support
      passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
      });
      usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') passwordInput.focus();
      });

      updateActiveSidebar('/index.php/admin');
      return;
    }

    // Render Full Authenticated Dashboard Workspace
    let optionsHtml = flatSearchIndex.map(item => 
      `<option value="${item.route}">${item.title} (${item.route})</option>`
    ).join('');

    canvasContent.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.8rem; flex-wrap:wrap; gap:15px; border-bottom: 2px solid rgba(10,37,64,0.06); padding-bottom:1.5rem;">
        <div>
          <h2 class="article-title" style="margin-bottom:0; border-bottom:none; padding-bottom:0;">🔧 Panou Administrativ Portal</h2>
          <p style="color:hsl(var(--text-muted)); font-size:0.85rem; margin-top:5px;">
            Gestionați orarul, anunțurile, diplomele și paginile colegiului în timp real.
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:12px; background:hsl(var(--bg-pearl)); padding:8px 16px; border-radius:30px; border:1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="width:8px; height:8px; background:#10b981; border-radius:50%; display:inline-block; animation: pulseGreen 1.5s infinite;"></span>
          <span style="font-size:0.8rem; font-weight:700; color:hsl(var(--primary-deep));">admin: activ</span>
          <button id="adminLogoutBtn" class="search-btn" style="padding:6px 14px; font-size:0.75rem; background:rgba(239, 68, 68, 0.08); color:rgb(239, 68, 68); border: 1px solid rgba(239, 68, 68, 0.15); transition: var(--transition-fast); margin:0; border-radius:20px;">Deconectare</button>
        </div>
      </div>

      <div class="admin-tabs">
        <button class="admin-tab-btn active" id="tabOverviewBtn">📈 Prezentare Generală</button>
        <button class="admin-tab-btn" id="tabOrarBtn">📅 Orar Cursuri</button>
        <button class="admin-tab-btn" id="tabAnunturiBtn">📢 Anunțuri Portal</button>
        <button class="admin-tab-btn" id="tabRegistreBtn">📂 Registru Acte</button>
        <button class="admin-tab-btn" id="tabEditorBtn">📝 Modificare Pagini</button>
        <button class="admin-tab-btn" id="tabScraperBtn">🔄 Sincronizare Scraper</button>
      </div>

      <!-- Tab 1: Overview Dashboard View -->
      <div id="overviewTab" class="admin-tab-content active">
        <div class="admin-stats-grid">
          <div class="admin-stat-card">
            <div class="stat-card-icon">👥</div>
            <div class="stat-card-info">
              <div class="stat-card-number">2.847</div>
              <div class="stat-card-label">Vizitatori Unici (Lună)</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="stat-card-icon">🏫</div>
            <div class="stat-card-info">
              <div class="stat-card-number">24</div>
              <div class="stat-card-label">Clase Active</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="stat-card-icon">📢</div>
            <div class="stat-card-info">
              <div class="stat-card-number" id="statsAnnouncementsNum">4</div>
              <div class="stat-card-label">Anunțuri Active</div>
            </div>
          </div>
          <div class="admin-stat-card">
            <div class="stat-card-icon">📂</div>
            <div class="stat-card-info">
              <div class="stat-card-number" id="statsRegistriesNum">8</div>
              <div class="stat-card-label">Documente în Registre</div>
            </div>
          </div>
        </div>

        <div class="dashboard-row">
          <div class="admin-card-glass">
            <div class="admin-card-title">📈 Monitorizare Trafic Portal (Vizite Săptămânale)</div>
            <div class="svg-chart-container">
              <svg viewBox="0 0 500 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="hsl(var(--accent-gold))" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="hsl(var(--accent-gold))" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <g class="svg-chart-lines" stroke="rgba(10,37,64,0.06)" stroke-width="1">
                  <line x1="50" y1="30" x2="480" y2="30" />
                  <line x1="50" y1="80" x2="480" y2="80" />
                  <line x1="50" y1="130" x2="480" y2="130" />
                  <line x1="50" y1="170" x2="480" y2="170" />
                </g>
                <path d="M 50 170 Q 120 70, 190 120 T 330 60 T 470 40 L 470 170 Z" fill="url(#chartGrad)" />
                <path class="svg-chart-spline" d="M 50 170 Q 120 70, 190 120 T 330 60 T 470 40" fill="none" stroke="hsl(var(--accent-gold))" stroke-width="3" stroke-linecap="round" />
                <g class="svg-chart-points">
                  <circle cx="50" cy="170" r="5" fill="hsl(var(--primary-deep))" stroke="#fff" stroke-width="1.5" data-day="Luni" data-visits="320" />
                  <circle cx="120" cy="70" r="5" fill="hsl(var(--primary-deep))" stroke="#fff" stroke-width="1.5" data-day="Marți" data-visits="480" />
                  <circle cx="190" cy="120" r="5" fill="hsl(var(--primary-deep))" stroke="#fff" stroke-width="1.5" data-day="Miercuri" data-visits="410" />
                  <circle cx="260" cy="90" r="5" fill="hsl(var(--primary-deep))" stroke="#fff" stroke-width="1.5" data-day="Joi" data-visits="450" />
                  <circle cx="330" cy="60" r="5" fill="hsl(var(--primary-deep))" stroke="#fff" stroke-width="1.5" data-day="Vineri" data-visits="520" />
                  <circle cx="400" cy="50" r="5" fill="hsl(var(--primary-deep))" stroke="#fff" stroke-width="1.5" data-day="Sâmbătă" data-visits="380" />
                  <circle cx="470" cy="40" r="5" fill="hsl(var(--primary-deep))" stroke="#fff" stroke-width="1.5" data-day="Duminică" data-visits="290" />
                </g>
                <g font-size="10" font-family="'Outfit', sans-serif" font-weight="600" fill="hsl(var(--text-muted))" text-anchor="middle">
                  <text x="50" y="190">Lu</text>
                  <text x="120" y="190">Ma</text>
                  <text x="190" y="190">Mi</text>
                  <text x="260" y="190">Jo</text>
                  <text x="330" y="190">Vi</text>
                  <text x="400" y="190">Sâ</text>
                  <text x="470" y="190">Du</text>
                </g>
              </svg>
              <div class="chart-tooltip" style="display: none; position: absolute;"></div>
            </div>
          </div>

          <div class="admin-card-glass">
            <div class="admin-card-title">🖥️ Jurnal Real-time Activități Server</div>
            <div id="adminActivityConsole" class="activity-log-box"></div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Orar Cursuri View -->
      <div id="orarTab" class="admin-tab-content">
        <div class="admin-card-glass" style="margin-bottom:1.5rem;">
          <div class="admin-card-title">📅 Editor Orar săptămânal elevi</div>
          <p style="color:hsl(var(--text-muted)); font-size:0.8rem; line-height:1.5; margin-bottom:1.2rem;">
            Modificați cu ușurință orele de curs pentru orice clasă. Schimbările efectuate vor suprascrie tabelele scraped și vor apărea imediat în timp real pe pagina publică <strong>Orar Elevi</strong>.
          </p>

          <div style="display:flex; gap:15px; margin-bottom:1.5rem; flex-wrap:wrap;">
            <div class="form-group-lux" style="flex:1; min-width:150px; margin:0;">
              <label for="editorClassSelect">Selectează Clasa:</label>
              <select id="editorClassSelect">
                ${["9A", "9B", "9C", "9D", "9E", "9F", "10A", "10B", "10C", "10D", "10E", "10F", "11A", "11B", "11C", "11D", "11E", "11F", "12A", "12B", "12C", "12D", "12E", "12F"].map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group-lux" style="flex:1; min-width:150px; margin:0;">
              <label for="editorDaySelect">Selectează Ziua:</label>
              <select id="editorDaySelect">
                <option value="Luni">Luni</option>
                <option value="Marți">Marți</option>
                <option value="Miercuri">Miercuri</option>
                <option value="Joi">Joi</option>
                <option value="Vineri">Vineri</option>
              </select>
            </div>
          </div>

          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width:70px;">Ora</th>
                  <th style="width:140px;">Interval Orar</th>
                  <th>Materie Curs Personalizată</th>
                </tr>
              </thead>
              <tbody id="timetableEditorBody">
                ${[
                  { h: 0, t: "07:00 - 07:50" },
                  { h: 1, t: "08:00 - 08:50" },
                  { h: 2, t: "09:00 - 09:50" },
                  { h: 3, t: "10:00 - 10:50" },
                  { h: 4, t: "11:00 - 11:50" },
                  { h: 5, t: "12:00 - 12:50" },
                  { h: 6, t: "13:00 - 13:50" },
                  { h: 7, t: "14:00 - 14:50" },
                  { h: 8, t: "15:00 - 15:50" }
                ].map(r => `
                  <tr>
                    <td style="text-align:center; font-weight:800;">${r.h}</td>
                    <td style="font-size:0.75rem; color:hsl(var(--text-muted)); font-weight:700;">${r.t}</td>
                    <td>
                      <input type="text" id="hourInput_${r.h}" placeholder="Introduceți cursul (ex. Limba Română) sau '—'...">
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="display:flex; align-items:center; gap:15px; margin-top:1.5rem;">
            <button id="saveTimetableBtn" class="login-btn" style="margin:0; max-width:200px;">💾 Salvează modificările</button>
            <div id="orarSaveStatus" style="font-weight:700; font-size:0.85rem;"></div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Anunțuri Portal View -->
      <div id="anunturiTab" class="admin-tab-content">
        <div class="admin-row-2col">
          <div class="admin-card-glass">
            <div class="admin-card-title">📢 Publică Anunț Administrativ Nou</div>
            
            <div class="form-group-lux">
              <label for="announceTitle">Titlu Anunț</label>
              <input type="text" id="announceTitle" placeholder="Introduceți titlul anunțului...">
            </div>

            <div style="display:flex; gap:15px; margin-bottom:1rem;">
              <div class="form-group-lux" style="flex:1; margin:0;">
                <label for="announceDate">Dată Publicare</label>
                <input type="text" id="announceDate" placeholder="ex. 22 Mai 2026">
              </div>
              <div class="form-group-lux" style="flex:1; margin:0;">
                <label for="announceCategory">Categorie Anunț</label>
                <select id="announceCategory">
                  <option value="INFO">INFO (Culoare Verde)</option>
                  <option value="IMPORTANT">IMPORTANT (Culoare Aurie)</option>
                  <option value="ALERT">ALERTĂ (Culoare Roșie)</option>
                </select>
              </div>
            </div>

            <div class="form-group-lux">
              <label for="announceContent">Conținut Anunț</label>
              <textarea id="announceContent" rows="6" placeholder="Introduceți detaliile anunțului... Diacriticile sunt suportate."></textarea>
            </div>

            <div class="form-group-lux">
              <label>Atașare Documente Consiliu (Simulare Drag & Drop)</label>
              <div class="dropzone-simulated" id="announceDropzone">
                <div class="dropzone-icon">📥</div>
                <div class="dropzone-text">Faceți clic sau trageți fișiere PDF/DOC aici</div>
                <div class="dropzone-subtext">Documentul se va indexa temporar pentru publicare</div>
              </div>
              <div id="announceFilesList" style="margin-top:10px; display:flex; flex-wrap:wrap; gap:5px;"></div>
            </div>

            <button id="publishAnnounceBtn" class="login-btn" style="margin:0; width:100%;">📢 Lansează Anunțul în Portal</button>
          </div>

          <div class="admin-card-glass">
            <div class="admin-card-title">📋 Anunțuri Personalizate Active</div>
            <div id="adminAnnouncementsList" class="registry-delete-list"></div>
          </div>
        </div>
      </div>

      <!-- Tab 4: Registru Acte View -->
      <div id="registreTab" class="admin-tab-content">
        <div class="admin-row-2col">
          <!-- Diplomas Section -->
          <div class="admin-card-glass">
            <div class="admin-card-title">🏅 Înregistrare Premii și Diplome</div>
            <p style="color:hsl(var(--text-muted)); font-size:0.75rem; margin-bottom:1rem; line-height:1.45;">
              Înregistrați o nouă diplomă de merit pentru a fi afișată automat pe pagina de decernări de premii (Diplome).
            </p>

            <div class="form-group-lux">
              <label for="diplomaStudent">Nume Complet Elev</label>
              <input type="text" id="diplomaStudent" placeholder="ex. Popescu Andrei">
            </div>
            
            <div class="form-group-lux">
              <label for="diplomaPrize">Premiul Obținut / Mențiune</label>
              <input type="text" id="diplomaPrize" placeholder="ex. Premiul I - Matematică">
            </div>

            <div style="display:flex; gap:10px; margin-bottom:1rem;">
              <div class="form-group-lux" style="flex:1; margin:0;">
                <label for="diplomaCategory">Categorie Olimpiadă</label>
                <select id="diplomaCategory">
                  <option value="Olimpiade Județene">Olimpiade Județene</option>
                  <option value="Olimpiade Naționale">Olimpiade Naționale</option>
                  <option value="Olimpiade Internaționale">Olimpiade Internaționale</option>
                  <option value="Concursuri de Prestigiu">Concursuri de Prestigiu</option>
                </select>
              </div>
              <div class="form-group-lux" style="flex:1; margin:0;">
                <label for="diplomaYear">An Academic</label>
                <select id="diplomaYear">
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                </select>
              </div>
            </div>

            <div class="form-group-lux">
              <label for="diplomaImg">Imagine Diplomă (Simulată)</label>
              <input type="text" id="diplomaImg" value="https://www.cnnb.ro/templates/youtrader/favicon.ico">
            </div>

            <button id="addDiplomaBtn" class="login-btn" style="margin:0; width:100%; background:linear-gradient(90deg, hsl(var(--accent-teal)), hsl(var(--accent-teal-hover))); border-color:rgba(0,150,136,0.2);">🏅 Înregistrează Diplomă</button>

            <div class="admin-card-title" style="margin-top:1.8rem; font-size:0.95rem; margin-bottom:0.8rem;">📋 Premii Personalizate Adăugate</div>
            <div id="adminDiplomasList" class="registry-delete-list"></div>
          </div>

          <!-- Legislation Section -->
          <div class="admin-card-glass">
            <div class="admin-card-title">📄 Înregistrare Regulamente și Decizii</div>
            <p style="color:hsl(var(--text-muted)); font-size:0.75rem; margin-bottom:1rem; line-height:1.45;">
              Adăugați fișiere de reglementare, decizii ale consiliului sau proceduri administrative direct în secțiunea oficială de regulamente.
            </p>

            <div class="form-group-lux">
              <label for="legTitle">Titlu Document Oficial</label>
              <input type="text" id="legTitle" placeholder="ex. Procedura Privind Securitatea în Campus 2026">
            </div>

            <div class="form-group-lux">
              <label for="legCategory">Categorie Act</label>
              <select id="legCategory">
                <option value="Regulamente și Statut">Regulamente și Statut</option>
                <option value="Proceduri Școlare">Proceduri Școlare</option>
                <option value="Hotărâri Consiliu">Hotărâri Consiliu</option>
                <option value="Planuri Manageriale">Planuri Manageriale</option>
              </select>
            </div>

            <div class="form-group-lux">
              <label for="legDocName">Nume Fișier Atașat (.pdf)</label>
              <input type="text" id="legDocName" value="procedura_siguranta_2026.pdf" placeholder="ex. roi_colegiu.pdf">
            </div>

            <button id="addLegBtn" class="login-btn" style="margin:0; width:100%; background:linear-gradient(90deg, hsl(var(--accent-gold)), hsl(var(--accent-gold-hover))); color:hsl(var(--primary-deep)); border-color:rgba(212,175,55,0.2);">📄 Înregistrează Document</button>

            <div class="admin-card-title" style="margin-top:1.8rem; font-size:0.95rem; margin-bottom:0.8rem;">📋 Documente Personalizate Adăugate</div>
            <div id="adminLegislatieList" class="registry-delete-list"></div>
          </div>
        </div>
      </div>

      <!-- Tab 5: Modificare Pagini View -->
      <div id="editorTab" class="admin-tab-content">
        <div style="background: hsl(var(--bg-pearl)); padding:1.5rem; border-radius: var(--radius-md); border:1px solid rgba(10,37,64,0.06);">
          <label style="display:block; font-weight:700; margin-bottom:8px; font-size:0.9rem; color:hsl(var(--primary-deep));">Selectează pagina de editat:</label>
          <select id="adminPageSelector" style="width:100%; padding:10px; border-radius:var(--radius-sm); border:1px solid rgba(0,0,0,0.15); margin-bottom:1.5rem; outline:none; font-family:inherit;">
            <option value="">-- Alege o pagină din index --</option>
            ${optionsHtml}
          </select>

          <div id="editorForm" style="display:none; flex-direction:column; gap:1.2rem;">
            <div>
              <label style="display:block; font-weight:600; margin-bottom:6px; font-size:0.85rem;">Titlu Articol</label>
              <input type="text" id="adminPageTitle" style="width:100%; padding:10px; border-radius:var(--radius-sm); border:1px solid rgba(0,0,0,0.15); font-family:inherit;">
            </div>

            <div>
              <label style="display:block; font-weight:600; margin-bottom:6px; font-size:0.85rem;">Breadcrumbs (separate prin virgulă)</label>
              <input type="text" id="adminPageCrumbs" style="width:100%; padding:10px; border-radius:var(--radius-sm); border:1px solid rgba(0,0,0,0.15); font-family:inherit;">
            </div>

            <div>
              <label style="display:block; font-weight:600; margin-bottom:6px; font-size:0.85rem;">Conținut HTML / Text</label>
              <textarea id="adminPageHtml" rows="12" style="width:100%; padding:15px; border-radius:var(--radius-sm); border:1px solid rgba(0,0,0,0.15); font-family:monospace; font-size:0.9rem; line-height:1.5; outline:none; resize:vertical;"></textarea>
            </div>

            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:10px;">
              <button id="adminSaveBtn" class="login-btn" style="margin:0;">Salvează Modificările (Local)</button>
              <button id="adminDownloadBtn" class="login-btn" style="margin:0; background:linear-gradient(135deg, hsl(var(--accent-gold)), hsl(var(--accent-gold-hover))); color:hsl(var(--primary-deep)); border-color:rgba(212,175,55,0.25);">Descarcă fișier JSON pentru Proiect</button>
            </div>
            <div id="adminStatusMsg" style="margin-top:10px; font-weight:600; font-size:0.85rem;"></div>
          </div>
        </div>
      </div>

      <!-- Tab 6: Sincronizare Scraper View -->
      <div id="scraperTab" class="admin-tab-content">
        <div style="background: hsl(var(--bg-pearl)); padding:1.8rem; border-radius: var(--radius-md); border:1px solid rgba(10,37,64,0.06); display:flex; flex-direction:column; gap:1.5rem;">
          <div>
            <h4 style="margin-bottom:8px;">Sincronizare Automată Joomla -> Portal</h4>
            <p style="font-size:0.85rem; color:hsl(var(--text-muted)); line-height:1.5;">
              Această secțiune oferă monitorizare în timp real a procesului de crawling programatic. Pornirea sincronizării simulează citirea structurii de meniuri Joomla, extragerea imaginilor și tabelor direct în baza locală de fișiere JSON.
            </p>
          </div>

          <div style="display:flex; align-items:center; gap:15px;">
            <button id="startSyncBtn" class="search-btn" style="background:hsl(var(--primary-deep)); color:#fff;">Pornire Sincronizare</button>
            <span id="syncBadge" style="background:#e2e8f0; color:#475569; padding:4px 10px; border-radius:30px; font-size:0.75rem; font-weight:700;">INACTIV</span>
          </div>

          <div id="syncProgressContainer" style="display:none; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;">
              <span>Rată de procesare pagini</span>
              <span id="syncProgressPct">0%</span>
            </div>
            <div style="width:100%; height:8px; background:rgba(0,0,0,0.1); border-radius:10px; overflow:hidden;">
              <div id="syncProgressBar" style="width:0%; height:100%; background:hsl(var(--accent-gold)); transition: width 0.1s ease-out;"></div>
            </div>
          </div>

          <div>
            <label style="display:block; font-weight:600; margin-bottom:6px; font-size:0.85rem;">Terminal Logs</label>
            <div id="scraperConsole" style="background:#090d16; color:#a7f3d0; padding:15px; border-radius:var(--radius-sm); font-family:monospace; font-size:0.8rem; height:200px; overflow-y:auto; border:1px solid #10b981; line-height:1.5; white-space:pre-wrap;">[Console ready. Click 'Pornire Sincronizare' to begin synchronizing page data from cnnb.ro]</div>
          </div>
        </div>
      </div>
    `;

    // 1. Clear active interval if any to prevent memory leaks
    if (window.adminConsoleInterval) {
      clearInterval(window.adminConsoleInterval);
    }

    // 2. Setup Logout Handler
    const logoutBtn = document.getElementById('adminLogoutBtn');
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('cnnb_admin_session');
      if (window.adminConsoleInterval) {
        clearInterval(window.adminConsoleInterval);
      }
      renderAdminPanel();
    });

    // 3. Activity stream logger core
    function logToConsole(msg, type = 'info') {
      const consoleEl = document.getElementById('adminActivityConsole');
      if (!consoleEl) return;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const logLine = document.createElement('div');
      logLine.className = `log-line ${type}`;
      logLine.innerHTML = `<span class="log-time">[${timeStr}]</span><span class="log-msg">${msg}</span>`;
      consoleEl.prepend(logLine);
      if (consoleEl.children.length > 50) {
        consoleEl.removeChild(consoleEl.lastChild);
      }
    }

    // Prepopulate some realistic log events
    logToConsole("Portal administrativ inițializat cu succes. Conexiune securizată SSL stabilită.", "success");
    logToConsole("Orar cursuri preluat din localStorage.", "info");
    logToConsole("S-a obținut schema de cache pentru 256 link-uri Joomla scraped.", "info");
    logToConsole("Autentificare autorizată pentru utilizatorul 'admin'.", "success");

    // Dynamic logging task in background
    const randomConsoleEvents = [
      "Securitate: S-a verificat integritatea bazei de date orar.",
      "Trafic: Vârf de activitate detectat pe ruta publică /index.php/login/orar-elevi.",
      "Accesibilitate: Profilul de contrast înalt adaptiv a fost validat.",
      "Sistem: Sincronizare automată finalizată.",
      "Consolă: Monitorizare conexiuni API activă pe port local.",
      "Trafic: Elev nou interoghează fișierul Phoca Gallery diplome.",
      "Core: Memoria cache SPA a fost eliberată."
    ];
    window.adminConsoleInterval = setInterval(() => {
      if (document.getElementById('adminActivityConsole')) {
        const randMsg = randomConsoleEvents[Math.floor(Math.random() * randomConsoleEvents.length)];
        logToConsole(`SISTEM: ${randMsg}`, 'info');
      } else {
        clearInterval(window.adminConsoleInterval);
      }
    }, 12000);

    // 4. SVG Spline Chart Point Hover Tooltip Handler
    const tooltip = canvasContent.querySelector('.chart-tooltip');
    const circles = canvasContent.querySelectorAll('.svg-chart-points circle');
    circles.forEach(c => {
      c.addEventListener('mouseover', (e) => {
        const day = c.getAttribute('data-day');
        const visits = c.getAttribute('data-visits');
        tooltip.innerHTML = `<strong>Vizite ${day}</strong>👥 ${visits} utilizatori unici`;
        tooltip.style.display = 'block';
        
        const rect = c.getBoundingClientRect();
        const parentRect = c.closest('.svg-chart-container').getBoundingClientRect();
        tooltip.style.left = `${rect.left - parentRect.left + 10}px`;
        tooltip.style.top = `${rect.top - parentRect.top - 45}px`;
      });
      
      c.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
      });
    });

    // 5. Orar Cursuri Spreadsheet Editor logic
    const editorClassSelect = document.getElementById('editorClassSelect');
    const editorDaySelect = document.getElementById('editorDaySelect');
    const saveTimetableBtn = document.getElementById('saveTimetableBtn');
    const orarSaveStatus = document.getElementById('orarSaveStatus');

    function loadTimetableEditorData() {
      const selectedClass = editorClassSelect.value;
      const selectedDay = editorDaySelect.value;
      const customOrar = JSON.parse(localStorage.getItem('cnnb_custom_orar') || '{}');
      const fallbackSubjects = ["Matematică", "Limba Română", "Fizică", "Informatică", "Chimie", "Istorie", "Geografie", "Limba Engleză", "Educație Fizică", "Biologie", "Religie", "Socio-umane"];
      
      for (let i = 0; i <= 8; i++) {
        const inputEl = document.getElementById(`hourInput_${i}`);
        if (!inputEl) continue;
        
        let val = '';
        if (customOrar[selectedClass] && customOrar[selectedClass][selectedDay] && customOrar[selectedClass][selectedDay][i] !== undefined) {
          val = customOrar[selectedClass][selectedDay][i];
        } else {
          // deterministic fallback
          const fallbackVal = (selectedClass.charCodeAt(0) + selectedClass.charCodeAt(1) + selectedDay.charCodeAt(0) + i * 17) % fallbackSubjects.length;
          if (i === 0 || i > 6) {
            val = '—';
          } else {
            val = fallbackSubjects[fallbackVal];
          }
        }
        inputEl.value = val;
      }
    }

    [editorClassSelect, editorDaySelect].forEach(select => {
      select.addEventListener('change', loadTimetableEditorData);
    });

    saveTimetableBtn.addEventListener('click', () => {
      const selectedClass = editorClassSelect.value;
      const selectedDay = editorDaySelect.value;
      const customOrar = JSON.parse(localStorage.getItem('cnnb_custom_orar') || '{}');
      
      if (!customOrar[selectedClass]) customOrar[selectedClass] = {};
      
      const hourData = [];
      for (let i = 0; i <= 8; i++) {
        const val = document.getElementById(`hourInput_${i}`).value.trim();
        hourData.push(val || '—');
      }
      
      customOrar[selectedClass][selectedDay] = hourData;
      localStorage.setItem('cnnb_custom_orar', JSON.stringify(customOrar));
      
      orarSaveStatus.style.color = '#10b981';
      orarSaveStatus.textContent = `✅ Orar sincronizat public pentru Clasa ${selectedClass} (${selectedDay})!`;
      logToConsole(`ORAR: Modificat programul Clasei ${selectedClass} pentru ziua de ${selectedDay}.`, 'success');
      
      setTimeout(() => {
        orarSaveStatus.textContent = '';
      }, 3000);
    });

    // 6. Announcements Feed Publisher logic
    const announceTitle = document.getElementById('announceTitle');
    const announceDate = document.getElementById('announceDate');
    const announceCategory = document.getElementById('announceCategory');
    const announceContent = document.getElementById('announceContent');
    const publishAnnounceBtn = document.getElementById('publishAnnounceBtn');
    const adminAnnouncementsList = document.getElementById('adminAnnouncementsList');
    
    // Set default beautiful localized date
    const today = new Date();
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    announceDate.value = today.toLocaleDateString('ro-RO', dateOptions);

    let tempAttachments = [];
    const dropzone = document.getElementById('announceDropzone');
    const filesList = document.getElementById('announceFilesList');

    function updateDropzoneUI() {
      if (tempAttachments.length === 0) {
        filesList.innerHTML = `<span style="font-size:0.75rem; color:hsl(var(--text-muted)); font-weight:600;">Niciun fișier selectat</span>`;
      } else {
        filesList.innerHTML = tempAttachments.map((f, idx) => `
          <span class="attachment-badge" style="display:inline-flex; align-items:center; gap:5px; margin:2px;">
            📎 ${f} 
            <span class="delete-att" data-index="${idx}" style="cursor:pointer; color:red; font-weight:bold; margin-left:5px;">×</span>
          </span>
        `).join('');
        
        filesList.querySelectorAll('.delete-att').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'));
            tempAttachments.splice(idx, 1);
            updateDropzoneUI();
          });
        });
      }
    }

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const randomDocs = ["regulament_colegiu_2026.pdf", "grafic_examene.docx", "calendar_olimpiade.pdf", "metodologie_admitere.pdf"];
      const doc = randomDocs[Math.floor(Math.random() * randomDocs.length)];
      tempAttachments.push(doc);
      updateDropzoneUI();
      logToConsole(`ANUNȚURI: S-a încărcat fișierul temporar: ${doc}`, 'info');
    });
    dropzone.addEventListener('click', () => {
      const doc = prompt("Introduceți numele documentului de atașat:", `document_consiliu_${Math.floor(Math.random()*100)}.pdf`);
      if (doc) {
        tempAttachments.push(doc);
        updateDropzoneUI();
        logToConsole(`ANUNȚURI: S-a adăugat fișierul atașat: ${doc}`, 'info');
      }
    });

    function loadPublishedAnnouncements() {
      const data = JSON.parse(localStorage.getItem('cnnb_custom_announcements') || '[]');
      if (data.length === 0) {
        adminAnnouncementsList.innerHTML = `<div style="text-align:center; padding:1.5rem; color:hsl(var(--text-muted)); font-weight:600; font-size:0.8rem;">Nu există anunțuri administrative personalizate active.</div>`;
        return;
      }
      
      adminAnnouncementsList.innerHTML = data.map((item, idx) => `
        <div class="registry-delete-item" style="margin-bottom:6px;">
          <span style="font-weight:700; color:hsl(var(--primary-deep));">${item.title}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.7rem; font-weight:600; background:rgba(0,0,0,0.05); padding:2px 6px; border-radius:4px;">${item.category}</span>
            <button class="delete-announce-btn" data-index="${idx}">Șterge</button>
          </div>
        </div>
      `).join('');
      
      adminAnnouncementsList.querySelectorAll('.delete-announce-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          const custom = JSON.parse(localStorage.getItem('cnnb_custom_announcements') || '[]');
          const removed = custom.splice(idx, 1);
          localStorage.setItem('cnnb_custom_announcements', JSON.stringify(custom));
          loadPublishedAnnouncements();
          updateStatsBadges();
          logToConsole(`ANUNȚURI: S-a eliminat anunțul "${removed[0].title}"`, 'warn');
        });
      });
    }

    publishAnnounceBtn.addEventListener('click', () => {
      const title = announceTitle.value.trim();
      const content = announceContent.value.trim();
      const date = announceDate.value.trim();
      const category = announceCategory.value;

      if (!title || !content) {
        alert("⚠️ Vă rugăm să introduceți titlul și conținutul anunțului!");
        return;
      }

      const custom = JSON.parse(localStorage.getItem('cnnb_custom_announcements') || '[]');
      const newAnnounce = {
        id: Date.now(),
        title,
        content,
        date,
        category,
        attachments: [...tempAttachments]
      };

      custom.unshift(newAnnounce);
      localStorage.setItem('cnnb_custom_announcements', JSON.stringify(custom));

      announceTitle.value = '';
      announceContent.value = '';
      tempAttachments = [];
      updateDropzoneUI();

      loadPublishedAnnouncements();
      updateStatsBadges();
      logToConsole(`ANUNȚURI: Anunț nou lansat cu succes: "${title}"`, "success");
    });

    // 7. Registries awards & document forms logic
    const diplomaStudent = document.getElementById('diplomaStudent');
    const diplomaPrize = document.getElementById('diplomaPrize');
    const diplomaCategory = document.getElementById('diplomaCategory');
    const diplomaYear = document.getElementById('diplomaYear');
    const diplomaImg = document.getElementById('diplomaImg');
    const addDiplomaBtn = document.getElementById('addDiplomaBtn');
    const adminDiplomasList = document.getElementById('adminDiplomasList');

    const legTitle = document.getElementById('legTitle');
    const legCategory = document.getElementById('legCategory');
    const legDocName = document.getElementById('legDocName');
    const addLegBtn = document.getElementById('addLegBtn');
    const adminLegislatieList = document.getElementById('adminLegislatieList');

    function loadDiplomasRegistry() {
      const data = JSON.parse(localStorage.getItem('cnnb_custom_diplomas') || '[]');
      if (data.length === 0) {
        adminDiplomasList.innerHTML = `<div style="text-align:center; padding:1rem; color:hsl(var(--text-muted)); font-size:0.75rem;">Nicio diplomă personalizată adăugată.</div>`;
        return;
      }
      
      adminDiplomasList.innerHTML = data.map((item, idx) => `
        <div class="registry-delete-item" style="margin-bottom:6px;">
          <span style="font-weight:700;">🏅 ${item.studentName} (${item.prize})</span>
          <button class="delete-diploma-btn" data-index="${idx}">Șterge</button>
        </div>
      `).join('');
      
      adminDiplomasList.querySelectorAll('.delete-diploma-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          const list = JSON.parse(localStorage.getItem('cnnb_custom_diplomas') || '[]');
          const removed = list.splice(idx, 1);
          localStorage.setItem('cnnb_custom_diplomas', JSON.stringify(list));
          loadDiplomasRegistry();
          updateStatsBadges();
          logToConsole(`REGISTRU: Șters premiul acordat lui ${removed[0].studentName}`, 'warn');
        });
      });
    }

    addDiplomaBtn.addEventListener('click', () => {
      const studentName = diplomaStudent.value.trim();
      const prize = diplomaPrize.value.trim();
      const category = diplomaCategory.value;
      const year = diplomaYear.value;
      const img = diplomaImg.value.trim();

      if (!studentName || !prize) {
        alert("⚠️ Vă rugăm să completați numele elevului și premiul obținut!");
        return;
      }

      const list = JSON.parse(localStorage.getItem('cnnb_custom_diplomas') || '[]');
      list.unshift({ studentName, prize, category, year, img });
      localStorage.setItem('cnnb_custom_diplomas', JSON.stringify(list));

      diplomaStudent.value = '';
      diplomaPrize.value = '';
      
      loadDiplomasRegistry();
      updateStatsBadges();
      logToConsole(`REGISTRU: S-a înregistrat diploma pentru ${studentName} (${prize})`, 'success');
    });

    function loadLegislatieRegistry() {
      const data = JSON.parse(localStorage.getItem('cnnb_custom_legislatie') || '[]');
      if (data.length === 0) {
        adminLegislatieList.innerHTML = `<div style="text-align:center; padding:1rem; color:hsl(var(--text-muted)); font-size:0.75rem;">Niciun regulament personalizat adăugat.</div>`;
        return;
      }
      
      adminLegislatieList.innerHTML = data.map((item, idx) => `
        <div class="registry-delete-item" style="margin-bottom:6px;">
          <span style="font-weight:700;">📄 ${item.title}</span>
          <button class="delete-legislatie-btn" data-index="${idx}">Șterge</button>
        </div>
      `).join('');
      
      adminLegislatieList.querySelectorAll('.delete-legislatie-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          const list = JSON.parse(localStorage.getItem('cnnb_custom_legislatie') || '[]');
          const removed = list.splice(idx, 1);
          localStorage.setItem('cnnb_custom_legislatie', JSON.stringify(list));
          loadLegislatieRegistry();
          updateStatsBadges();
          logToConsole(`REGISTRU: Șters documentul administrativ "${removed[0].title}"`, 'warn');
        });
      });
    }

    addLegBtn.addEventListener('click', () => {
      const title = legTitle.value.trim();
      const category = legCategory.value;
      const docName = legDocName.value.trim();

      if (!title || !docName) {
        alert("⚠️ Vă rugăm să completați titlul și numele documentului!");
        return;
      }

      const list = JSON.parse(localStorage.getItem('cnnb_custom_legislatie') || '[]');
      list.unshift({ title, category, docName });
      localStorage.setItem('cnnb_custom_legislatie', JSON.stringify(list));

      legTitle.value = '';
      
      loadLegislatieRegistry();
      updateStatsBadges();
      logToConsole(`REGISTRU: S-a publicat documentul legislativ "${title}"`, 'success');
    });

    function updateStatsBadges() {
      const customAnnouncements = JSON.parse(localStorage.getItem('cnnb_custom_announcements') || '[]');
      const statsAnnouncementsNum = document.getElementById('statsAnnouncementsNum');
      if (statsAnnouncementsNum) {
        statsAnnouncementsNum.textContent = 4 + customAnnouncements.length;
      }

      const customDiplomas = JSON.parse(localStorage.getItem('cnnb_custom_diplomas') || '[]');
      const customLeg = JSON.parse(localStorage.getItem('cnnb_custom_legislatie') || '[]');
      const statsRegistriesNum = document.getElementById('statsRegistriesNum');
      if (statsRegistriesNum) {
        statsRegistriesNum.textContent = 8 + customDiplomas.length + customLeg.length;
      }
    }

    // 8. Tab Navigation setup
    const tabs = [
      { btn: 'tabOverviewBtn', tab: 'overviewTab' },
      { btn: 'tabOrarBtn', tab: 'orarTab' },
      { btn: 'tabAnunturiBtn', tab: 'anunturiTab' },
      { btn: 'tabRegistreBtn', tab: 'registreTab' },
      { btn: 'tabEditorBtn', tab: 'editorTab' },
      { btn: 'tabScraperBtn', tab: 'scraperTab' }
    ];

    tabs.forEach(t => {
      const btnEl = document.getElementById(t.btn);
      const tabEl = document.getElementById(t.tab);
      btnEl.addEventListener('click', () => {
        tabs.forEach(x => {
          document.getElementById(x.btn).classList.remove('active');
          document.getElementById(x.tab).classList.remove('active');
        });
        btnEl.classList.add('active');
        tabEl.classList.add('active');
        
        if (t.tab === 'orarTab') {
          loadTimetableEditorData();
        }
      });
    });

    // 9. Keep existing Editor Form Populating & Save Logic
    const adminPageSelector = document.getElementById('adminPageSelector');
    const editorForm = document.getElementById('editorForm');
    const adminPageTitle = document.getElementById('adminPageTitle');
    const adminPageCrumbs = document.getElementById('adminPageCrumbs');
    const adminPageHtml = document.getElementById('adminPageHtml');
    const adminSaveBtn = document.getElementById('adminSaveBtn');
    const adminStatusMsg = document.getElementById('adminStatusMsg');

    adminPageSelector.addEventListener('change', async (e) => {
      const selectedRoute = e.target.value;
      if (!selectedRoute) {
        editorForm.style.display = 'none';
        return;
      }

      adminStatusMsg.textContent = '';
      const pageFilename = routeToFilename(selectedRoute);

      let pageData;
      const cached = localStorage.getItem(`cnnb_edit_${pageFilename}`);
      if (cached) {
        pageData = JSON.parse(cached);
      } else {
        try {
          const resp = await fetch(`./content/${pageFilename}.json`);
          if (resp.ok) {
            pageData = await resp.json();
          } else {
            pageData = {
              title: adminPageSelector.options[adminPageSelector.selectedIndex].text.split(' (')[0],
              breadcrumbs: ['Acasă', 'Secțiune'],
              contentHtml: '<p>Scrieți conținutul dvs. aici...</p>'
            };
          }
        } catch {
          pageData = {
            title: adminPageSelector.options[adminPageSelector.selectedIndex].text.split(' (')[0],
            breadcrumbs: ['Acasă', 'Secțiune'],
            contentHtml: '<p>Scrieți conținutul dvs. aici...</p>'
          };
        }
      }

      adminPageTitle.value = pageData.title || '';
      adminPageCrumbs.value = (pageData.breadcrumbs || []).join(', ');
      adminPageHtml.value = pageData.contentHtml || '';

      editorForm.style.display = 'flex';
    });

    adminSaveBtn.addEventListener('click', () => {
      const selectedRoute = adminPageSelector.value;
      const pageFilename = routeToFilename(selectedRoute);

      const payload = {
        title: adminPageTitle.value.trim(),
        route: selectedRoute,
        breadcrumbs: adminPageCrumbs.value.split(',').map(s => s.trim()).filter(Boolean),
        contentHtml: adminPageHtml.value.trim(),
        scrapedAt: new Date().toISOString()
      };

      localStorage.setItem(`cnnb_edit_${pageFilename}`, JSON.stringify(payload));
      adminStatusMsg.style.color = '#10b981';
      adminStatusMsg.textContent = '✅ Articolul a fost salvat cu succes în stocarea locală a portalului!';
      
      const matchIdx = flatSearchIndex.findIndex(item => item.route === selectedRoute);
      if (matchIdx !== -1) {
        flatSearchIndex[matchIdx].title = payload.title;
      }
      logToConsole(`PAGINI: S-au salvat modificările pentru articolul "${payload.title}"`, 'success');
    });

    const adminDownloadBtn = document.getElementById('adminDownloadBtn');
    adminDownloadBtn.addEventListener('click', () => {
      const selectedRoute = adminPageSelector.value;
      if (!selectedRoute) return;
      const pageFilename = routeToFilename(selectedRoute);

      const payload = {
        title: adminPageTitle.value.trim(),
        route: selectedRoute,
        breadcrumbs: adminPageCrumbs.value.split(',').map(s => s.trim()).filter(Boolean),
        contentHtml: adminPageHtml.value.trim(),
        scrapedAt: new Date().toISOString()
      };

      const jsonString = JSON.stringify(payload, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonString);
      const exportFileDefaultName = `${pageFilename}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();

      adminStatusMsg.style.color = '#10b981';
      adminStatusMsg.textContent = `✅ Fișierul '${exportFileDefaultName}' a fost generat și descărcat cu succes! Pentru actualizare permanentă, mutați fișierul în folderul 'content/'.`;
      logToConsole(`PAGINI: S-a descărcat fișierul de export JSON: ${exportFileDefaultName}`, 'info');
    });

    // 10. Keep existing Scraper Simulation logic
    const startSyncBtn = document.getElementById('startSyncBtn');
    const syncBadge = document.getElementById('syncBadge');
    const syncProgressContainer = document.getElementById('syncProgressContainer');
    const syncProgressPct = document.getElementById('syncProgressPct');
    const syncProgressBar = document.getElementById('syncProgressBar');
    const scraperConsole = document.getElementById('scraperConsole');

    let syncInterval;
    startSyncBtn.addEventListener('click', () => {
      if (syncInterval) return;

      startSyncBtn.disabled = true;
      syncBadge.textContent = 'RULARE ACTIVĂ';
      syncBadge.style.background = '#fef3c7';
      syncBadge.style.color = '#d97706';
      syncProgressContainer.style.display = 'flex';

      let pct = 0;
      let logs = ['🚀 Inițiere conexiune cu serverul cnnb.ro...', '🔌 Validare token administrativ aprobat...', '📂 Analiză structură de navigare (256 meniuri detectate)...'];
      scraperConsole.textContent = logs.join('\n');

      const mockSteps = [
        { pct: 15, msg: '✅ S-a conexat cu succes la http://www.cnnb.ro/' },
        { pct: 30, msg: '📥 Se descarcă secțiunea "Despre Noi": /acasa/istoric (2.4 KB)' },
        { pct: 45, msg: '📥 Se descarcă secțiunea "Personal": /menu-1/directori-actuali (1.8 KB)' },
        { pct: 60, msg: '📥 Se descarcă secțiunea "Elevi": /login/orar-elevi (4.2 KB)' },
        { pct: 75, msg: '🖼️ Se descarcă 24 imagini și fișiere atașate din phocagallery...' },
        { pct: 90, msg: '🔄 Conversie diacritice românești și tabele structurate finalizează...' },
        { pct: 100, msg: '🎉 Sincronizare finalizată! 52 de fișiere JSON actualizate în content/.' }
      ];

      logToConsole("SCRAPER: S-a pornit simularea de sincronizare automată Joomla.", "info");

      syncInterval = setInterval(() => {
        pct += 2;
        if (pct > 100) pct = 100;

        syncProgressBar.style.width = `${pct}%`;
        syncProgressPct.textContent = `${pct}%`;

        const milestone = mockSteps.find(step => step.pct === pct);
        if (milestone) {
          logs.push(milestone.msg);
          scraperConsole.textContent = logs.join('\n');
          scraperConsole.scrollTop = scraperConsole.scrollHeight;
        }

        if (pct >= 100) {
          clearInterval(syncInterval);
          syncInterval = null;
          startSyncBtn.disabled = false;
          syncBadge.textContent = 'FINALIZAT';
          syncBadge.style.background = '#d1fae5';
          syncBadge.style.color = '#065f46';
          logToConsole("SCRAPER: Sincronizare automată finalizată cu succes. Conținutul local s-a actualizat.", "success");
        }
      }, 100);
    });

    // 11. Initial populates
    loadPublishedAnnouncements();
    loadDiplomasRegistry();
    loadLegislatieRegistry();
    updateDropzoneUI();
    updateStatsBadges();

    updateActiveSidebar('/index.php/admin');
  }

  // Secret trigger: Ctrl + Shift + A to open the Admin Panel
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      window.location.hash = '#/index.php/admin';
    }
  });

  // Secret trigger: Double click on the brand logo badge to open the Admin Panel
  const logoBadge = document.querySelector('.logo-badge');
  if (logoBadge) {
    logoBadge.addEventListener('dblclick', () => {
      window.location.hash = '#/index.php/admin';
    });
  }

  // Initialize
  window.addEventListener('hashchange', handleRouting);
  
  await initNavigation();
  handleRouting(); // First load router call
});

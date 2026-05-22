import fs from 'fs';

const htmlPath = 'c:\\Users\\Dani\\Desktop\\CNNB\\index.html';
console.log('--- Adding Legislation Management to Admin Panel ---\n');

let html = fs.readFileSync(htmlPath, 'utf8');

// ============================================================
// STEP 1: Make legislatieDocs use localStorage so admin changes persist
// ============================================================
const arrayStart = html.indexOf('        const legislatieDocs = [');
if (arrayStart < 0) {
    console.error('❌ legislatieDocs array not found!'); process.exit(1);
}
const arrayEnd = html.indexOf('\n        ];\n\n        const parteneriData', arrayStart) + '\n        ];\n'.length;
const defaultDocs = `[
            { name: "Monitorul Oficial nr. 675/2022", desc: "Ordin ministru educatiei pentru aprobarea ROFUIP", icon: "fas fa-file-pdf", file: "Monitorul Oficial Partea I nr. 675.pdf" },
            { name: "Regulament de organizare si functionare (ROF) 2025-2026", desc: "Regulamentul intern al Colegiului National Nicolae Balcescu", icon: "fas fa-book", file: "ROF_2025_2026.pdf" },
            { name: "Regulament de ordine interioara (ROI) 2025-2026", desc: "Norme de conduita, interdictii si sanctiuni pentru elevi", icon: "fas fa-gavel", file: "ROI_2025_2026.pdf" },
            { name: "Statutul elevului", desc: "Drepturile si obligatiile elevilor - Ordin 4742/2016", icon: "fas fa-user-graduate", file: "Statutul elevului.pdf" },
            { name: "Accesul la baza sportiva CNNB", desc: "Regulament de utilizare teren sport si sala de sport", icon: "fas fa-futbol", file: "accesul baza sportiva CNNB.pdf" },
            { name: "Autoritate securitate la incendiu", desc: "Aviz ISU Braila nr. 1177/18/SU-BR din 12.11.2018", icon: "fas fa-fire-extinguisher", file: "Autorizatie.securitate.la.incendiu.pdf" },
            { name: "Plan managerial director 2025-2026", desc: "Document de management al Colegiului", icon: "fas fa-chart-line", file: "Plan.managerial director.2025_2026.pdf" },
            { name: "Plan managerial director adjunct 2025-2026", desc: "Document de management adjunct", icon: "fas fa-chart-line", file: "Plan.managerial.director.adjunct_2025_2026.pdf" },
            { name: "Autorizatie sanitara", desc: "Autorizatia sanitara de functionare a Colegiului National Nicolae Balcescu", icon: "fas fa-hospital", file: "Autorizatie__sanitara.pdf" }
        ]`;

const replacementArray = `        // Legislation docs - managed via Admin Panel (stored in localStorage)
        const _defaultLegislatieDocs = ${defaultDocs};

        function getLegislatieDocs() {
            try {
                const stored = localStorage.getItem('legislatieDocs');
                if (stored) return JSON.parse(stored);
            } catch(e) {}
            return JSON.parse(JSON.stringify(_defaultLegislatieDocs)); // deep copy
        }

        function saveLegislatieDocs(docs) {
            localStorage.setItem('legislatieDocs', JSON.stringify(docs));
        }

        const legislatieDocs = getLegislatieDocs();
`;
html = html.substring(0, arrayStart) + replacementArray + html.substring(arrayEnd);
console.log('✅ legislatieDocs converted to localStorage-backed array.');

// ============================================================
// STEP 2: Inject legislation UI into the registries tab
// We look for the close of the workspace.innerHTML template inside that tab.
// The registries tab template ends with: `;\n\n                initUploadZone();
// ============================================================
const regTabMarker = "} else if (activeAdminTab === 'registries') {";
const regTabIdx = html.lastIndexOf(regTabMarker);
if (regTabIdx < 0) { console.error('❌ registries tab not found!'); process.exit(1); }

const uploadZoneClose = html.indexOf('\n                `;\n\n                initUploadZone();', regTabIdx);
if (uploadZoneClose < 0) { console.error('❌ Could not find initUploadZone closing pattern!'); process.exit(1); }

const legislationAdminHTML = `

                    <!-- ===== LEGISLATION MANAGEMENT SECTION ===== -->
                    <div style="margin-top:32px; border-top:1.5px solid rgba(148,163,184,0.15); padding-top:24px;">
                        <div class="admin-field-full" style="font-size:0.95rem; font-weight:700; color:#0a2463; padding-bottom:10px;">
                            ⚖️ Gestionare Documente Legislație
                        </div>

                        <div class="admin-form-grid">
                            <div>
                                <label class="admin-label">Titlu Document</label>
                                <input type="text" id="newLegDocName" class="admin-input-text" placeholder="Ex: Regulament intern 2026-2027">
                            </div>
                            <div>
                                <label class="admin-label">Descriere</label>
                                <input type="text" id="newLegDocDesc" class="admin-input-text" placeholder="Ex: Norme de conduita pentru elevi">
                            </div>
                            <div>
                                <label class="admin-label">Iconiță</label>
                                <select class="admin-select" style="width:100%;" id="newLegDocIcon">
                                    <option value="fas fa-file-pdf">📄 Fișier PDF</option>
                                    <option value="fas fa-book">📚 Carte / Regulament</option>
                                    <option value="fas fa-gavel">⚖️ Act normativ</option>
                                    <option value="fas fa-user-graduate">🎓 Statut elev</option>
                                    <option value="fas fa-futbol">⚽ Bază sportivă</option>
                                    <option value="fas fa-fire-extinguisher">🔥 Securitate incendiu</option>
                                    <option value="fas fa-chart-line">📊 Plan managerial</option>
                                    <option value="fas fa-hospital">🏥 Sanitare</option>
                                    <option value="fas fa-shield-alt">🛡️ Protecție</option>
                                    <option value="fas fa-clipboard-list">📋 Lista / Procedură</option>
                                </select>
                            </div>
                            <div>
                                <label class="admin-label">Fișier PDF asociat</label>
                                <select class="admin-select" style="width:100%;" id="newLegDocFile">
                                    <option value="Monitorul Oficial Partea I nr. 675.pdf">Monitorul Oficial nr. 675</option>
                                    <option value="ROF_2025_2026.pdf">ROF 2025-2026</option>
                                    <option value="ROI_2025_2026.pdf">ROI 2025-2026</option>
                                    <option value="Statutul elevului.pdf">Statutul elevului</option>
                                    <option value="accesul baza sportiva CNNB.pdf">Acces baza sportivă</option>
                                    <option value="Autorizatie.securitate.la.incendiu.pdf">Autorizație ISU</option>
                                    <option value="Plan.managerial director.2025_2026.pdf">Plan managerial director</option>
                                    <option value="Plan.managerial.director.adjunct_2025_2026.pdf">Plan managerial adj.</option>
                                    <option value="Autorizatie__sanitara.pdf">Autorizație sanitară</option>
                                    <option value="extras_regulament_infoeducatie.pdf">Extras infoeducatie</option>
                                    <option value="2025_Anunt.termen.depunere.dosare.pdf">Anunț termen dosare 2025</option>
                                    <option value="2025_Cerere.bursa.MEDICALA si anexe.pdf">Cerere bursă medicală</option>
                                    <option value="2025_Cerere.bursa.ORFANI_PLASAMENT si anexe.pdf">Cerere bursă orfani</option>
                                    <option value="2025_Cerere.bursa.VENITURI si anexe.pdf">Cerere bursă venituri</option>
                                    <option value="2025_HG. nr. 732_04.09.2025.pdf">HG nr. 732/2025</option>
                                    <option value="Procedura.operationala.acordare.burse_2025.pdf">Procedură burse 2025</option>
                                    <option value="ANUNT_TRANSPORT_RURAL_2025_2026.pdf">Anunț transport rural</option>
                                    <option value="Programa _ Limba_si_literatura_romana_clasele a III-a-a-IV-a.pdf">Programă română cl. III-IV</option>
                                    <option value="Programa pentru Mate __OMEN 5003_MATEMATICA_STIINTE_CLS III_IV.pdf">Programă matematică cl. III-IV</option>
                                </select>
                            </div>
                            <div class="admin-field-full" style="display:flex; justify-content:flex-end;">
                                <button class="admin-btn primary" onclick="addLegislationDoc()"><i class="fas fa-plus"></i> Adaugă Document</button>
                            </div>
                        </div>

                        <div class="admin-chart-title" style="margin-bottom:10px; margin-top:8px;">
                            <i class="fas fa-list" style="color:#0a2463;"></i>
                            <span>Documente Active în Secțiunea Legislație</span>
                        </div>
                        <div id="adminLegislationList"><!-- filled dynamically --></div>
                    </div>`;

html = html.substring(0, uploadZoneClose) + legislationAdminHTML + html.substring(uploadZoneClose);
console.log('✅ Legislation management UI injected into registries tab.');

// ============================================================
// STEP 3: Add the JS functions for legislation management 
// ============================================================
// Insert before </script> or before a known function near end of script
const initUploadZoneFn = html.lastIndexOf('function initUploadZone()');
if (initUploadZoneFn < 0) { console.error('❌ initUploadZone not found!'); process.exit(1); }

const legislationFunctions = `
        // ==================== LEGISLATION MANAGEMENT ====================
        function addLegislationDoc() {
            const name = document.getElementById('newLegDocName')?.value.trim();
            const desc = document.getElementById('newLegDocDesc')?.value.trim();
            const icon = document.getElementById('newLegDocIcon')?.value || 'fas fa-file-pdf';
            const file = document.getElementById('newLegDocFile')?.value;
            if (!name) { alert('Introduceți titlul documentului!'); return; }
            const docs = getLegislatieDocs();
            docs.push({ name, desc: desc || '', icon, file });
            saveLegislatieDocs(docs);
            writeAdminLog('LEGISLATIE', 'Document adăugat: ' + name, 'success');
            loadAdminLegislationList();
            // Refresh public page grid if visible
            const grid = document.getElementById('legislatieGrid');
            if (grid) { grid.innerHTML = ''; loadLegislatie('legislatieGrid', getLegislatieDocs()); }
            const nameEl = document.getElementById('newLegDocName');
            const descEl = document.getElementById('newLegDocDesc');
            if (nameEl) nameEl.value = '';
            if (descEl) descEl.value = '';
        }
        window.addLegislationDoc = addLegislationDoc;

        function deleteLegislationDoc(index) {
            const docs = getLegislatieDocs();
            const removed = docs.splice(index, 1);
            saveLegislatieDocs(docs);
            writeAdminLog('LEGISLATIE', 'Document șters: ' + (removed[0]?.name || ''), 'info');
            loadAdminLegislationList();
            const grid = document.getElementById('legislatieGrid');
            if (grid) { grid.innerHTML = ''; loadLegislatie('legislatieGrid', getLegislatieDocs()); }
        }
        window.deleteLegislationDoc = deleteLegislationDoc;

        function moveLegislationDoc(index, direction) {
            const docs = getLegislatieDocs();
            const newIdx = index + direction;
            if (newIdx < 0 || newIdx >= docs.length) return;
            const tmp = docs[index]; docs[index] = docs[newIdx]; docs[newIdx] = tmp;
            saveLegislatieDocs(docs);
            loadAdminLegislationList();
            const grid = document.getElementById('legislatieGrid');
            if (grid) { grid.innerHTML = ''; loadLegislatie('legislatieGrid', getLegislatieDocs()); }
        }
        window.moveLegislationDoc = moveLegislationDoc;

        function loadAdminLegislationList() {
            const container = document.getElementById('adminLegislationList');
            if (!container) return;
            const docs = getLegislatieDocs();
            if (docs.length === 0) {
                container.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;padding:12px 0;">Nicio legislație adăugată.</p>';
                return;
            }
            container.innerHTML = docs.map((doc, i) => \`
                <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:8px;background:rgba(148,163,184,0.07);border-radius:8px;border:1px solid rgba(148,163,184,0.15);">
                    <i class="\${doc.icon}" style="color:#0a2463;font-size:1.1rem;min-width:24px;"></i>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;font-size:0.88rem;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${doc.name}</div>
                        <div style="font-size:0.78rem;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${doc.desc} &bull; <code style="font-size:0.72rem;">\${doc.file}</code></div>
                    </div>
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button onclick="moveLegislationDoc(\${i},-1)" class="admin-btn secondary" style="padding:4px 8px;font-size:0.72rem;" \${i===0?'disabled':''}>▲</button>
                        <button onclick="moveLegislationDoc(\${i},1)" class="admin-btn secondary" style="padding:4px 8px;font-size:0.72rem;" \${i===docs.length-1?'disabled':''}>▼</button>
                        <button onclick="deleteLegislationDoc(\${i})" style="padding:4px 10px;font-size:0.72rem;background:#ef4444;color:#fff;border:none;border-radius:6px;cursor:pointer;" title="Șterge">🗑</button>
                    </div>
                </div>
            \`).join('');
        }
        window.loadAdminLegislationList = loadAdminLegislationList;

`;

html = html.substring(0, initUploadZoneFn) + legislationFunctions + html.substring(initUploadZoneFn);
console.log('✅ Legislation management JS functions injected before initUploadZone.');

// ============================================================
// STEP 4: After initUploadZone() call inside the tab, also call loadAdminLegislationList()
// ============================================================
// Find the call initUploadZone(); that comes right after the registries template
const initUploadCall = html.lastIndexOf('\n                initUploadZone();');
const insertAfterInit = initUploadCall + '\n                initUploadZone();'.length;
html = html.substring(0, insertAfterInit) + '\n                loadAdminLegislationList();' + html.substring(insertAfterInit);
console.log('✅ loadAdminLegislationList() called on registries tab render.');

// ============================================================
// STEP 5: Update public page loadLegislatie call to use getLegislatieDocs()
// ============================================================
const legGridCall = html.indexOf("loadLegislatie('legislatieGrid', legislatieDocs)");
if (legGridCall >= 0) {
    html = html.substring(0, legGridCall) + "loadLegislatie('legislatieGrid', getLegislatieDocs())" + html.substring(legGridCall + "loadLegislatie('legislatieGrid', legislatieDocs)".length);
    console.log('✅ Public page loadLegislatie call updated.');
} else {
    console.warn('⚠️  Public page loadLegislatie call not found - may need manual update.');
}

// Also update the admin panel re-render call we added:
const adminRegridCall = html.lastIndexOf("loadLegislatie('legislatieGrid', legislatieDocs)");
if (adminRegridCall >= 0) {
    html = html.substring(0, adminRegridCall) + "loadLegislatie('legislatieGrid', getLegislatieDocs())" + html.substring(adminRegridCall + "loadLegislatie('legislatieGrid', legislatieDocs)".length);
    console.log('✅ Additional legislatieDocs reference updated.');
}

// ============================================================
// STEP 6: Write result
// ============================================================
console.log('\n💾 Writing updated index.html...');
fs.writeFileSync(htmlPath, html, 'utf8');
const size = (fs.statSync(htmlPath).size / (1024 * 1024)).toFixed(2);
console.log(`\n🎉 Done! Legislation admin panel added.`);
console.log(`📦 File size: ${size} MB`);

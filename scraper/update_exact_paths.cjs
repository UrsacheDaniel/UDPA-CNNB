const fs = require('fs');
const path = require('path');

const dirs = [
    'c:\\Users\\Dani\\Desktop\\CNNB',
    'c:\\Users\\Dani\\Desktop\\VNB',
    'c:\\Users\\Dani\\Downloads'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file.endsWith('.html') && (file.startsWith('deepseek_html_') || file === 'index.html')) {
            const filepath = path.join(dir, file);
            let content = fs.readFileSync(filepath, 'utf8');
            let original = content;

            // 1. Update downloadFile function to NOT prepend 'docs/'
            content = content.replace(
                "link.href = 'docs/' + filename;",
                "link.href = filename;"
            );

            // 2. Replace image/header background path
            content = content.replace(
                "url('images/header_bg.jpg')",
                "url('header_bg.jpg')"
            );
            content = content.replace(
                "url(\"images/header_bg.jpg\")",
                "url(\"header_bg.jpg\")"
            );

            // 3. Replace all 'images/diplome/' with 'diplome/'
            content = content.split('images/diplome/').join('diplome/');

            // 4. In galleryImages, map the missing teatru francofon image to the existing one
            content = content.replace(
                "diplome/phoca_thumb_l_teatru francofon 2025.jpg",
                "diplome/phoca_thumb_l_diploma_teatru_2025.jpg"
            );

            // 5. Replace PDF download buttons filenames
            content = content.replace(
                "downloadFile('sub_romana_2025.pdf')",
                "downloadFile('sub romana__2025.pdf')"
            );
            content = content.replace(
                "downloadFile('barem_romana_2025.pdf')",
                "downloadFile('barem romana __2025.pdf')"
            );
            content = content.replace(
                "downloadFile('sub_mate_2025.pdf')",
                "downloadFile('sub mate 2025.pdf')"
            );
            content = content.replace(
                "downloadFile('barem_matematica_2025.pdf')",
                "downloadFile('barem matematica __2025.pdf')"
            );
            content = content.replace(
                "downloadFile('Programa_limba_si_literatura_romana_clasele_III_IV.pdf')",
                "downloadFile('Programa _ Limba_si_literatura_romana_clasele a III-a-a-IV-a.pdf')"
            );
            content = content.replace(
                "downloadFile('Programa_matematica_OMEN_5003.pdf')",
                "downloadFile('Programa pentru Mate __OMEN 5003_MATEMATICA_STIINTE_CLS III_IV.pdf')"
            );
            content = content.replace(
                "downloadFile('Cerere_inscriere_test_admitere_cl_Va.pdf')",
                "downloadFile('Cerere_inscriere_test.admitere.cl.Va.pdf')"
            );
            content = content.replace(
                "downloadFile('testare_clasa_5_2026_2027.jpg')",
                "downloadFile('testare clasa a 5 __ 2026_2027.jpg')"
            );
            content = content.replace(
                "downloadFile('Procedura_operationala_acordare_burse_2025.pdf')",
                "downloadFile('Procedura.operationala.acordare.burse_2025.pdf')"
            );
            content = content.replace(
                "downloadFile('HG_nr_732_04_09_2025.pdf')",
                "downloadFile('2025_HG. nr. 732_04.09.2025.pdf')"
            );
            content = content.replace(
                "downloadFile('2025_Cerere_bursa_VENITURI.pdf')",
                "downloadFile('2025_Cerere.bursa.VENITURI si anexe.pdf')"
            );
            content = content.replace(
                "downloadFile('2025_Cerere_bursa_ORFANI_PLASAMENT.pdf')",
                "downloadFile('2025_Cerere.bursa.ORFANI_PLASAMENT si anexe.pdf')"
            );
            content = content.replace(
                "downloadFile('2025_Cerere_bursa_MEDICALA.pdf')",
                "downloadFile('2025_Cerere.bursa.MEDICALA si anexe.pdf')"
            );
            content = content.replace(
                "downloadFile('2025_program_depunere_acte_spital.pdf')",
                "downloadFile('2025_program depunere acte la spital pentru bursa medicala.pdf')"
            );
            content = content.replace(
                "downloadFile('2025_Anunt_termen_depunere_dosare.pdf')",
                "downloadFile('2025_Anunt.termen.depunere.dosare.pdf')"
            );

            // 6. Replace legislatieDocs array filenames
            content = content.replace(
                "file: \"docs/Monitorul_Oficial_Partea_I_nr_675.pdf\"",
                "file: \"Monitorul Oficial Partea I nr. 675.pdf\""
            );
            content = content.replace(
                "file: \"docs/ROF_2025_2026.pdf\"",
                "file: \"ROF_2025_2026.pdf\""
            );
            content = content.replace(
                "file: \"docs/ROI_2025_2026.pdf\"",
                "file: \"ROI_2025_2026.pdf\""
            );
            content = content.replace(
                "file: \"docs/Statutul_elevului.pdf\"",
                "file: \"Statutul elevului.pdf\""
            );
            content = content.replace(
                "file: \"docs/accesul_baza_sportiva_CNNB.pdf\"",
                "file: \"accesul baza sportiva CNNB.pdf\""
            );
            content = content.replace(
                "file: \"docs/Autorizatie_securitate_la_incendiu.pdf\"",
                "file: \"Autorizatie.securitate.la.incendiu.pdf\""
            );
            content = content.replace(
                "file: \"docs/Plan_managerial_director_2025_2026.pdf\"",
                "file: \"Plan.managerial director.2025_2026.pdf\""
            );
            content = content.replace(
                "file: \"docs/Plan_managerial_director_adjunct_2025_2026.pdf\"",
                "file: \"Plan.managerial.director.adjunct_2025_2026.pdf\""
            );

            // 7. Replace simulatedAttachments names
            content = content.replace(
                "name: 'Cerere_inscriere_test_admitere_cl_Va.pdf'",
                "name: 'Cerere_inscriere_test.admitere.cl.Va.pdf'"
            );
            content = content.replace(
                "name: 'HG_nr_732_04_09_2025.pdf'",
                "name: '2025_HG. nr. 732_04.09.2025.pdf'"
            );
            content = content.replace(
                "name: 'Procedura_operationala_acordare_burse_2025.pdf'",
                "name: 'Procedura.operationala.acordare.burse_2025.pdf'"
            );

            // 8. Replace dropdown selectors
            content = content.replace(
                'value="docs/ROF_2025_2026.pdf"',
                'value="ROF_2025_2026.pdf"'
            );
            content = content.replace(
                'value="docs/ROI_2025_2026.pdf"',
                'value="ROI_2025_2026.pdf"'
            );
            content = content.replace(
                'value="docs/Statutul_elevului.pdf"',
                'value="Statutul elevului.pdf"'
            );
            content = content.replace(
                '>ROF_2025_2026.pdf</option>',
                '>ROF_2025_2026.pdf</option>'
            );
            content = content.replace(
                '>ROI_2025_2026.pdf</option>',
                '>ROI_2025_2026.pdf</option>'
            );
            content = content.replace(
                '>Statutul_elevului.pdf</option>',
                '>Statutul elevului.pdf</option>'
            );

            if (content !== original) {
                fs.writeFileSync(filepath, content, 'utf8');
                console.log(`Successfully updated: ${filepath}`);
            } else {
                console.log(`No changes needed or file already updated: ${filepath}`);
            }
        }
    });
});

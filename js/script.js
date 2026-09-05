/* ============================================================
   js/script.js — Main entry point (minimal, loads other modules)
   ============================================================ */
(function() {
    'use strict';

    console.log('SchoolERP · Frontend Phase 1 loaded.');

    // Any additional initialization can go here.
    // The settings engine is self-contained in settings.html.

    // ---- Check for settings persistence and apply ----
    const stored = localStorage.getItem('schoolERP_settings');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            const root = document.documentElement;
            const colorMap = {
                primaryColor: '--primary-color',
                secondaryColor: '--secondary-color',
                successColor: '--success-color',
                dangerColor: '--danger-color',
                warningColor: '--warning-color',
                bgColor: '--background-color',
                surfaceColor: '--surface-color'
            };
            Object.keys(colorMap).forEach(key => {
                if (data[key]) {
                    root.style.setProperty(colorMap[key], data[key]);
                }
            });
            if (data.borderRadius) {
                root.style.setProperty('--radius', data.borderRadius + 'px');
            }
            if (data.schoolName) {
                document.querySelectorAll('.sidebar-brand-text').forEach(el => {
                    el.textContent = data.schoolName;
                });
                const sub = document.querySelector('.page-subtitle');
                if (sub && !sub.textContent.includes('Configuration')) {
                    // Only update if it's not already showing config
                }
            }
        } catch (e) {
            // ignore
        }
    }

})();

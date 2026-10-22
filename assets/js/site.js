// ── site.js ──
// Shared behaviour for every page: language switch (ES/EN), scroll reveal,
// screenshot lightbox and the header's dark mode over dark heroes.

(() => {
    const root = document.documentElement;
    const LANG_KEY = 'rts-lang';
    const LANGS = ['es', 'en'];

    // ── Language ──
    const readSavedLang = () => {
        try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
    };

    const browserLang = () =>
        (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';

    const setLang = (lang) => {
        root.dataset.lang = lang;
        root.lang = lang;
        document.querySelectorAll('[data-set-lang]').forEach(b =>
            b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
        const title = root.dataset[`title${lang === 'es' ? 'Es' : 'En'}`];
        if (title) document.title = title;
        try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    };

    const saved = readSavedLang();
    setLang(LANGS.includes(saved) ? saved : browserLang());

    document.addEventListener('DOMContentLoaded', () => {
        setLang(root.dataset.lang);
        document.querySelectorAll('[data-set-lang]').forEach(b =>
            b.addEventListener('click', () => setLang(b.dataset.setLang)));

        // ── Scroll reveal ──
        const revealables = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            revealables.forEach(el => observer.observe(el));
        } else {
            revealables.forEach(el => el.classList.add('visible'));
        }

        // ── Header over dark sections ([data-header-dark]) ──
        const header = document.querySelector('.site-header');
        const darkZones = document.querySelectorAll('[data-header-dark]');
        if (header && darkZones.length) {
            const updateHeader = () => {
                const probe = header.offsetHeight / 2;
                const overDark = [...darkZones].some(zone => {
                    const r = zone.getBoundingClientRect();
                    return r.top <= probe && r.bottom > probe;
                });
                header.classList.toggle('on-dark', overDark);
            };
            window.addEventListener('scroll', updateHeader, { passive: true });
            window.addEventListener('resize', updateHeader);
            updateHeader();
        }

        // ── Lightbox ──
        const triggers = document.querySelectorAll('[data-lightbox]');
        if (triggers.length) {
            const box = document.createElement('div');
            box.className = 'lightbox';
            box.setAttribute('role', 'dialog');
            box.setAttribute('aria-modal', 'true');
            const boxImg = document.createElement('img');
            box.appendChild(boxImg);
            document.body.appendChild(box);

            let opener = null;
            const close = () => {
                box.classList.remove('open');
                if (opener) opener.focus();
            };
            triggers.forEach(btn => btn.addEventListener('click', () => {
                const img = btn.querySelector('img');
                boxImg.src = img.currentSrc || img.src;
                boxImg.alt = img.alt;
                box.setAttribute('aria-label', img.alt);
                opener = btn;
                box.classList.add('open');
            }));
            box.addEventListener('click', close);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && box.classList.contains('open')) close();
            });
        }
    });
})();

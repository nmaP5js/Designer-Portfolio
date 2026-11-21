/* ==========================================================================
   LANDING PAGE V2 — ENTRANCE DÉCODAGE TYPOGRAPHIQUE + LOCOMOTIVE HOVER SHUFFLE
   Orchestré par GSAP (gsap.timeline) — 0 % bloquant, fallback instantané.
   ========================================================================== */

(function () {
    'use strict';

    const SHUFFLE_DURATION = 0.25;
    const SHUFFLE_STEPS = 4;
    const SHUFFLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const NUMERIC_CHARS = '0123456789';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function scramblePreserveSpaces(originalText, charset) {
        const pool = charset || SHUFFLE_CHARS;
        let out = '';
        for (let i = 0; i < originalText.length; i++) {
            const ch = originalText[i];
            if (ch === ' ' || ch === '_' || ch === '-' || ch === '·' || ch === '(' || ch === ')' || ch === '/') {
                out += ch;
            } else {
                out += pool.charAt(Math.floor(Math.random() * pool.length));
            }
        }
        return out;
    }

    /**
     * Décodage progressif de gauche à droite piloté par GSAP (sans saut de largeur).
     */
    function createDecodeTween(el, duration, charset) {
        if (!el || typeof window.gsap === 'undefined') return null;
        const original = el.dataset.originalText || el.textContent;
        el.dataset.originalText = original;
        const pool = charset || SHUFFLE_CHARS;
        const state = { progress: 0 };

        return window.gsap.to(state, {
            progress: 1,
            duration: duration,
            ease: 'none',
            onUpdate: () => {
                const lockedCount = Math.floor(state.progress * original.length);
                let text = '';
                for (let i = 0; i < original.length; i++) {
                    const ch = original[i];
                    if (i < lockedCount || ch === ' ' || ch === '·' || ch === '(' || ch === ')' || ch === '/' || ch === '-') {
                        text += ch;
                    } else {
                        text += pool.charAt(Math.floor(Math.random() * pool.length));
                    }
                }
                el.textContent = text;
            },
            onComplete: () => {
                el.textContent = original;
            }
        });
    }

    /* --- 1. ENTRANCE ANIMATION : DÉCODAGE TYPOGRAPHIQUE + MASQUE + FILETS --- */
    function runEntranceAnimation() {
        const root = document.documentElement;

        if (reducedMotion || typeof window.gsap === 'undefined') {
            root.classList.remove('js-entrance');
            return;
        }

        const gsap = window.gsap;
        const kickerEl = document.querySelector('.hero-kicker');
        const kickerDecodeEl = document.querySelector('[data-entrance-decode]');
        const revealLines = Array.from(document.querySelectorAll('.reveal-line-inner'));
        const heroAside = document.querySelector('.hero-aside');
        const listBar = document.querySelector('.c-featured-links_bar');
        const countEl = document.getElementById('locoCount');
        const listEl = document.querySelector('.c-featured-links_list');
        const rowItems = Array.from(document.querySelectorAll('.c-featured-links_item'));
        const rowTitles = Array.from(document.querySelectorAll('.c-featured-links_title'));
        const rowLabels = Array.from(document.querySelectorAll('.c-featured-links_label'));
        const rowMetas = Array.from(document.querySelectorAll('.c-featured-links_meta'));
        const mobileThumbs = Array.from(document.querySelectorAll('.c-mobile-thumb'));

        const tl = gsap.timeline({
            defaults: { ease: 'power4.out' },
            onComplete: () => {
                root.classList.remove('js-entrance');
                gsap.set(
                    [kickerEl, heroAside, listBar, listEl, ...revealLines, ...rowItems, ...rowTitles, ...rowLabels, ...rowMetas, ...mobileThumbs].filter(Boolean),
                    { clearProps: 'all' }
                );
            }
        });

        // 1. Kicker + décodage progressif
        if (kickerEl) {
            tl.fromTo(kickerEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0);
        }
        if (kickerDecodeEl) {
            const decodeTween = createDecodeTween(kickerDecodeEl, 0.48, SHUFFLE_CHARS);
            if (decodeTween) tl.add(decodeTween, 0.02);
        }

        // 2. Titre Hero masqué ligne par ligne (y: 0 neutralise le translateY CSS anti-FOUC)
        if (revealLines.length) {
            tl.fromTo(
                revealLines,
                { y: 0, yPercent: 112 },
                { y: 0, yPercent: 0, duration: 0.72, stagger: 0.085, ease: 'power4.out' },
                0.06
            );
        }

        // 3. Bloc bio & liens à droite
        if (heroAside) {
            tl.fromTo(
                heroAside,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.56, ease: 'power3.out' },
                0.22
            );
        }

        // 4. Barre "Projets récents (08)" + décodage du compteur
        if (listBar) {
            tl.fromTo(listBar, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.32);
        }
        if (countEl) {
            const countTween = createDecodeTween(countEl, 0.3, NUMERIC_CHARS);
            if (countTween) tl.add(countTween, 0.34);
        }

        // 5. Tracé gauche -> droite des filets 1px + entrée en cascade des lignes
        if (rowItems.length) {
            tl.fromTo(
                rowItems,
                { '--rule-scale': 0 },
                { '--rule-scale': 1, duration: 0.58, stagger: 0.045, ease: 'power3.out' },
                0.36
            );
        }
        if (listEl) {
            tl.fromTo(
                listEl,
                { '--rule-scale': 0 },
                { '--rule-scale': 1, duration: 0.58, ease: 'power3.out' },
                0.36 + rowItems.length * 0.045
            );
        }

        if (rowTitles.length) {
            tl.fromTo(
                rowTitles,
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 0.56, stagger: 0.045, ease: 'power4.out' },
                0.4
            );
        }

        if (mobileThumbs.length) {
            tl.fromTo(
                mobileThumbs,
                { opacity: 0, scale: 0.94 },
                { opacity: 1, scale: 1, duration: 0.42, stagger: 0.045, ease: 'power3.out' },
                0.42
            );
        }

        // 6. Décodage synchronisé des index 01..08 et métadonnées à droite
        if (rowLabels.length) {
            tl.fromTo(
                rowLabels,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, stagger: 0.045, ease: 'power2.out' },
                0.42
            );
            rowLabels.forEach((label, idx) => {
                const t = createDecodeTween(label, 0.24, NUMERIC_CHARS);
                if (t) tl.add(t, 0.42 + idx * 0.045);
            });
        }

        if (rowMetas.length) {
            tl.fromTo(
                rowMetas,
                { opacity: 0 },
                { opacity: 1, duration: 0.32, stagger: 0.045, ease: 'power2.out' },
                0.44
            );
            rowMetas.forEach((meta, idx) => {
                const disciplineSpan = meta.querySelector('.c-featured-links_discipline');
                if (disciplineSpan) {
                    const t = createDecodeTween(disciplineSpan, 0.28, SHUFFLE_CHARS);
                    if (t) tl.add(t, 0.44 + idx * 0.045);
                }
            });
        }
    }

    /* --- 2. FILTRAGE PAR DISCIPLINE --- */
    const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
    const items = Array.from(document.querySelectorAll('.c-featured-links_item'));
    const countEl = document.getElementById('locoCount');

    function applyFilter(category) {
        let visible = 0;
        items.forEach(item => {
            const match = category === 'all' || item.getAttribute('data-category') === category;
            item.classList.toggle('is-hidden', !match);
            if (match) visible++;
        });
        if (countEl) {
            countEl.textContent = `(${String(visible).padStart(2, '0')})`;
        }
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter') || 'all';
            filterButtons.forEach(b => {
                const active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-pressed', String(active));
            });
            applyFilter(category);
        });
    });

    /* --- 3. HOVER SHUFFLE AVEC GSAP.TIMELINE() (MÉCANIQUE LOCOMOTIVE.CA) --- */
    function initHoverShuffle() {
        if (reducedMotion || !canHover || typeof window.gsap === 'undefined') return;

        const shuffleItems = Array.from(document.querySelectorAll('[data-hover-shuffle]'));
        shuffleItems.forEach(item => {
            let activeTimeline = null;
            const targets = item.dataset.hoverShuffle === 'children'
                ? Array.from(item.querySelectorAll('[data-hover-shuffle-child]'))
                : [item];

            targets.forEach(el => {
                if (!el.dataset.originalText) {
                    el.dataset.originalText = el.textContent;
                }
            });

            function restoreAll() {
                targets.forEach(el => {
                    if (el.dataset.originalText !== undefined) {
                        el.textContent = el.dataset.originalText;
                    }
                });
            }

            item.addEventListener('mouseenter', () => {
                if (activeTimeline) activeTimeline.kill();

                activeTimeline = window.gsap.timeline({
                    onComplete: restoreAll
                });

                const stepInterval = SHUFFLE_DURATION / SHUFFLE_STEPS;
                for (let step = 0; step < SHUFFLE_STEPS; step++) {
                    targets.forEach(el => {
                        activeTimeline.add(() => {
                            el.textContent = scramblePreserveSpaces(el.dataset.originalText || '');
                        }, step * stepInterval);
                    });
                }
                activeTimeline.add(restoreAll, SHUFFLE_DURATION);
            });

            item.addEventListener('mouseleave', () => {
                if (activeTimeline) {
                    activeTimeline.kill();
                    activeTimeline = null;
                }
                restoreAll();
            });
        });
    }

    /* --- 4. COPIE D'EMAIL AVEC FALLBACK MAILTO --- */
    function initCopyEmail() {
        const copyLinks = Array.from(document.querySelectorAll('[data-copy-email]'));
        copyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const email = link.getAttribute('data-copy-email') || 'nmafreelance@gmail.com';
                const labelEl = link.querySelector('[data-copy-label]') || link;
                const original = labelEl.textContent;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    e.preventDefault();
                    navigator.clipboard.writeText(email).then(() => {
                        labelEl.textContent = 'Email copié';
                        setTimeout(() => {
                            labelEl.textContent = original;
                        }, 1800);
                    }).catch(() => {
                        window.location.href = 'mailto:' + email;
                    });
                }
            });
        });
    }

    function boot() {
        runEntranceAnimation();
        initHoverShuffle();
        initCopyEmail();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();

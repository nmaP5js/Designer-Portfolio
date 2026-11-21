/* ==========================================================================
   PAGE À PROPOS V2 — ENTRANCE GSAP, CHAPITRAGE ACTIF & FILTRES EXPÉRIENCES
   ========================================================================== */

(function () {
    'use strict';

    const SHUFFLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function createDecodeTween(el, duration) {
        if (!el || typeof window.gsap === 'undefined') return null;
        const original = el.dataset.originalText || el.textContent;
        el.dataset.originalText = original;
        const state = { progress: 0 };

        return window.gsap.to(state, {
            progress: 1,
            duration: duration,
            ease: 'none',
            onUpdate: () => {
                const lockedCount = Math.floor(state.progress * original.length);
                let out = '';
                for (let i = 0; i < original.length; i++) {
                    const ch = original[i];
                    if (i < lockedCount || ch === ' ' || ch === '·' || ch === '©' || ch === '—' || ch === '-') {
                        out += ch;
                    } else {
                        out += SHUFFLE_CHARS.charAt(Math.floor(Math.random() * SHUFFLE_CHARS.length));
                    }
                }
                el.textContent = out;
            },
            onComplete: () => {
                el.textContent = original;
            }
        });
    }

    function runEntranceAnimation() {
        const root = document.documentElement;
        if (reducedMotion || typeof window.gsap === 'undefined') {
            root.classList.remove('js-entrance');
            return;
        }

        const gsap = window.gsap;
        const kicker = document.querySelector('.about-kicker');
        const decodeEl = document.querySelector('[data-entrance-decode]');
        const revealLines = Array.from(document.querySelectorAll('.about-title .reveal-line-inner'));
        const leadMeta = document.querySelector('.about-lead-meta');
        const actions = document.querySelector('.about-actions');
        const portraitCard = document.querySelector('.about-portrait-card');

        const tl = gsap.timeline({
            defaults: { ease: 'power4.out' },
            onComplete: () => {
                root.classList.remove('js-entrance');
                gsap.set(
                    [kicker, leadMeta, actions, portraitCard, ...revealLines].filter(Boolean),
                    { clearProps: 'all' }
                );
            }
        });

        if (kicker) {
            tl.fromTo(kicker, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.34, ease: 'power2.out' }, 0);
        }
        if (decodeEl) {
            const decodeTween = createDecodeTween(decodeEl, 0.45);
            if (decodeTween) tl.add(decodeTween, 0.02);
        }

        if (revealLines.length) {
            tl.fromTo(
                revealLines,
                { y: 0, yPercent: 112 },
                { y: 0, yPercent: 0, duration: 0.72, stagger: 0.085, ease: 'power4.out' },
                0.06
            );
        }

        if (portraitCard) {
            tl.fromTo(
                portraitCard,
                { opacity: 0, y: 20, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
                0.14
            );
        }

        if (leadMeta) {
            tl.fromTo(leadMeta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.24);
        }

        if (actions) {
            tl.fromTo(actions, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.32);
        }
    }

    function initScrollReveals() {
        const nodes = Array.from(document.querySelectorAll('.reveal-on-scroll'));
        if (!nodes.length || reducedMotion || typeof IntersectionObserver === 'undefined') {
            nodes.forEach((n) => n.classList.add('is-visible'));
            return;
        }

        document.documentElement.classList.add('js-scroll-ready');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
        );

        nodes.forEach((node) => observer.observe(node));
    }

    function initChapterNav() {
        const links = Array.from(document.querySelectorAll('.about-chapter-link'));
        if (!links.length) return;

        const sections = links
            .map((link) => {
                const id = link.getAttribute('href')?.replace(/^#/, '');
                return id ? { link, section: document.getElementById(id) } : null;
            })
            .filter((item) => item && item.section);

        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                const target = document.getElementById(href.slice(1));
                if (!target) return;
                e.preventDefault();
                if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                    window.lenis.scrollTo(target, { offset: -116, duration: 0.85 });
                } else {
                    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                }
            });
        });

        if (typeof IntersectionObserver === 'undefined' || !sections.length) return;

        const updateActive = () => {
            const marker = window.scrollY + 180;
            let current = sections[0];
            for (const item of sections) {
                if (item.section.offsetTop <= marker) {
                    current = item;
                }
            }
            sections.forEach(({ link }) => link.classList.toggle('is-active', link === current.link));
        };

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }

    function initExperienceFilters() {
        const buttons = Array.from(document.querySelectorAll('.about-filter-btn'));
        const entries = Array.from(document.querySelectorAll('.exp-entry'));
        const countEl = document.getElementById('expCount');
        if (!buttons.length || !entries.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.expFilter || 'all';

                buttons.forEach((b) => {
                    const active = b === btn;
                    b.classList.toggle('is-active', active);
                    b.setAttribute('aria-pressed', String(active));
                });

                let visible = 0;
                entries.forEach((entry) => {
                    const type = entry.dataset.expType || '';
                    const show = filter === 'all' || type === filter;
                    entry.classList.toggle('is-hidden', !show);
                    if (show) {
                        visible++;
                        entry.classList.add('is-visible');
                    }
                });

                if (countEl) {
                    countEl.textContent = '(' + String(visible).padStart(2, '0') + ')';
                }
            });
        });
    }

    function initCopyEmail() {
        const triggers = document.querySelectorAll('[data-copy-email]');
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                const email = trigger.getAttribute('data-copy-email');
                if (!email || !navigator.clipboard) return;
                e.preventDefault();
                navigator.clipboard.writeText(email).then(() => {
                    const label = trigger.querySelector('[data-copy-label]') || trigger;
                    const original = label.textContent;
                    label.textContent = 'Email copié ✓';
                    setTimeout(() => {
                        label.textContent = original;
                    }, 2200);
                }).catch(() => {
                    window.location.href = 'mailto:' + email;
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        runEntranceAnimation();
        initScrollReveals();
        initChapterNav();
        initExperienceFilters();
        initCopyEmail();
    });
})();

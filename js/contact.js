/* ==========================================================================
   PAGE CONTACT V2 — ENTRANCE GSAP & COPIE EMAIL EN UN CLIC
   ========================================================================== */

(function () {
    'use strict';

    const EMAIL = 'nmafreelance@gmail.com';
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
        const kicker = document.querySelector('.contact-kicker');
        const decodeEl = document.querySelector('[data-entrance-decode]');
        const revealLines = Array.from(document.querySelectorAll('.contact-title .reveal-line-inner'));
        const lead = document.querySelector('.contact-lead');
        const emailBox = document.querySelector('.contact-email-box');
        const links = document.querySelector('.contact-links');

        const tl = gsap.timeline({
            defaults: { ease: 'power4.out' },
            onComplete: () => {
                root.classList.remove('js-entrance');
                gsap.set(
                    [kicker, lead, emailBox, links, ...revealLines].filter(Boolean),
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
                { y: 0, yPercent: 0, duration: 0.72, stagger: 0.09, ease: 'power4.out' },
                0.06
            );
        }
        if (lead) {
            tl.fromTo(lead, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.48, ease: 'power3.out' }, 0.22);
        }
        if (emailBox) {
            tl.fromTo(emailBox, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.54, ease: 'power3.out' }, 0.28);
        }
        if (links) {
            tl.fromTo(links, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.44, ease: 'power3.out' }, 0.36);
        }
    }

    function initCopyEmail() {
        const copyBtn = document.getElementById('copyEmailBtn');
        const statusEl = document.getElementById('copyEmailStatus');
        if (!copyBtn) return;

        let resetTimer = null;

        copyBtn.addEventListener('click', () => {
            if (!navigator.clipboard) {
                window.location.href = 'mailto:' + EMAIL;
                return;
            }

            navigator.clipboard.writeText(EMAIL).then(() => {
                const label = copyBtn.querySelector('[data-copy-text]');
                const original = label ? (label.dataset.original || label.textContent) : '';
                if (label) {
                    label.dataset.original = original;
                    label.textContent = 'Adresse copiée ✓';
                }
                copyBtn.classList.add('is-copied');
                if (statusEl) statusEl.classList.add('is-visible');

                clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {
                    if (label) label.textContent = original;
                    copyBtn.classList.remove('is-copied');
                    if (statusEl) statusEl.classList.remove('is-visible');
                }, 2400);
            }).catch(() => {
                window.location.href = 'mailto:' + EMAIL;
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        runEntranceAnimation();
        initCopyEmail();
    });
})();

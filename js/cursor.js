/* ==========================================================================
   CURSEUR CONTEXTUEL V2 — OPTION A (POINT 8PX -> HALO -> PILULE SMART LABEL)
   - 60fps via requestAnimationFrame + transform: translate3d (zéro dépendance)
   - Remplacement natif activé uniquement au premier mouvement souris fine
   - Désactivé automatiquement sur tactile / prefers-reduced-motion
   ========================================================================== */

(function () {
    'use strict';

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const cursorEl = document.createElement('div');
    cursorEl.className = 'nma-cursor is-hidden';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.innerHTML = '<div class="nma-cursor-shell"><span class="nma-cursor-label"></span></div>';

    const shellEl = cursorEl.querySelector('.nma-cursor-shell');
    const labelEl = cursorEl.querySelector('.nma-cursor-label');

    let mounted = false;
    let enabled = false;
    let visible = false;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = null;

    let activeState = 'default'; // 'default' | 'hover' | 'pill'
    let activeLabel = '';
    let isAccent = false;
    let isLight = false;
    let feedbackLockUntil = 0;

    function mount() {
        if (mounted || !document.body) return;
        document.body.appendChild(cursorEl);
        mounted = true;
    }

    function setVisualState(state, label, opts) {
        const options = opts || {};
        const nextAccent = Boolean(options.accent);
        const nextLight = Boolean(options.light);

        if (
            state === activeState &&
            label === activeLabel &&
            nextAccent === isAccent &&
            nextLight === isLight
        ) {
            return;
        }

        activeState = state;
        activeLabel = label || '';
        isAccent = nextAccent;
        isLight = nextLight;

        cursorEl.classList.toggle('is-hover', state === 'hover');
        cursorEl.classList.toggle('is-pill', state === 'pill');
        cursorEl.classList.toggle('is-accent', nextAccent);
        cursorEl.classList.toggle('is-light', nextLight);

        if (labelEl) {
            labelEl.textContent = activeLabel;
        }
    }

    function resolveTarget(el) {
        if (!el || el.nodeType !== 1) {
            return { state: 'default', label: '' };
        }

        // Champs de saisie : on cache le curseur custom pour garder le curseur texte natif
        if (el.closest('input, textarea, select, [contenteditable="true"]')) {
            return { state: 'native', label: '' };
        }

        // Lightbox active (fond sombre -> pilule claire pour contraste maximal)
        const modal = el.closest('#imageModal.active');
        if (modal) {
            if (el.closest('#modalClose, #zoomToggleBtn, .thumb-item, .lightbox-controls, button')) {
                return { state: 'hover', label: '', light: true };
            }
            const modalImg = el.closest('#modalImage');
            if (modalImg) {
                const zoomed = modalImg.classList.contains('zoomed');
                return { state: 'pill', label: zoomed ? 'ZOOM −' : 'ZOOM +', light: true };
            }
            return { state: 'pill', label: 'FERMER ×', light: true };
        }

        // Surcharge explicite via attribut data-cursor
        const explicit = el.closest('[data-cursor]');
        if (explicit) {
            const val = explicit.getAttribute('data-cursor') || '';
            if (val === 'none') return { state: 'default', label: '' };
            if (val) return { state: 'pill', label: val };
        }

        // 1. Ligne de projet (home)
        if (el.closest('.c-featured-links_item')) {
            return { state: 'pill', label: 'VOIR' };
        }

        // 2. Copie d'email (home, about, contact)
        if (el.closest('[data-copy-email], #copyEmailBtn')) {
            return { state: 'pill', label: 'COPIER' };
        }

        // 3. Cartes projet précédent / suivant
        const navCard = el.closest('.project-nav-card');
        if (navCard) {
            return {
                state: 'pill',
                label: navCard.classList.contains('prev') ? '← PRÉC.' : 'SUIV. →'
            };
        }

        // 4. Visuels zoomables dans les études de cas
        if (el.closest('.zoomable, .bento-item, .visual-main-item, .visual-grid-item, .main-image, .bento-image, .secondary-image')) {
            return { state: 'pill', label: 'ZOOM +' };
        }

        // 5. Liens externes (LinkedIn, GitHub, démos, V1)
        const extLink = el.closest('a[target="_blank"], .top-nav-cta');
        if (extLink) {
            // Sur le petit badge "V1 ↗" de la nav, on garde le halo léger pour ne pas le masquer
            if (extLink.classList.contains('top-nav-cta')) {
                return { state: 'hover', label: '' };
            }
            return { state: 'pill', label: 'OUVRIR' };
        }

        // 6. Petits éléments cliquables standard (nav, filtres, boutons CTA, liens)
        if (el.closest('a, button, [role="button"], label, summary')) {
            return { state: 'hover', label: '' };
        }

        return { state: 'default', label: '' };
    }

    function updateFromElement(el) {
        if (Date.now() < feedbackLockUntil) return;

        const resolved = resolveTarget(el);
        if (resolved.state === 'native') {
            cursorEl.classList.add('is-hidden');
            return;
        }

        if (visible) {
            cursorEl.classList.remove('is-hidden');
        }
        setVisualState(resolved.state, resolved.label, {
            accent: resolved.accent,
            light: resolved.light
        });
    }

    function tick() {
        const ease = activeState === 'pill' ? 0.24 : 0.45;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        cursorEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
            rafId = window.requestAnimationFrame(tick);
        } else {
            currentX = targetX;
            currentY = targetY;
            cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            rafId = null;
        }
    }

    function scheduleTick() {
        if (rafId === null) {
            rafId = window.requestAnimationFrame(tick);
        }
    }

    function activateOnMouseMove(e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;

        mount();
        targetX = e.clientX;
        targetY = e.clientY;

        if (!enabled) {
            enabled = true;
            currentX = targetX;
            currentY = targetY;
            document.documentElement.classList.add('has-custom-cursor');
            cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }

        if (!visible) {
            visible = true;
            cursorEl.classList.remove('is-hidden');
        }

        updateFromElement(e.target);
        scheduleTick();
    }

    function onMouseDown() {
        if (!enabled) return;
        cursorEl.classList.add('is-down');
    }

    function onMouseUp(e) {
        if (!enabled) return;
        cursorEl.classList.remove('is-down');

        // Retour immédiat "COPIÉ ✓" en bleu #0052ff quand on clique un bouton/lien de copie d'email
        const copyTrigger = e.target && e.target.closest ? e.target.closest('[data-copy-email], #copyEmailBtn') : null;
        if (copyTrigger) {
            feedbackLockUntil = Date.now() + 1800;
            setVisualState('pill', 'COPIÉ ✓', { accent: true });
            setTimeout(() => {
                if (Date.now() >= feedbackLockUntil) {
                    const under = document.elementFromPoint(targetX, targetY);
                    updateFromElement(under);
                }
            }, 1820);
        }
    }

    function onMouseLeaveWindow() {
        if (!enabled) return;
        visible = false;
        cursorEl.classList.add('is-hidden');
    }

    function onScrollRefresh() {
        if (!enabled || !visible) return;
        const under = document.elementFromPoint(targetX, targetY);
        if (under) updateFromElement(under);
    }

    window.addEventListener('pointermove', activateOnMouseMove, { passive: true });
    window.addEventListener('pointerdown', onMouseDown, { passive: true });
    window.addEventListener('pointerup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    window.addEventListener('blur', onMouseLeaveWindow);
    window.addEventListener('scroll', onScrollRefresh, { passive: true });

    // Assure que shellEl reste prêt pour le rendu
    if (shellEl && document.readyState !== 'loading') {
        mount();
    } else {
        document.addEventListener('DOMContentLoaded', mount);
    }
})();

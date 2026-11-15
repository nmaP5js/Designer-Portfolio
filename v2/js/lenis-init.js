/* --- LENIS SMOOTH SCROLL — INITIALISATION GLOBALE --- */
/* Crée une instance Lenis sur chaque page pour un défilement soyeux.
   Expose `window.lenis` pour permettre aux autres scripts (nav.js, etc.)
   d'utiliser `lenis.scrollTo()` au lieu de `scrollIntoView()`.           */

(function () {
    'use strict';

    // Respecter les préférences d'accessibilité
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        touchMultiplier: 1.5
    });

    // Exposer l'instance pour nav.js et autres scripts
    window.lenis = lenis;

    // Boucle d'animation via requestAnimationFrame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
})();

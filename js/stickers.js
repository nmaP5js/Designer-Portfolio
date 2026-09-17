/* --- FLOWER GARDEN SYSTEM — Script centralisé --- */
/* Utilisation : <script src="js/stickers.js" defer></script>
   Puis optionnellement dans un <script> inline :
     initStickers({ finalOpacity: 0.4 });  // pour pages avec contenu
   Par défaut initStickers() est appelé automatiquement au load.
*/

(function () {
    'use strict';

    // Respect de la préférence utilisateur pour la réduction de mouvement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const DEFAULT_CONFIG = {
        basePath: 'stickers/',
        stickers: ['Flower1.png', 'Flower2.png', 'Flower3.png', 'Flower4.png'],
        maxStickers: 380,
        displayTime: 70000,
        stickerSize: { min: 34, max: 92 },
        animations: ['pop-in', 'zoom-in', 'spin-in'],
        finalOpacity: 1,      // Opacité finale (1 = plein, 0.4 = semi-transparent)
        enableClick: true,    // Activer le spawn au clic
        clickExcludes: 'button, a, input, textarea, .top-nav', // Sélecteurs exclus du clic
    };

    let config = Object.assign({}, DEFAULT_CONFIG);
    let activeStickers = [];
    let stickersContainer = null;
    let ambientTimer = null;

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createSticker(x, y, delay, customSize) {
        if (!stickersContainer || prefersReducedMotion) return;
        if (activeStickers.length >= config.maxStickers) {
            const oldest = activeStickers.shift();
            if (oldest && oldest.parentNode) oldest.remove();
        }

        const sticker = document.createElement('div');
        const anim = config.animations[getRandomNumber(0, config.animations.length - 1)];
        const idx = getRandomNumber(0, config.stickers.length - 1);

        sticker.className = `sticker ${anim}`;
        sticker.style.backgroundImage = `url('${config.basePath + config.stickers[idx]}')`;

        const size = customSize != null ? customSize : getRandomNumber(config.stickerSize.min, config.stickerSize.max);
        const clampedX = Math.max(8, Math.min(x - size / 2, window.innerWidth - size - 8));
        const clampedY = Math.max(8, Math.min(y - size / 2, window.innerHeight - size - 8));

        sticker.style.left = `${clampedX}px`;
        sticker.style.top = `${clampedY}px`;
        sticker.style.width = `${size}px`;
        sticker.style.height = `${size}px`;
        sticker.style.transform = `scale(0.2) rotate(${getRandomNumber(-35, 35)}deg)`;
        if (delay > 0) sticker.style.animationDelay = `${delay}ms`;
        // Injecter l'opacité finale via custom property lue par les keyframes
        sticker.style.setProperty('--sticker-opacity', config.finalOpacity);

        stickersContainer.appendChild(sticker);
        activeStickers.push(sticker);

        const lifeTime = config.displayTime + getRandomNumber(-1500, 1500);
        setTimeout(() => {
            if (sticker.parentNode) {
                sticker.style.opacity = '0';
                sticker.style.transform = 'scale(0.2)';
                setTimeout(() => {
                    if (sticker.parentNode) sticker.remove();
                    activeStickers = activeStickers.filter(s => s !== sticker);
                }, 500);
            }
        }, lifeTime + delay);
    }

    // Fait éclore un bouquet de fleurs autour d'un point central
    function spawnBouquet(cx, cy, count, radius, baseDelay) {
        count = count != null ? count : 10;
        radius = radius != null ? radius : 80;
        baseDelay = baseDelay != null ? baseDelay : 0;

        for (let i = 0; i < count; i++) {
            let x, y, size;
            if (i === 0) {
                x = cx + (Math.random() - 0.5) * 16;
                y = cy + (Math.random() - 0.5) * 16;
                size = getRandomNumber(58, 92);
            } else {
                const angle = (i / (count - 1)) * Math.PI * 2 + (Math.random() - 0.5) * 0.75;
                const dist = (0.2 + Math.pow(Math.random(), 0.75) * 0.8) * radius;
                x = cx + Math.cos(angle) * dist;
                y = cy + Math.sin(angle) * dist;
                size = getRandomNumber(34, 80);
            }
            createSticker(x, y, baseDelay + i * 28, size);
        }
    }

    // Position aléatoire évitant le centre de l'écran (pour protéger logo / contenu)
    function getRandomScatterPosition() {
        const margin = 30;
        const w = window.innerWidth;
        const h = window.innerHeight;
        let x, y, attempts = 0;
        do {
            x = getRandomNumber(margin, w - margin);
            y = getRandomNumber(margin, h - margin);
            attempts++;
            const inCenter = (x > w * 0.35 && x < w * 0.65 && y > h * 0.35 && y < h * 0.65);
            if (!inCenter || attempts > 10) break;
        } while (true);
        return { x, y };
    }

    // Initialise le jardin de stickers (massifs denses + stickers éparpillés)
    function initGarden() {
        if (prefersReducedMotion) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isMobile = w < 600;

        const beds = isMobile ? [
            { x: w * 0.16, y: h * 0.18, count: 9, r: 52 },
            { x: w * 0.84, y: h * 0.18, count: 9, r: 52 },
            { x: w * 0.12, y: h * 0.50, count: 8, r: 48 },
            { x: w * 0.88, y: h * 0.50, count: 8, r: 48 },
            { x: w * 0.18, y: h * 0.82, count: 9, r: 52 },
            { x: w * 0.82, y: h * 0.82, count: 9, r: 52 }
        ] : [
            { x: w * 0.15, y: h * 0.20, count: 12, r: 90 },
            { x: w * 0.85, y: h * 0.18, count: 12, r: 90 },
            { x: w * 0.50, y: h * 0.12, count: 9,  r: 75 },
            { x: w * 0.08, y: h * 0.48, count: 10, r: 80 },
            { x: w * 0.92, y: h * 0.48, count: 10, r: 80 },
            { x: w * 0.14, y: h * 0.78, count: 13, r: 95 },
            { x: w * 0.86, y: h * 0.80, count: 13, r: 95 },
            { x: w * 0.50, y: h * 0.90, count: 11, r: 85 }
        ];

        let delay = 0;
        beds.forEach((bed) => {
            const jitterX = (Math.random() - 0.5) * (w * 0.06);
            const jitterY = (Math.random() - 0.5) * (h * 0.04);
            spawnBouquet(bed.x + jitterX, bed.y + jitterY, bed.count, bed.r, delay);
            delay += 100;
        });

        const scatterCount = isMobile ? 18 : 38;
        for (let i = 0; i < scatterCount; i++) {
            const pos = getRandomScatterPosition();
            createSticker(pos.x, pos.y, delay + i * 35, null);
        }

        // Floraison ambiante douce continue
        startAmbientBlooming();
    }

    // Floraison d'arrière-plan régulière pour garder le jardin vivant
    function startAmbientBlooming() {
        if (prefersReducedMotion) return;
        if (ambientTimer) clearInterval(ambientTimer);
        ambientTimer = setInterval(() => {
            if (document.hidden) return;
            if (activeStickers.length < config.maxStickers - 25) {
                const pos = getRandomScatterPosition();
                createSticker(pos.x, pos.y, 0, null);
            }
        }, 2500);
    }

    // Attache le listener de clic pour spawner des bouquets généreux
    function attachClickListener() {
        if (!config.enableClick || prefersReducedMotion) return;
        document.addEventListener('click', (e) => {
            if (config.clickExcludes && e.target.closest(config.clickExcludes)) return;
            spawnBouquet(e.clientX, e.clientY, getRandomNumber(8, 14), 75, 0);
            const extraCount = getRandomNumber(3, 5);
            for (let i = 0; i < extraCount; i++) {
                const pos = getRandomScatterPosition();
                createSticker(pos.x, pos.y, 70 + i * 45, null);
            }
        });
    }

    /**
     * Point d'entrée public.
     * @param {Object} options - Options de configuration (fusionnées avec les défauts)
     *   @param {number} options.finalOpacity - Opacité finale des stickers (0 à 1, défaut: 1)
     *   @param {boolean} options.enableClick - Activer le spawn au clic (défaut: true)
     *   @param {string} options.clickExcludes - Sélecteur CSS d'éléments exclus du clic
     */
    window.initStickers = function (options) {
        config = Object.assign({}, DEFAULT_CONFIG, options || {});
        stickersContainer = document.getElementById('stickersContainer');
        if (!stickersContainer) return;
        attachClickListener();
        initGarden();
    };

    // Auto-init au chargement si stickersContainer est présent
    window.addEventListener('load', () => {
        if (!window._stickersManualInit) {
            window.initStickers();
        }
    });
})();

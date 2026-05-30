/**
 * Premium Page Entry Shutter Preloader and Reveal Animation
 * Nicolas Marie Angélique - Portfolio
 */

(function () {
  const isFirstVisit = !sessionStorage.getItem('nma_visited');

  // 1. Inject styling immediately to avoid flash of content (FOUC)
  const style = document.createElement('style');
  style.id = 'nma-loader-styles';
  style.textContent = `
    /* Hide layout elements initially when preloader is active */
    .nma-loading-active .site-header,
    .nma-loading-active main,
    .nma-loading-active .site-footer,
    .nma-loading-active .menu-btn {
      opacity: 0 !important;
      transform: translateY(20px) !important;
    }

    /* Transition rules for layout elements */
    .site-header, main, .site-footer, .menu-btn {
      transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                  transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Shutter Container Grid */
    .nma-shutter-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999999;
      pointer-events: none;
      display: grid;
      grid-template-columns: 1fr 1.6fr 1fr 1.2fr;
      gap: 0;
      overflow: hidden;
    }

    @media (max-width: 859px) {
      .nma-shutter-container {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    /* Shutter Panel Columns */
    .nma-shutter-panel {
      background-color: #ffffff;
      height: 100%;
      transform: translateY(0);
      transition: transform 0.85s cubic-bezier(0.85, 0, 0.15, 1);
      pointer-events: all;
      border-right: 1px solid rgba(0, 0, 0, 0.04);
    }

    .nma-shutter-panel:last-child {
      border-right: none;
    }

    .nma-shutter-panel.slide-up {
      transform: translateY(-100%);
    }

    /* Typographic Counter Overlay */
    .nma-counter-overlay {
      position: fixed;
      bottom: 48px;
      right: 48px;
      z-index: 10000000;
      pointer-events: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      text-align: right;
      transition: opacity 0.4s ease;
      color: #0a0a0a;
    }

    @media (max-width: 600px) {
      .nma-counter-overlay {
        bottom: 30px;
        right: 30px;
      }
    }

    .nma-counter-overlay.fade-out {
      opacity: 0;
    }

    .nma-counter-number {
      font-size: 5.5rem;
      font-weight: 200;
      line-height: 0.85;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
    }

    @media (max-width: 600px) {
      .nma-counter-number {
        font-size: 4rem;
      }
    }

    .nma-counter-text {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      margin-top: 6px;
      color: #888888;
    }
  `;
  document.head.appendChild(style);

  // Set active loading class immediately to hide body content
  document.documentElement.classList.add('nma-loading-active');

  // Prevent flash of content by hiding the HTML temporarily until DOM starts loading
  const earlyStyle = document.createElement('style');
  earlyStyle.textContent = 'html.nma-loading-active body { opacity: 0 !important; }';
  document.head.appendChild(earlyStyle);

  // Reveal page immediately if it is a secondary visit
  function revealPageImmediately() {
    document.documentElement.classList.remove('nma-loading-active');
    earlyStyle.remove();
    document.body.style.opacity = '1';
    
    const header = document.querySelector('.site-header');
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('.site-footer');
    const menuBtn = document.querySelector('.menu-btn');

    if (header) {
      header.style.opacity = '0';
      header.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
      });
    }

    if (mainContent) {
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'translateY(10px)';
      setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
      }, 80);
    }

    if (footer || menuBtn) {
      if (footer) {
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(10px)';
      }
      if (menuBtn) {
        menuBtn.style.opacity = '0';
        menuBtn.style.transform = 'translateY(10px)';
      }
      setTimeout(() => {
        if (footer) {
          footer.style.opacity = '1';
          footer.style.transform = 'translateY(0)';
        }
        if (menuBtn) {
          menuBtn.style.opacity = '1';
          menuBtn.style.transform = 'translateY(0)';
        }
      }, 160);
    }
  }

  // Once the document is ready to render
  document.addEventListener('DOMContentLoaded', () => {
    // Remove the early body-hide style so contents can render behind preloader
    earlyStyle.remove();
    document.body.style.opacity = '1';

    const header = document.querySelector('.site-header');
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('.site-footer');
    const menuBtn = document.querySelector('.menu-btn');

    if (isFirstVisit) {
      // 1. Create Shutter Panel Structure (4 Panels)
      const shutterContainer = document.createElement('div');
      shutterContainer.className = 'nma-shutter-container';
      
      for (let i = 0; i < 4; i++) {
        const panel = document.createElement('div');
        panel.className = 'nma-shutter-panel';
        shutterContainer.appendChild(panel);
      }
      document.body.appendChild(shutterContainer);

      // 2. Create Counter Overlay Structure
      const counterOverlay = document.createElement('div');
      counterOverlay.className = 'nma-counter-overlay';
      
      const counterNum = document.createElement('div');
      counterNum.className = 'nma-counter-number';
      counterNum.textContent = '00';
      
      const counterText = document.createElement('div');
      counterText.className = 'nma-counter-text';
      counterText.textContent = 'NMA_PORTFOLIO_INIT // ©2026';

      counterOverlay.appendChild(counterNum);
      counterOverlay.appendChild(counterText);
      document.body.appendChild(counterOverlay);

      // Save visit status in session storage
      sessionStorage.setItem('nma_visited', 'true');

      // 3. Counter Progression Logic
      let count = 0;
      const counterInterval = setInterval(() => {
        // Natural incremental speed tick
        count += Math.floor(Math.random() * 4) + 1;
        if (count >= 100) {
          count = 100;
          clearInterval(counterInterval);
          
          // Trigger the grid animation reveal
          setTimeout(triggerReveal, 250);
        }
        counterNum.textContent = count.toString().padStart(2, '0');
      }, 25);

      function triggerReveal() {
        // Fade out counter overlay
        counterOverlay.classList.add('fade-out');

        // Staggered slide up of shutter panels (100ms offset per column)
        const panels = document.querySelectorAll('.nma-shutter-panel');
        panels.forEach((panel, index) => {
          setTimeout(() => {
            panel.classList.add('slide-up');
          }, index * 90);
        });

        // Staggered fade in and slide up of page content
        setTimeout(() => {
          document.documentElement.classList.remove('nma-loading-active');

          if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(15px)';
            requestAnimationFrame(() => {
              header.style.opacity = '1';
              header.style.transform = 'translateY(0)';
            });
          }

          if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(15px)';
            setTimeout(() => {
              mainContent.style.opacity = '1';
              mainContent.style.transform = 'translateY(0)';
            }, 150);
          }

          if (footer || menuBtn) {
            if (footer) {
              footer.style.opacity = '0';
              footer.style.transform = 'translateY(15px)';
            }
            if (menuBtn) {
              menuBtn.style.opacity = '0';
              menuBtn.style.transform = 'translateY(15px)';
            }
            setTimeout(() => {
              if (footer) {
                footer.style.opacity = '1';
                footer.style.transform = 'translateY(0)';
              }
              if (menuBtn) {
                menuBtn.style.opacity = '1';
                menuBtn.style.transform = 'translateY(0)';
              }
            }, 300);
          }
        }, 150);

        // Completely remove preloader elements from DOM after transitions end (1.5s later)
        setTimeout(() => {
          shutterContainer.remove();
          counterOverlay.remove();
        }, 1500);
      }

    } else {
      // Snappy load for subsequent visits
      revealPageImmediately();
    }
  });
})();

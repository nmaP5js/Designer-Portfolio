/**
 * Custom Interactive Dot Cursor
 * Nicolas Marie Angélique - Portfolio
 */

(function () {
  // Only initialize custom cursor on devices that support hover (fine pointer)
  if (window.matchMedia('(pointer: fine)').matches) {
    
    // Inject styles dynamically to avoid editing multiple CSS files
    const style = document.createElement('style');
    style.id = 'nma-cursor-styles';
    style.textContent = `
      @media (pointer: fine) {
        /* Hide default cursor on standard elements */
        html, body, 
        a, button, [role="button"], 
        .menu-btn, .lightbox-nav, .nav-area, .modal-close,
        .cv-entry-head, .nav-links a, .contact-grid a {
          cursor: none !important;
        }

        /* Allow default cursor on text fields and dropdowns for accessibility */
        input, textarea, select, option {
          cursor: auto !important;
        }

        /* The Custom Cursor Dot */
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background-color: #ffffff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 999999;
          mix-blend-mode: difference;
          opacity: 0;
          transform: translate3d(0, 0, 0) translate(-50%, -50%);
          transition: width 0.25s cubic-bezier(0.25, 1, 0.5, 1), 
                      height 0.25s cubic-bezier(0.25, 1, 0.5, 1), 
                      background-color 0.25s ease,
                      border 0.25s ease,
                      opacity 0.2s ease;
          will-change: transform, width, height, opacity;
          border: 0px solid transparent;
          box-sizing: border-box;
        }

        /* Interactive Link Hover: 36px transparent ring with a 1px border */
        .custom-cursor.hover {
          width: 36px;
          height: 36px;
          background-color: transparent;
          border: 1px solid #ffffff;
        }

        /* Image Hover: 70px solid white circle with "VIEW" text */
        .custom-cursor.view-hover {
          width: 70px;
          height: 70px;
          background-color: #ffffff;
          border: none;
        }

        .custom-cursor.view-hover::after {
          content: 'VIEW';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #000000;
          animation: nmaCursorFadeIn 0.25s ease forwards;
        }

        @keyframes nmaCursorFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      }
    `;
    document.head.appendChild(style);

    // Create the cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let hasMoved = false;
    let isHidden = false;

    // Mousemove tracker
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        cursor.style.opacity = '1';
        cursorX = mouseX;
        cursorY = mouseY;
      }
    });

    // Hide when leaving browser window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      isHidden = true;
    });

    document.addEventListener('mouseenter', () => {
      if (hasMoved) {
        cursor.style.opacity = '1';
      }
      isHidden = false;
    });

    // Toggle hover scale and handle input visibility
    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (!target) return;

      // 1. If inside text inputs, textareas, etc., hide the custom cursor to show the native I-beam cursor
      const isInput = target.closest('input, textarea, select, option') || target.isContentEditable;
      if (isInput) {
        cursor.style.opacity = '0';
        return;
      } else if (!isHidden && hasMoved) {
        cursor.style.opacity = '1';
      }

      // 2. Check if hovering over a project/gallery zoomable image
      const isImage = target.closest('img, figure, .main-image-container, .secondary-item, .modal-image') || 
                      (window.getComputedStyle(target).cursor === 'zoom-in');

      // 3. Expand cursor on links, buttons, and custom interactive components
      const isInteractive = target.closest('a, button, .menu-btn, .lightbox-nav, .nav-area, .modal-close, [role="button"]') || 
                            (window.getComputedStyle(target).cursor === 'pointer');
      
      if (isImage) {
        cursor.classList.add('view-hover');
        cursor.classList.remove('hover');
      } else if (isInteractive) {
        cursor.classList.add('hover');
        cursor.classList.remove('view-hover');
      } else {
        cursor.classList.remove('hover');
        cursor.classList.remove('view-hover');
      }
    });

    // Handle mouse out to reset states
    document.addEventListener('mouseout', (e) => {
      const related = e.relatedTarget;
      
      // If we exit the window or aren't hovering over anything, remove hover class
      if (!related) {
        cursor.classList.remove('hover');
        cursor.classList.remove('view-hover');
        return;
      }

      // Restore custom cursor opacity if we left an input
      const wasInput = e.target.closest('input, textarea, select, option') || e.target.isContentEditable;
      if (wasInput && !related.closest('input, textarea, select, option')) {
        if (!isHidden && hasMoved) {
          cursor.style.opacity = '1';
        }
      }
    });

    // Smooth animation loop using lerp (Linear Interpolation)
    function tick() {
      if (hasMoved) {
        const ease = 0.16; // Adjust speed (smaller = smoother/slower, larger = faster/tighter)
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        // Using translate3d triggers GPU acceleration for smoother translation
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(tick);
    }
    
    // Start animation loop
    requestAnimationFrame(tick);
  }
})();

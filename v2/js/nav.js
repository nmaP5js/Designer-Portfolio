/* --- SYSTÈME DE NAVIGATION CENTRALISÉ UNIFIÉ --- */

(function () {
    const PROJECTS_LIST = [
        {
            id: 'immigrantquebec',
            title: 'Immigrant Québec',
            meta: 'Audit de Contenu & Refonte Web · 2026',
            url: 'immigrantquebec.html'
        },
        {
            id: 'thalesaleniaspace',
            title: 'Thales Alenia Space',
            meta: 'UI/UX & Systèmes Critiques · 2025',
            url: 'thalesaleniaspace.html'
        },
        {
            id: 'dynamic_gallery',
            title: 'Dynamic Gallery',
            meta: 'Collage Art Interactif · 2026',
            url: 'dynamic_gallery.html'
        },
        {
            id: 'rex_system',
            title: 'REX_System',
            meta: 'Visionneuse Média Portable · 2026',
            url: 'rex_system.html'
        },
        {
            id: 'portfolio',
            title: 'Designer Portfolio',
            meta: 'Conception Web & Co-conception IA · 2025',
            url: 'portfolio.html'
        },
        {
            id: 'trinityringcartier',
            title: 'Trinity Ring',
            meta: 'Concept Publicitaire 3D · 2024',
            url: 'trinityringcartier.html'
        },
        {
            id: 'enjoytheride',
            title: 'Enjoy The Ride',
            meta: 'Identité, UI/UX & Game Design · 2023',
            url: 'enjoytheride.html'
        },
        {
            id: 'cgivisual',
            title: 'CGI Visual',
            meta: 'Direction Artistique & 3D · 2023',
            url: 'cgivisual.html'
        }
    ];

    function getCurrentFilename() {
        return decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html')
            .split('?')[0]
            .split('#')[0]
            .toLowerCase();
    }

    function renderTopNav() {
        const topNavContainer = document.querySelector('.top-nav');
        if (!topNavContainer) return;

        const currentPath = getCurrentFilename();
        const isLandingPage = currentPath === 'index.html' || currentPath === '';
        const isProjectPage = currentPath === 'project.html' || PROJECTS_LIST.some(p => p.url.toLowerCase() === currentPath);

        const accueilHref = isLandingPage ? '#hero' : 'index.html';
        const projetsHref = isLandingPage ? '#projects' : 'index.html#projects';

        topNavContainer.innerHTML = `
            <div class="top-nav-inner">
                <a href="index.html" class="top-nav-brand">
                    <span class="brand-dot" aria-hidden="true"></span>
                    <span>Nicolas Marie-Angélique</span>
                    <span class="brand-role-badge">Product &amp; UI/UX</span>
                </a>
                <ul class="top-nav-list">
                    <li><a href="${accueilHref}" class="top-nav-link ${isLandingPage ? 'active' : ''}" data-nav="accueil">Accueil</a></li>
                    <li><a href="${projetsHref}" class="top-nav-link ${!isLandingPage && isProjectPage ? 'active' : ''}" data-nav="projets">Projets</a></li>
                    <li><a href="about.html" class="top-nav-link ${currentPath === 'about.html' ? 'active' : ''}" data-nav="about">À Propos</a></li>
                    <li><a href="contact.html" class="top-nav-link ${currentPath === 'contact.html' ? 'active' : ''}" data-nav="contact">Contact</a></li>
                    <li><a href="https://linkedin.com/in/nicolasmarieangelique" target="_blank" rel="noopener noreferrer" class="top-nav-cta">LinkedIn ↗</a></li>
                </ul>
            </div>
        `;

        if (isLandingPage) {
            setupLandingScrollspy(topNavContainer);
        }
    }

    function setupLandingScrollspy(topNavContainer) {
        const accueilLink = topNavContainer.querySelector('[data-nav="accueil"]');
        const projetsLink = topNavContainer.querySelector('[data-nav="projets"]');
        const projectsSection = document.getElementById('projects');

        if (!accueilLink || !projetsLink || !projectsSection) return;

        function updateScrollspy() {
            const scrollY = window.scrollY || window.pageYOffset;
            const projectsTop = projectsSection.getBoundingClientRect().top + scrollY;
            const threshold = projectsTop - window.innerHeight * 0.4;

            if (scrollY >= threshold) {
                projetsLink.classList.add('active');
                projetsLink.setAttribute('aria-current', 'true');
                accueilLink.classList.remove('active');
                accueilLink.removeAttribute('aria-current');
            } else {
                accueilLink.classList.add('active');
                accueilLink.setAttribute('aria-current', 'true');
                projetsLink.classList.remove('active');
                projetsLink.removeAttribute('aria-current');
            }
        }

        window.addEventListener('scroll', updateScrollspy, { passive: true });
        updateScrollspy();

        // Support du hash #projects initial avec défilement fluide
        if (window.location.hash === '#projects') {
            setTimeout(() => {
                if (window.lenis) {
                    window.lenis.scrollTo(projectsSection);
                } else {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }

        // Défilement fluide au clic sur les ancres de la landing page
        [accueilLink, projetsLink].forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        if (window.lenis) {
                            window.lenis.scrollTo(target);
                        } else {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    function renderSubnav() {
        const subnavContainer = document.querySelector('.projects-subnav-container');
        if (!subnavContainer) return;

        const currentPath = getCurrentFilename();

        let html = `<span class="subnav-title">Projets sélectionnés</span><div class="subnav-list">`;

        PROJECTS_LIST.forEach(project => {
            const isActive = currentPath === project.url.toLowerCase();
            const activeClass = isActive ? 'active' : '';
            html += `<a href="${project.url}" class="subnav-item ${activeClass}">${project.title}</a>`;
        });

        html += `</div>`;
        subnavContainer.innerHTML = html;
    }

    /* --- SOMMAIRE INTERACTIF STICKY (TABLE OF CONTENTS) SUR LES ÉTUDES DE CAS --- */
    function renderCaseStudyTOC() {
        const articleBody = document.querySelector('.article-body');
        const rightCol = document.querySelector('.right-col');
        if (!articleBody || !rightCol || document.querySelector('.toc-card')) return;

        const headings = Array.from(articleBody.querySelectorAll('h2.section-heading, h3.subsection-heading'));
        if (headings.length < 2) return;

        // S'assurer que chaque titre possède un id d'ancrage
        const items = headings.map((heading, idx) => {
            const parentSection = heading.closest('section[id]');
            let targetId = '';
            if (heading.tagName === 'H2' && parentSection && parentSection.id) {
                targetId = parentSection.id;
            } else {
                if (!heading.id) {
                    const slug = heading.textContent
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    heading.id = slug || `section-${idx + 1}`;
                }
                targetId = heading.id;
            }

            // Nettoyage d'un intitulé très long pour le sommaire
            let label = heading.textContent.trim();
            if (label.length > 52) {
                const colonIdx = label.indexOf(':');
                if (colonIdx !== -1 && colonIdx < 16) {
                    label = label.slice(0, 50).trim() + '…';
                } else {
                    label = label.slice(0, 48).trim() + '…';
                }
            }

            return {
                id: targetId,
                label: label,
                fullLabel: heading.textContent.trim(),
                level: heading.tagName === 'H3' ? 'sub' : 'main',
                element: heading.tagName === 'H2' && parentSection ? parentSection : heading
            };
        });

        const tocCard = document.createElement('nav');
        tocCard.className = 'toc-card';
        tocCard.setAttribute('aria-label', 'Sommaire de l\'étude de cas');

        let linksHtml = items.map((item, index) => `
            <li class="toc-item toc-item-${item.level}">
                <a href="#${item.id}" class="toc-link ${index === 0 ? 'active' : ''}" data-toc-target="${item.id}" title="${item.fullLabel.replace(/"/g, '&quot;')}">
                    <span class="toc-indicator" aria-hidden="true"></span>
                    <span class="toc-text">${item.label}</span>
                </a>
            </li>
        `).join('');

        tocCard.innerHTML = `
            <div class="toc-header">
                <span class="toc-title">Sommaire</span>
                <span class="toc-progress-label" id="tocProgressLabel">0%</span>
            </div>
            <div class="toc-progress-bar" aria-hidden="true">
                <div class="toc-progress-fill" id="tocProgressFill"></div>
            </div>
            <ul class="toc-list">
                ${linksHtml}
            </ul>
        `;

        rightCol.appendChild(tocCard);

        const tocLinks = Array.from(tocCard.querySelectorAll('.toc-link'));
        const progressFill = tocCard.querySelector('#tocProgressFill');
        const progressLabel = tocCard.querySelector('#tocProgressLabel');

        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-toc-target');
                const targetEl = document.getElementById(targetId);
                if (!targetEl) return;

                if (window.lenis) {
                    window.lenis.scrollTo(targetEl, { offset: -95 });
                } else {
                    const y = targetEl.getBoundingClientRect().top + window.scrollY - 95;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
                history.replaceState(null, null, `#${targetId}`);
            });
        });

        function updateActiveToc() {
            const scrollY = window.scrollY || window.pageYOffset;
            const triggerLine = scrollY + window.innerHeight * 0.26;

            let activeId = items[0].id;
            for (let i = 0; i < items.length; i++) {
                const elTop = items[i].element.getBoundingClientRect().top + scrollY;
                if (elTop <= triggerLine) {
                    activeId = items[i].id;
                }
            }

            tocLinks.forEach(link => {
                const isMatch = link.getAttribute('data-toc-target') === activeId;
                link.classList.toggle('active', isMatch);
            });

            // Progression de lecture de l'article
            const articleRect = articleBody.getBoundingClientRect();
            const articleTop = articleRect.top + scrollY;
            const articleHeight = Math.max(1, articleBody.offsetHeight - window.innerHeight * 0.5);
            const rawPct = Math.round(((scrollY - articleTop + window.innerHeight * 0.25) / articleHeight) * 100);
            const clampedPct = Math.max(0, Math.min(100, rawPct));

            if (progressFill) progressFill.style.width = `${clampedPct}%`;
            if (progressLabel) progressLabel.textContent = `${clampedPct}%`;
        }

        window.addEventListener('scroll', updateActiveToc, { passive: true });
        window.addEventListener('resize', updateActiveToc, { passive: true });
        updateActiveToc();
    }

    /* --- NAVIGATION PROJET PRÉCÉDENT / SUIVANT + FOOTER DE BAS DE PAGE --- */
    function renderProjectPaginationAndFooter() {
        const currentPath = getCurrentFilename();
        const currentIndex = PROJECTS_LIST.findIndex(p => p.url.toLowerCase() === currentPath);
        if (currentIndex === -1) return;

        const mainEl = document.querySelector('main.main-content');
        if (!mainEl || document.querySelector('.project-bottom-section')) return;

        const total = PROJECTS_LIST.length;
        const prevProject = PROJECTS_LIST[(currentIndex - 1 + total) % total];
        const nextProject = PROJECTS_LIST[(currentIndex + 1) % total];

        const bottomSection = document.createElement('footer');
        bottomSection.className = 'project-bottom-section';
        bottomSection.setAttribute('aria-label', 'Navigation entre les projets et pied de page');

        bottomSection.innerHTML = `
            <nav class="project-pagination" aria-label="Projet précédent et suivant">
                <a href="${prevProject.url}" class="project-nav-card prev">
                    <span class="project-nav-direction">
                        <span class="material-symbols-outlined project-nav-arrow" aria-hidden="true">arrow_back</span>
                        <span>Projet précédent</span>
                    </span>
                    <span class="project-nav-title">${prevProject.title}</span>
                    <span class="project-nav-meta">${prevProject.meta}</span>
                </a>

                <a href="${nextProject.url}" class="project-nav-card next">
                    <span class="project-nav-direction">
                        <span>Projet suivant</span>
                        <span class="material-symbols-outlined project-nav-arrow" aria-hidden="true">arrow_forward</span>
                    </span>
                    <span class="project-nav-title">${nextProject.title}</span>
                    <span class="project-nav-meta">${nextProject.meta}</span>
                </a>
            </nav>

            <div class="project-site-footer">
                <div class="project-footer-left">
                    <span class="project-footer-copy">© ${new Date().getFullYear()} Nicolas Marie-Angélique</span>
                    <span class="project-footer-sep" aria-hidden="true">·</span>
                    <span class="project-footer-role">Designer UI/UX</span>
                </div>
                <div class="project-footer-links">
                    <a href="index.html#projects">Tous les projets</a>
                    <a href="about.html">À Propos</a>
                    <a href="contact.html">Contact</a>
                    <a href="https://linkedin.com/in/nicolasmarieangelique" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                    <a href="https://github.com/nmaP5js" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                    <a href="legals.html">Mentions légales</a>
                </div>
            </div>
        `;

        mainEl.appendChild(bottomSection);
    }

    /* --- MINIATURES D'APERÇU PROJET SUR MOBILE / TABLETTE (< 900px) --- */
    function renderMobileProjectThumbnails() {
        const items = document.querySelectorAll('.simple-list .simple-item[data-preview]');
        if (!items.length) return;

        const mql = window.matchMedia('(max-width: 900px)');

        function injectThumbnailsIfNeeded() {
            if (!mql.matches) return;

            items.forEach(item => {
                if (item.classList.contains('has-mobile-thumb')) return;
                const previewSrc = item.getAttribute('data-preview');
                if (!previewSrc) return;

                const textWrapper = document.createElement('div');
                textWrapper.className = 'simple-item-text';
                while (item.firstChild) {
                    textWrapper.appendChild(item.firstChild);
                }

                const isLogo = /logo/i.test(previewSrc);
                const thumb = document.createElement('div');
                thumb.className = `mobile-item-thumb${isLogo ? ' is-logo' : ''}`;
                thumb.setAttribute('aria-hidden', 'true');

                const img = document.createElement('img');
                img.src = previewSrc;
                img.alt = '';
                img.loading = 'lazy';
                img.decoding = 'async';

                thumb.appendChild(img);
                item.appendChild(textWrapper);
                item.appendChild(thumb);
                item.classList.add('has-mobile-thumb');
            });
        }

        injectThumbnailsIfNeeded();
        if (mql.addEventListener) {
            mql.addEventListener('change', injectThumbnailsIfNeeded);
        }
    }

    function init() {
        renderTopNav();
        renderSubnav();
        renderCaseStudyTOC();
        renderProjectPaginationAndFooter();
        renderMobileProjectThumbnails();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

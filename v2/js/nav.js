/* ==========================================================================
   NAVIGATION CENTRALISÉE — V2 GALERIE PRODUIT MINIMALISTE
   ========================================================================== */

(function () {
    'use strict';

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
            id: 'enjoytheride',
            title: 'Enjoy The Ride',
            meta: 'Identité, UI/UX & Game Design · 2023',
            url: 'enjoytheride.html'
        },
        {
            id: 'trinityringcartier',
            title: 'Trinity Ring',
            meta: 'Concept Publicitaire 3D · 2024',
            url: 'trinityringcartier.html'
        },
        {
            id: 'cgivisual',
            title: 'CGI Visual',
            meta: '3D & Motion Design · 2023',
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
        const topNav = document.querySelector('.top-nav');
        if (!topNav) return;

        const currentPath = getCurrentFilename();
        const isLanding = currentPath === 'index.html' || currentPath === '';
        const isProject = currentPath === 'project.html' || PROJECTS_LIST.some(p => p.url.toLowerCase() === currentPath);
        const projetsHref = isLanding ? '#projects' : 'index.html#projects';

        topNav.innerHTML = `
            <div class="top-nav-inner">
                <a href="index.html" class="top-nav-brand" aria-label="Accueil — Nicolas Marie-Angélique">
                    <span class="brand-full">Nicolas Marie-Angélique</span>
                    <span class="brand-short" aria-hidden="true">NMA</span>
                </a>
                <div class="top-nav-right">
                    <ul class="top-nav-list">
                        <li><a href="${projetsHref}" class="top-nav-link ${isLanding || isProject ? 'active' : ''}" data-nav="projets">Projets</a></li>
                        <li><a href="about.html" class="top-nav-link ${currentPath === 'about.html' ? 'active' : ''}" data-nav="about">À Propos</a></li>
                        <li><a href="contact.html" class="top-nav-link ${currentPath === 'contact.html' ? 'active' : ''}" data-nav="contact">Contact</a></li>
                    </ul>
                    <a href="../index.html" class="top-nav-cta" title="Voir la version V1">V1 ↗</a>
                </div>
            </div>
        `;

        function syncNavBorder() {
            topNav.classList.toggle('is-scrolled', window.scrollY > 12);
        }
        window.addEventListener('scroll', syncNavBorder, { passive: true });
        syncNavBorder();

        if (isLanding) {
            setupLandingAnchors(topNav);
        }
    }

    function setupLandingAnchors(topNav) {
        const projetsLink = topNav.querySelector('[data-nav="projets"]');
        const projectsSection = document.getElementById('projects');

        if (window.location.hash === '#projects' && projectsSection) {
            setTimeout(() => {
                if (window.lenis) {
                    window.lenis.scrollTo(projectsSection, { offset: -64 });
                } else {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 80);
        }

        if (projetsLink && projectsSection) {
            projetsLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.lenis) {
                    window.lenis.scrollTo(projectsSection, { offset: -64 });
                } else {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
                history.pushState(null, '', '#projects');
            });
        }
    }

    function renderSubnav() {
        const subnav = document.querySelector('.projects-subnav-container');
        if (!subnav) return;

        const currentPath = getCurrentFilename();
        const links = PROJECTS_LIST.map(project => {
            const isActive = currentPath === project.url.toLowerCase();
            return `<a href="${project.url}" class="subnav-item ${isActive ? 'active' : ''}">${project.title}</a>`;
        }).join('');

        subnav.innerHTML = `<span class="subnav-title">Projets</span><div class="subnav-list">${links}</div>`;
    }

    function renderCaseStudyTOC() {
        const articleBody = document.querySelector('.article-body');
        const rightCol = document.querySelector('.right-col');
        if (!articleBody || !rightCol || document.querySelector('.toc-card')) return;

        const headings = Array.from(articleBody.querySelectorAll('h2.section-heading, h3.subsection-heading'));
        if (headings.length < 2) return;

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

            let label = heading.textContent.trim();
            if (label.length > 48) {
                label = label.slice(0, 46).trim() + '…';
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

        const linksHtml = items.map((item, index) => `
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
            <ul class="toc-list">${linksHtml}</ul>
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
                    window.lenis.scrollTo(targetEl, { offset: -84 });
                } else {
                    const y = targetEl.getBoundingClientRect().top + window.scrollY - 84;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
                history.replaceState(null, '', `#${targetId}`);
            });
        });

        function updateActiveToc() {
            const scrollY = window.scrollY || window.pageYOffset;
            const triggerLine = scrollY + window.innerHeight * 0.25;

            let activeId = items[0].id;
            for (let i = 0; i < items.length; i++) {
                const elTop = items[i].element.getBoundingClientRect().top + scrollY;
                if (elTop <= triggerLine) {
                    activeId = items[i].id;
                }
            }

            tocLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-toc-target') === activeId);
            });

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
                    <span class="project-footer-copy">© 2026 Nicolas Marie-Angélique</span>
                    <span aria-hidden="true">·</span>
                    <span>Designer UI/UX &amp; Services</span>
                </div>
                <div class="project-footer-links">
                    <a href="index.html#projects">Projets</a>
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

    function init() {
        renderTopNav();
        renderSubnav();
        renderCaseStudyTOC();
        renderProjectPaginationAndFooter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

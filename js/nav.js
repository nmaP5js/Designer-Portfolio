/* --- SYSTÈME DE NAVIGATION CENTRALISÉ UNIFIÉ --- */

(function () {
    const PROJECTS_LIST = [
        { id: 'dynamic_gallery', title: 'Dynamic Gallery', url: 'dynamic_gallery.html' },
        { id: 'rex_system', title: 'REX_System', url: 'rex_system.html' },
        { id: 'portfolio', title: 'Designer Portfolio', url: 'portfolio.html' },
        { id: 'trinityringcartier', title: 'Trinity Ring', url: 'trinityringcartier.html' },
        { id: 'enjoytheride', title: 'Enjoy The Ride', url: 'enjoytheride.html' },
        { id: 'cgivisual', title: 'CGI Visual', url: 'cgivisual.html' }
    ];

    function renderTopNav() {
        const topNavContainer = document.querySelector('.top-nav');
        if (!topNavContainer) return;

        let currentPath = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0].toLowerCase();
        const isLandingPage = currentPath === 'index.html' || currentPath === '';
        const isProjectPage = currentPath === 'project.html' || PROJECTS_LIST.some(p => p.url.toLowerCase() === currentPath);

        const accueilHref = isLandingPage ? '#hero' : 'index.html';
        const projetsHref = isLandingPage ? '#projects' : 'index.html#projects';

        topNavContainer.innerHTML = `
            <ul class="top-nav-list">
                <li><a href="${accueilHref}" class="top-nav-link ${isLandingPage ? 'active' : ''}" data-nav="accueil">Accueil</a></li>
                <li><a href="${projetsHref}" class="top-nav-link ${!isLandingPage && isProjectPage ? 'active' : ''}" data-nav="projets">Projets</a></li>
                <li><a href="about.html" class="top-nav-link ${currentPath === 'about.html' ? 'active' : ''}" data-nav="about">À Propos</a></li>
                <li><a href="contact.html" class="top-nav-link ${currentPath === 'contact.html' ? 'active' : ''}" data-nav="contact">Contact</a></li>
            </ul>
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
                projectsSection.scrollIntoView({ behavior: 'smooth' });
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
                        target.scrollIntoView({ behavior: 'smooth' });
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    function renderSubnav() {
        const subnavContainer = document.querySelector('.projects-subnav-container');
        if (!subnavContainer) return;

        let currentPath = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0].toLowerCase();

        let html = `<span class="subnav-title">Projets sélectionnés</span><div class="subnav-list">`;

        PROJECTS_LIST.forEach(project => {
            const isActive = currentPath === project.url.toLowerCase();
            const activeClass = isActive ? 'active' : '';
            html += `<a href="${project.url}" class="subnav-item ${activeClass}">${project.title}</a>`;
        });

        html += `</div>`;
        subnavContainer.innerHTML = html;
    }

    function init() {
        renderTopNav();
        renderSubnav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

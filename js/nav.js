/* --- SYSTÈME DE NAVIGATION CENTRALISÉ UNIFIÉ --- */

(function () {
    const PROJECTS_LIST = [
        { id: 'dynamic_gallery', title: 'Dynamic Gallery', url: 'dynamic_gallery.html' },
        { id: 'rex_system', title: 'REX_System', url: 'rex_system.html' },
        { id: 'portfolio', title: 'Designer Portfolio', url: 'portfolio.html' },
        { id: 'imageia', title: 'Image Gen IA', url: 'imageia.html' },
        { id: 'data_viz', title: 'DATA_VIZ', url: 'data_viz.html' },
        { id: 'trinityringcartier', title: 'Trinity Ring', url: 'trinityringcartier.html' },
        { id: 'ptitchef', title: 'Made In Work', url: 'ptitchef.html' },
        { id: 'budl', title: 'BUDL', url: 'budl.html' },
        { id: 'enjoytheride', title: 'Enjoy The Ride', url: 'enjoytheride.html' },
        { id: 'cltwinter', title: 'CLT Winter Calendar', url: 'cltwinter.html' },
        { id: 'cgivisual', title: 'CGI Visual', url: 'cgivisual.html' }
    ];

    function renderTopNav() {
        const topNavContainer = document.querySelector('.top-nav');
        if (!topNavContainer) return;

        let currentPath = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0].toLowerCase();
        const isProjectPage = currentPath === 'project.html' || PROJECTS_LIST.some(p => p.url.toLowerCase() === currentPath);

        topNavContainer.innerHTML = `
            <ul class="top-nav-list">
                <li><a href="index.html" class="top-nav-link ${currentPath === 'index.html' ? 'active' : ''}">Accueil</a></li>
                <li><a href="project.html" class="top-nav-link ${isProjectPage ? 'active' : ''}">Projets</a></li>
                <li><a href="about.html" class="top-nav-link ${currentPath === 'about.html' ? 'active' : ''}">À Propos</a></li>
                <li><a href="contact.html" class="top-nav-link ${currentPath === 'contact.html' ? 'active' : ''}">Contact</a></li>
            </ul>
        `;
    }

    function renderSubnav() {
        const subnavContainer = document.querySelector('.projects-subnav-container');
        if (!subnavContainer) return;

        let currentPath = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0].toLowerCase();

        let html = `<span class="subnav-title">Tous les projets</span><div class="subnav-list">`;

        PROJECTS_LIST.forEach(project => {
            const isActive = currentPath === project.url.toLowerCase();
            const activeClass = isActive ? 'active' : '';
            html += `<a href="${project.url}" class="subnav-item ${activeClass}">${project.title}</a>`;
        });

        html += `</div>`;
        subnavContainer.innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderTopNav();
        renderSubnav();
    });
})();

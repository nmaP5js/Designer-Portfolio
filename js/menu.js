document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navCapsule = document.getElementById('navCapsule');
    const menuIcon = document.getElementById('menuIcon');
    const projectBtn = document.getElementById('projectBtn');
    const projectSubmenu = document.getElementById('projectSubmenu');
    
    if (!menuBtn || !navCapsule) return;

    let isMenuOpen = false;

    // 1. Ouvrir / Fermer le menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuBtn.setAttribute('aria-expanded', isMenuOpen);
        navCapsule.setAttribute('aria-hidden', !isMenuOpen);
        
        if (isMenuOpen) {
            navCapsule.classList.add('active');
            if (menuIcon) menuIcon.textContent = 'close';
            menuBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; 
        } else {
            navCapsule.classList.remove('active');
            if (menuIcon) menuIcon.textContent = 'menu';
            menuBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            closeProjects(); 
        }
    }

    // 2. Accordéon Projets
    function toggleProjects(e) {
        if (e) e.preventDefault(); 
        if (!projectBtn || !projectSubmenu) return;
        const isExpanded = projectBtn.getAttribute('aria-expanded') === 'true';
        
        if (!isExpanded) {
            projectSubmenu.classList.add('open');
            projectBtn.setAttribute('aria-expanded', 'true');
            projectBtn.style.color = 'var(--blue-color)';
        } else {
            closeProjects();
        }
    }

    function closeProjects() {
        if (!projectBtn || !projectSubmenu) return;
        projectSubmenu.classList.remove('open');
        projectBtn.setAttribute('aria-expanded', 'false');
        projectBtn.style.color = ''; 
    }

    // Listeners Menu
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        toggleMenu();
    });

    if (projectBtn) {
        projectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleProjects(e);
        });
    }

    document.addEventListener('click', (e) => {
        // Ferme le menu si clic dehors
        if (isMenuOpen && !navCapsule.contains(e.target) && !menuBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });
});

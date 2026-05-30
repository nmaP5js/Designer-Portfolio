document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const zoomableImages = document.querySelectorAll('.main-image, .secondary-image');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!lightbox || !lightboxImg || zoomableImages.length === 0) return;

    // Création d'un tableau à partir de la NodeList
    const imagesArray = Array.from(zoomableImages);
    let currentIndex = 0;

    // Ouvrir la lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; 
    }

    // Mise à jour de l'image
    function updateLightboxImage() {
        const img = imagesArray[currentIndex];
        
        lightboxImg.classList.add('fade-out');
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.classList.remove('fade-out');
        }, 150);
    }

    // Événements sur les images
    zoomableImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(index);
        });
    });

    // Bouton Suivant
    function showNext(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % imagesArray.length;
        updateLightboxImage();
    }

    // Bouton Précédent
    function showPrev(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
        updateLightboxImage();
    }

    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    // Fermeture
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; 
    }

    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation Clavier
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });
});

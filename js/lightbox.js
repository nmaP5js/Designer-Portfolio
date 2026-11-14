/* --- GALERIE LIGHTBOX MODAL UNIFIÉE --- */

(function () {
    let currentIndex = 0;
    let isZoomed = false;
    let isPanning = false;
    let hasDragged = false;
    let panStartX = 0, panStartY = 0;
    let currentPanX = 0, currentPanY = 0;
    let galleryImages = [];

    window.initLightbox = function (images) {
        galleryImages = images || [];
        const modal = document.getElementById('imageModal');
        if (!modal || !galleryImages.length) return;

        const modalImg = document.getElementById('modalImage');
        const counter = document.getElementById('imageCounter');
        const zoomIcon = document.getElementById('zoomIcon');
        const zoomBtn = document.getElementById('zoomToggleBtn');
        const closeBtn = document.getElementById('modalClose');

        // Génération dynamique de la grille Bento si #galleryContainer est présent
        const galleryContainer = document.getElementById('galleryContainer');
        if (galleryContainer && galleryContainer.children.length === 0) {
            const fragment = document.createDocumentFragment();
            galleryImages.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'bento-item';
                item.dataset.index = index;
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-label', `Voir ${image.alt || 'image'}`);
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.alt || '';
                img.className = 'bento-image';
                img.loading = 'lazy';
                item.appendChild(img);
                fragment.appendChild(item);
            });
            galleryContainer.appendChild(fragment);

            galleryContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const item = e.target.closest('.bento-item');
                    if (item) {
                        e.preventDefault();
                        openModal(parseInt(item.dataset.index, 10) || 0);
                    }
                }
            });
        }

        function generateThumbnails() {
            const thumbsContainer = document.getElementById('lightboxThumbnails');
            if (!thumbsContainer) return;
            thumbsContainer.innerHTML = '';
            galleryImages.forEach((image, index) => {
                const thumb = document.createElement('div');
                thumb.className = `thumb-item ${index === currentIndex ? 'active' : ''}`;
                thumb.dataset.index = index;
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.alt || '';
                thumb.appendChild(img);
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToImage(index);
                });
                thumbsContainer.appendChild(thumb);
            });
        }

        function updateCounter() {
            if (!counter) return;
            const curr = String(currentIndex + 1).padStart(2, '0');
            const total = String(galleryImages.length).padStart(2, '0');
            counter.innerHTML = `<span class="counter-curr">${curr}</span><span class="counter-slash">/</span><span class="counter-total">${total}</span>`;
            const thumbs = document.querySelectorAll('.thumb-item');
            thumbs.forEach((t, i) => {
                t.classList.toggle('active', i === currentIndex);
            });
        }

        function applyTransform() {
            if (!modalImg) return;
            if (isZoomed) {
                modalImg.style.transform = `scale(1.8) translate(${currentPanX / 1.8}px, ${currentPanY / 1.8}px)`;
            } else {
                modalImg.style.transform = '';
            }
        }

        function resetPan() {
            currentPanX = 0;
            currentPanY = 0;
        }

        function toggleZoom() {
            if (!modalImg) return;
            isZoomed = !isZoomed;
            resetPan();
            modalImg.classList.toggle('zoomed', isZoomed);
            applyTransform();
            if (zoomIcon) zoomIcon.textContent = isZoomed ? 'zoom_out' : 'zoom_in';
        }

        function resetZoom() {
            isZoomed = false;
            resetPan();
            if (modalImg) {
                modalImg.classList.remove('zoomed');
                modalImg.style.transform = '';
            }
            if (zoomIcon) zoomIcon.textContent = 'zoom_in';
        }

        function openModal(index) {
            currentIndex = (index >= 0 && index < galleryImages.length) ? index : 0;
            resetZoom();
            const image = galleryImages[currentIndex];
            if (!modalImg) return;
            modalImg.style.opacity = '0';
            modalImg.src = image.src;
            modalImg.alt = image.alt || '';
            modalImg.onload = () => { modalImg.style.opacity = '1'; };
            generateThumbnails();
            updateCounter();
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            resetZoom();
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (modalImg) modalImg.src = '';
        }

        function goToImage(index) {
            resetZoom();
            currentIndex = index;
            if (!modalImg) return;
            modalImg.style.opacity = '0';
            setTimeout(() => {
                modalImg.src = galleryImages[currentIndex].src;
                modalImg.alt = galleryImages[currentIndex].alt || '';
                modalImg.style.opacity = '1';
            }, 120);
            updateCounter();
        }

        function navigate(direction) {
            const nextIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
            goToImage(nextIndex);
        }

        // Sélectionner les images cliquables sans doublon parent/enfant (.zoomable > img)
        const clickableImages = document.querySelectorAll('.main-image, .bento-image, .secondary-image');
        clickableImages.forEach((img, domIndex) => {
            const wrapper = img.closest('.zoomable, .bento-item, .visual-main-item, .visual-grid-item');
            const clickTarget = wrapper || img;
            clickTarget.style.cursor = 'pointer';

            clickTarget.addEventListener('click', (e) => {
                e.stopPropagation();
                const explicitIndex = img.dataset.index ?? (wrapper && wrapper.dataset.index);
                const resolvedIndex = explicitIndex !== undefined ? parseInt(explicitIndex, 10) : domIndex;
                openModal(resolvedIndex);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (zoomBtn) {
            zoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleZoom();
            });
        }

        if (modalImg) {
            modalImg.addEventListener('mousedown', (e) => {
                if (!isZoomed) return;
                isPanning = true;
                hasDragged = false;
                panStartX = e.clientX - currentPanX;
                panStartY = e.clientY - currentPanY;
                modalImg.classList.add('panning');
                e.preventDefault();
            });

            window.addEventListener('mousemove', (e) => {
                if (!isPanning || !isZoomed) return;
                const newX = e.clientX - panStartX;
                const newY = e.clientY - panStartY;
                if (Math.abs(newX - currentPanX) > 2 || Math.abs(newY - currentPanY) > 2) hasDragged = true;
                currentPanX = newX;
                currentPanY = newY;
                applyTransform();
            });

            window.addEventListener('mouseup', () => {
                if (isPanning) {
                    isPanning = false;
                    if (modalImg) modalImg.classList.remove('panning');
                }
            });

            modalImg.addEventListener('click', (e) => {
                e.stopPropagation();
                if (hasDragged) { hasDragged = false; return; }
                toggleZoom();
            });
        }

        // Navigation à la molette / trackpad
        let isWheeling = false;
        modal.addEventListener('wheel', (e) => {
            if (!modal.classList.contains('active') || isZoomed || galleryImages.length <= 1) return;
            e.preventDefault();
            if (isWheeling) return;

            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) > 20) {
                isWheeling = true;
                navigate(delta > 0 ? 1 : -1);
                setTimeout(() => { isWheeling = false; }, 350);
            }
        }, { passive: false });

        // Navigation tactile (Swipe mobile / Pan quand zoomé)
        let touchStartX = 0;
        let isTouchPanning = false;
        let touchPanStartX = 0, touchPanStartY = 0;

        modal.addEventListener('touchstart', (e) => {
            if (isZoomed) {
                isTouchPanning = true;
                touchPanStartX = e.changedTouches[0].clientX - currentPanX;
                touchPanStartY = e.changedTouches[0].clientY - currentPanY;
            } else {
                isTouchPanning = false;
                touchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        modal.addEventListener('touchmove', (e) => {
            if (!isZoomed || !isTouchPanning) return;
            currentPanX = e.changedTouches[0].clientX - touchPanStartX;
            currentPanY = e.changedTouches[0].clientY - touchPanStartY;
            applyTransform();
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            if (isZoomed) {
                isTouchPanning = false;
            } else if (galleryImages.length > 1) {
                const diff = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(diff) > 40) {
                    navigate(diff < 0 ? 1 : -1);
                }
            }
        }, { passive: true });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-content') || e.target.classList.contains('modal-image-wrapper')) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active')) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') navigate(-1);
                if (e.key === 'ArrowRight') navigate(1);
            }
        });
    };
})();


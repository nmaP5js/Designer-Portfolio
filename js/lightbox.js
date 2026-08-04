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
            currentIndex = index;
            resetZoom();
            const image = galleryImages[index];
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

        // Event listeners
        const galleryItems = document.querySelectorAll('.main-image, .bento-image, .secondary-image, .zoomable');
        galleryItems.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(index < galleryImages.length ? index : 0);
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

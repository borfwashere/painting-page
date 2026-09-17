// lightbox.js - Lightbox compartido para Work y Exhibition
(function () {
    var overlay = null;
    var content = null;
    var imgEl = null;
    var captionEl = null;
    var prevBtn = null;
    var nextBtn = null;
    var closeBtn = null;

    var currentImages = [];
    var currentIndex = 0;
    var currentCaption = '';
    var isOpen = false;

    var touchStartX = 0;
    var touchStartY = 0;

    function createDOM() {
        if (overlay) return;

        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';

        content = document.createElement('div');
        content.className = 'lightbox-content';

        imgEl = document.createElement('img');
        imgEl.className = 'lightbox-image';
        imgEl.draggable = false;

        captionEl = document.createElement('div');
        captionEl.className = 'lightbox-caption';

        content.appendChild(imgEl);
        content.appendChild(captionEl);

        closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Cerrar');

        prevBtn = document.createElement('button');
        prevBtn.className = 'lightbox-arrow lightbox-prev';
        prevBtn.innerHTML = '&#8249;';
        prevBtn.setAttribute('aria-label', 'Imagen anterior');

        nextBtn = document.createElement('button');
        nextBtn.className = 'lightbox-arrow lightbox-next';
        nextBtn.innerHTML = '&#8250;';
        nextBtn.setAttribute('aria-label', 'Imagen siguiente');

        overlay.appendChild(content);
        overlay.appendChild(closeBtn);
        overlay.appendChild(prevBtn);
        overlay.appendChild(nextBtn);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeLightbox();
        });

        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeLightbox();
        });

        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            goToImage(currentIndex - 1);
        });

        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            goToImage(currentIndex + 1);
        });

        overlay.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        overlay.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].screenX - touchStartX;
            var dy = e.changedTouches[0].screenY - touchStartY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    goToImage(currentIndex - 1);
                } else {
                    goToImage(currentIndex + 1);
                }
            }
        }, { passive: true });
    }

    function openLightbox(images, startIndex, caption) {
        createDOM();
        currentImages = images;
        currentIndex = startIndex;
        currentCaption = caption || '';
        isOpen = true;
        updateImage();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!isOpen) return;
        isOpen = false;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function goToImage(index) {
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;
        currentIndex = index;
        updateImage();
    }

    function updateImage() {
        imgEl.src = currentImages[currentIndex];
        captionEl.textContent = currentCaption;

        if (currentImages.length <= 1) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
        }
    }

    function getCaptionFromItem(item) {
        var pub = item.closest('.publication');
        if (pub) {
            var title = pub.querySelector('.entry-title');
            if (title) return title.textContent.trim();
        }

        var exhibition = item.closest('.exhibition');
        if (exhibition) {
            var title = exhibition.querySelector('.exhibition-title');
            if (title) return title.textContent.trim();
        }

        return '';
    }

    function collectImagesFromGrid(grid) {
        var items = grid.querySelectorAll('.masonry-item, .exhibition-item');
        var images = [];
        items.forEach(function (item) {
            var img = item.querySelector('img');
            if (img && img.src) {
                images.push(img.src);
            }
        });
        return images;
    }

    function initLightbox() {
        var selector = '.masonry-item img, .exhibition-item img';
        var images = document.querySelectorAll(selector);

        images.forEach(function (img) {
            if (img.hasAttribute('data-lightbox-bound')) return;
            img.setAttribute('data-lightbox-bound', 'true');
            img.style.cursor = 'pointer';

            img.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var item = this.closest('.masonry-item, .exhibition-item');
                var grid = item ? item.parentElement : null;
                if (!grid) return;

                var allImages = collectImagesFromGrid(grid);
                var imgIndex = allImages.indexOf(this.src);
                var caption = getCaptionFromItem(item);

                openLightbox(allImages, imgIndex >= 0 ? imgIndex : 0, caption);
            });
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!isOpen) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goToImage(currentIndex - 1);
        if (e.key === 'ArrowRight') goToImage(currentIndex + 1);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }

    window.initLightbox = initLightbox;
})();

document.addEventListener('DOMContentLoaded', function () {

    // ===== URL Params =====
    var urlParams = new URLSearchParams(window.location.search);
    var exhibitionId = urlParams.get('id');

    // ===== localStorage: Read Orders =====
    function getExhibitionOrders() {
        try {
            return JSON.parse(localStorage.getItem('exhibition-orders') || '{}');
        } catch (e) {
            return {};
        }
    }

    function applyExhibitionOrders(exhibition) {
        var orders = getExhibitionOrders();
        if (orders[exhibition.id]) {
            var saved = orders[exhibition.id];
            var reordered = [];
            saved.forEach(function(imgSrc) {
                var found = exhibition.images.indexOf(imgSrc);
                if (found !== -1) {
                    reordered.push(imgSrc);
                }
            });
            exhibition.images.forEach(function(imgSrc) {
                if (reordered.indexOf(imgSrc) === -1) {
                    reordered.push(imgSrc);
                }
            });
            exhibition.images = reordered;
        }
    }

    // ===== localStorage: Read Positions =====
    function getExhibitionPositions() {
        try {
            return JSON.parse(localStorage.getItem('exhibition-positions') || '{}');
        } catch (e) {
            return {};
        }
    }

    function applySavedPositions(id, grid) {
        var all = getExhibitionPositions();
        if (!all[id]) return;
        var positions = all[id];
        var items = grid.querySelectorAll('.exhibition-item');
        items.forEach(function(item) {
            var idx = item.getAttribute('data-index');
            if (positions[idx]) {
                var img = item.querySelector('img');
                if (img) img.style.objectPosition = positions[idx];
            }
        });
    }

    // ===== Build Exhibition List (sin param) =====
    function buildExhibitionList(data) {
        var container = document.getElementById('exhibitions-container');
        if (!container) return;

        var sorted = data.slice().sort(function(a, b) {
            return b.year - a.year;
        });

        sorted.forEach(function(exhibition) {
            var firstImage = exhibition.images.length > 0 ? exhibition.images[0] : '';
            var html = '<article class="exhibition-list-item">';
            html += '<a href="exhibition.html?id=' + exhibition.id + '" class="exhibition-list-link">';
            if (firstImage) {
                html += '<div class="exhibition-list-image">';
                html += '<img src="' + firstImage + '" alt="' + exhibition.title + '" loading="lazy">';
                html += '</div>';
            }
            html += '<div class="exhibition-list-info">';
            html += '<h2 class="exhibition-list-title">' + exhibition.title + '</h2>';
            html += '<span class="exhibition-list-meta">' + exhibition.gallery + ', ' + exhibition.year + '</span>';
            html += '</div>';
            html += '</a>';
            html += '</article>';

            container.insertAdjacentHTML('beforeend', html);
        });
    }

    // ===== Build Single Exhibition (con param ?id=) =====
    function buildSingleExhibition(data, id) {
        var exhibition = data.find(function(e) { return e.id === id; });
        if (!exhibition) {
            document.getElementById('exhibitions-container').innerHTML = '<p>Exhibition not found.</p>';
            return;
        }

        applyExhibitionOrders(exhibition);

        var container = document.getElementById('exhibitions-container');
        var html = '<article class="exhibition" data-exhibition-id="' + exhibition.id + '">';
        html += '<div class="exhibition-header">';
        html += '<h2 class="exhibition-title">' + exhibition.title + '</h2>';
        html += '<div class="exhibition-header-right">';
        html += '<span class="exhibition-meta">' + exhibition.gallery + ', ' + exhibition.year + '</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="exhibition-grid" data-exhibition-id="' + exhibition.id + '">';

        exhibition.images.forEach(function(imgSrc, imgIndex) {
            html += '<div class="exhibition-item" data-index="' + imgIndex + '">';
            html += '<img src="' + imgSrc + '" alt="' + exhibition.title + '" loading="lazy">';
            html += '</div>';
        });

        html += '</div>';
        html += '</article>';

        container.insertAdjacentHTML('beforeend', html);

        var grid = container.querySelector('.exhibition-grid');
        applySavedPositions(exhibition.id, grid);
    }

    // ===== Navigator Fade-in =====
    var navigator = document.getElementById('navigator');
    if (navigator) {
        setTimeout(function () {
            navigator.classList.add('loaded');
        }, 100);
    }

    // ===== Init =====
    if (typeof exhibitionsData !== 'undefined') {
        var sorted = exhibitionsData.slice().sort(function(a, b) {
            if (b.year !== a.year) {
                return b.year - a.year;
            }
            var galleryA = (a.gallery || a.title).toLowerCase();
            var galleryB = (b.gallery || b.title).toLowerCase();
            return galleryA.localeCompare(galleryB);
        });

        if (exhibitionId) {
            document.title = 'Exhibition';
            buildSingleExhibition(exhibitionsData, exhibitionId);
        } else {
            document.title = 'Exhibition';
            if (window.innerWidth > 639) {
                buildSingleExhibition(exhibitionsData, sorted[0].id);
            } else {
                buildExhibitionList(exhibitionsData);
            }
        }
    }

});

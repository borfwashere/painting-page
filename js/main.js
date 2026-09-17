document.addEventListener('DOMContentLoaded', function () {

    // ===== Helper: Generate Slug =====
    function generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // ===== Build Year Page (single year) =====
    function buildYearPage(data, year) {
        var container = document.getElementById('publications-container');
        if (!container) return;

        var pubs = data[year];
        if (!pubs || pubs.length === 0) return;

        var pubsHTML = '';
        pubs.forEach(function(pub) {
            var imagesHTML = '';
            if (pub.images) {
                pub.images.forEach(function(imgSrc, imgIndex) {
                    imagesHTML += '<div class="masonry-item" data-index="' + imgIndex + '">';
                    imagesHTML += '<img src="' + imgSrc + '" alt="' + pub.title + '" loading="lazy" onerror="this.style.display=\'none\'; console.warn(\'Imagen no encontrada:\', \'' + imgSrc.replace(/'/g, "\\'") + '\')">';
                    imagesHTML += '</div>';
                });
            }

            var slug = generateSlug(pub.title);
            var pubId = year + '/' + slug;

            pubsHTML += '<article class="hentry publication" data-pub-id="' + pubId + '">';
            pubsHTML += '<section class="main">';
            pubsHTML += '<header>';
            pubsHTML += '<h1 class="entry-title">' + pub.title + '</h1>';
            pubsHTML += '</header>';
            pubsHTML += '<div class="publication-description"></div>';
            pubsHTML += '<div class="masonry-grid" data-pub-id="' + pubId + '">' + imagesHTML + '</div>';
            pubsHTML += '</section>';
            pubsHTML += '</article>';

            if (pub !== pubs[pubs.length - 1]) {
                pubsHTML += '<div class="publication-separator"></div>';
            }
        });

        container.innerHTML = pubsHTML;
    }

    // ===== Build Publications from JSON (all-years mode) =====
    function buildPublications(data) {
        var container = document.getElementById('publications-container');
        if (!container) return;

        var years = Object.keys(data).sort().reverse();
        var yearItemsHTML = '';

        years.forEach(function(year) {
            var pubs = data[year];
            var pubsHTML = '';

            pubs.forEach(function(pub) {
                var imagesHTML = '';
                if (pub.images) {
                    pub.images.forEach(function(imgSrc, imgIndex) {
                        imagesHTML += '<div class="masonry-item" data-index="' + imgIndex + '">';
                        imagesHTML += '<img src="' + imgSrc + '" alt="' + pub.title + '" loading="lazy" onerror="this.style.display=\'none\'; console.warn(\'Imagen no encontrada:\', \'' + imgSrc.replace(/'/g, "\\'") + '\')">';
                        imagesHTML += '</div>';
                    });
                }

                var slug = generateSlug(pub.title);
                var pubId = year + '/' + slug;

                pubsHTML += '<article class="hentry publication" data-pub-id="' + pubId + '">';
                pubsHTML += '<section class="main">';
                pubsHTML += '<header>';
                pubsHTML += '<h1 class="entry-title">' + pub.title + '</h1>';
                pubsHTML += '</header>';
                pubsHTML += '<div class="publication-description"></div>';
                pubsHTML += '<div class="masonry-grid" data-pub-id="' + pubId + '">' + imagesHTML + '</div>';
                pubsHTML += '</section>';
                pubsHTML += '</article>';

                if (pub !== pubs[pubs.length - 1]) {
                    pubsHTML += '<div class="publication-separator"></div>';
                }
            });

            var sectionHTML = '<section id="section-' + year + '" class="content-section">' +
                pubsHTML + '</section>';
            container.insertAdjacentHTML('beforeend', sectionHTML);

            yearItemsHTML += '<li class="blog-collection"><a href="#" data-section="' + year + '">' + year + '</a></li>';
        });

        var workFolders = document.querySelectorAll('#main-work-list, #mobile-work-list');
        workFolders.forEach(function(list) {
            if (list) {
                list.innerHTML = yearItemsHTML;
            }
        });

        var newSectionLinks = document.querySelectorAll('[data-section]');
        newSectionLinks.forEach(function (link) {
            if (!link.hasAttribute('data-bound')) {
                link.setAttribute('data-bound', 'true');
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    var sectionId = this.getAttribute('data-section');

                    newSectionLinks.forEach(function (l) {
                        l.classList.remove('active');
                    });
                    document.querySelectorAll('[data-section="' + sectionId + '"]').forEach(function (l) {
                        l.classList.add('active');
                    });

                    var sections = document.querySelectorAll('.content-section');
                    sections.forEach(function (section) {
                        section.classList.remove('active');
                    });
                    var targetSection = document.getElementById('section-' + sectionId);
                    if (targetSection) {
                        targetSection.classList.add('active');
                    }

                    updateCurrentYear(sectionId);
                });
            }
        });

        if (years.length > 0) {
            var firstYear = years[0];
            var firstSection = document.getElementById('section-' + firstYear);
            if (firstSection) {
                firstSection.classList.add('active');
            }
            document.querySelectorAll('[data-section="' + firstYear + '"]').forEach(function (l) {
                l.classList.add('active');
            });
            updateCurrentYear(firstYear);
        }
    }

    function updateCurrentYear(year) {
        var desktopSpan = document.getElementById('current-year');
        var mobileSpan = document.getElementById('current-year-mobile');
        if (desktopSpan) desktopSpan.textContent = year;
        if (mobileSpan) mobileSpan.textContent = year;
    }

    // ===== Navigator Fade-in =====
    var navigator = document.getElementById('navigator');
    if (navigator) {
        setTimeout(function () {
            navigator.classList.add('loaded');
        }, 100);
    }

    // ===== Footer Autohide =====
    var footer = document.getElementById('bottomBar');

    if (footer) {
        function checkFooter() {
            var scrollPos = window.scrollY + window.innerHeight;
            var pageHeight = document.documentElement.scrollHeight;
            if (scrollPos >= pageHeight - 50) {
                footer.classList.add('viewable');
            } else {
                footer.classList.remove('viewable');
            }
        }

        window.addEventListener('scroll', checkFooter);
        window.addEventListener('resize', checkFooter);
        checkFooter();
    }

    // ===== Expose initPublications globally for year-data.js =====
    window.initPublications = function() {
        var data = typeof publicationsData !== 'undefined' ? publicationsData : null;
        if (!data) return;

        var urlParams = new URLSearchParams(window.location.search);
        var isYearPage = urlParams.has('y');
        var currentYear = urlParams.get('y');

        if (isYearPage && currentYear && data[currentYear]) {
            buildYearPage(data, currentYear);
        } else {
            buildPublications(data);
        }

        if (typeof window.initLightbox === 'function') {
            window.initLightbox();
        }
    };

    if (typeof publicationsData !== 'undefined') {
        window.initPublications();
    }

});

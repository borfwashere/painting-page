// nav.js - Shared navigation logic

function populateExhibitionDropdown() {
    if (typeof exhibitionsData === 'undefined') return;

    var desktopList = document.getElementById('main-exhibition-list');
    var mobileList = document.getElementById('mobile-exhibition-list');

    var sorted = exhibitionsData.slice().sort(function(a, b) {
        return b.year - a.year;
    });

    sorted.forEach(function(exhibition) {
        var text = exhibition.gallery + ', ' + exhibition.year;

        var displayText = text.replace(/Museo\s+(De|de)\s+Arte\s+Contempor[aá]neo\s+de\s+Caracas/gi, 'MACCAR');

        if (desktopList) {
            var li = document.createElement('li');
            li.className = 'blog-collection';
            var a = document.createElement('a');
            a.href = 'exhibition.html?id=' + exhibition.id;
            a.textContent = displayText;
            li.appendChild(a);
            desktopList.appendChild(li);
        }

        if (mobileList) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = 'exhibition.html?id=' + exhibition.id;
            a.textContent = displayText;
            li.appendChild(a);
            mobileList.appendChild(li);
        }
    });
}

function initMobileNav() {
    var navLabel = document.getElementById('mobile-navigation-label');
    if (navLabel) {
        navLabel.addEventListener('click', function() {
            document.body.classList.toggle('sqs-mobile-nav-open');
            var mobileNav = document.getElementById('mobile-navigation');
            if (mobileNav) mobileNav.classList.toggle('sqs-mobile-nav-open');
        });
    }
}

function initFolderToggles() {
    var folderToggles = document.querySelectorAll('.folder-toggle');
    folderToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var parent = this.parentElement;
            if (parent) parent.classList.toggle('dropdown-open');
            var child = parent ? parent.querySelector('.folder-child') : null;
            if (child) child.classList.toggle('open');
        });
    });
}

function initDesktopNavTap() {
    var folders = document.querySelectorAll('#nav .folders-collection');
    folders.forEach(function(folder) {
        folder.addEventListener('click', function(e) {
            if (window.innerWidth > 639) return;
            if (e.target.closest('.subnav')) return;
            e.preventDefault();
            e.stopPropagation();
            var wasOpen = this.classList.contains('dropdown-open');
            folders.forEach(function(f) { f.classList.remove('dropdown-open'); });
            if (!wasOpen) this.classList.add('dropdown-open');
        });
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth > 639) return;
        if (!e.target.closest('#nav .folders-collection')) {
            folders.forEach(function(f) { f.classList.remove('dropdown-open'); });
        }
    });
}

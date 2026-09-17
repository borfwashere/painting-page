// year-data.js - Populates Work dropdown from data.js, always loads master data
(function() {
    var mainList = document.getElementById('main-work-list');
    var mobileList = document.getElementById('mobile-work-list');

    var script = document.createElement('script');
    script.src = 'data/data.js';
    script.onload = function() {
        if (typeof publicationsData === 'undefined') return;

        var years = Object.keys(publicationsData).sort().reverse();

        years.forEach(function(y) {
            if (mainList) {
                var li = document.createElement('li');
                li.className = 'blog-collection';
                var a = document.createElement('a');
                a.href = 'work.html?y=' + y;
                a.textContent = y;
                li.appendChild(a);
                mainList.appendChild(li);
            }
            if (mobileList) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = 'work.html?y=' + y;
                a.textContent = y;
                li.appendChild(a);
                mobileList.appendChild(li);
            }
        });

        function tryInit() {
            if (typeof initPublications === 'function') {
                initPublications();
            } else {
                setTimeout(tryInit, 50);
            }
        }
        tryInit();
    };
    document.head.appendChild(script);
})();

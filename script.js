document.documentElement.setAttribute('data-theme', 'swift');

// Scroll depth tracking — fires each event once per page load only
(function () {
    const fired = new Set();

    function track(event) {
        if (window.umami) window.umami.track(event);
    }

    // Section visibility: fires when the About section enters the viewport
    const aboutSection = document.getElementById('about');
    if (aboutSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !fired.has('scroll_section_about')) {
                    fired.add('scroll_section_about');
                    track('scroll_section_about');
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(aboutSection);
    }

    // Percentage milestones: 25 / 50 / 75 / 100
    var milestones = [25, 50, 75, 100];

    function onScroll() {
        var scrolled = window.scrollY + window.innerHeight;
        var total = document.documentElement.scrollHeight;
        var pct = (scrolled / total) * 100;

        milestones.forEach(function (milestone) {
            var key = 'scroll_' + milestone;
            if (pct >= milestone && !fired.has(key)) {
                fired.add(key);
                track(key);
            }
        });

        if (milestones.every(function (m) { return fired.has('scroll_' + m); })) {
            window.removeEventListener('scroll', onScroll);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}());

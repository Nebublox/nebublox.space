document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Handle anchor links on index.html (e.g., #features)
        if (currentFile === 'index.html' && linkHref.includes('#')) {
            // Optional: highlight based on scroll position? 
            // For now, let's just highlight "Tools" if on index.html
            if (linkHref === 'index.html#features' || linkHref === '#features') {
                // Maybe don't auto-highlight anchor links unless clicked?
                // Let's stick to file-based highlighting first.
            }
        }

        if (linkHref === currentFile || (linkHref === 'index.html' && currentFile === '')) {
            link.classList.add('nav-active');
        } else if (currentFile === 'index.html' && linkHref === 'index.html#features') {
            // Special case for "Tools" on properties? No, usually handled by scroll spy.
            // But if we want "Tools of the Trade" to look active on home:
            // link.classList.add('nav-active'); 
        }
    });

    // Mobile Menu Logic (Centralized here)
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // === AUTO-INJECT LEGAL MODAL ===
    // Ensure legal modal is available on all pages for "Rules of the Forge"
    if (!document.getElementById('legalModal')) {
        // Fetch and inject the legal modal HTML
        fetch('components/legal-modal.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
            })
            .catch(err => console.log('Legal modal component not found'));
    }

    // Load legal-modal.js if openLegalModal isn't defined
    if (typeof openLegalModal === 'undefined') {
        const script = document.createElement('script');
        script.src = 'js/legal-modal.js';
        document.head.appendChild(script);
    }

    // === AUTO-INJECT SUPPORT MODAL ===
    // Ensure support modal is available on all pages for "Support" button
    if (!document.getElementById('supportModal')) {
        fetch('components/support-modal.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
            })
            .catch(err => console.log('Support modal component not found'));
    }

    // Load support-modal.js if openSupportModal isn't defined
    if (typeof openSupportModal === 'undefined') {
        const script = document.createElement('script');
        script.src = 'js/support-modal.js';
        document.head.appendChild(script);
    }

    // === VERCEL SPEED INSIGHTS (invisible to users) ===
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const speedInsights = document.createElement('script');
        speedInsights.defer = true;
        speedInsights.src = '/_vercel/speed-insights/script.js';
        document.head.appendChild(speedInsights);
    }
});

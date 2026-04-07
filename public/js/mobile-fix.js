/**
 * BloxSmith AI - Mobile Layout Fix
 * SIMPLIFIED: Only fixes footer layout on mobile
 * Leaves testimonials animation UNTOUCHED
 * Last updated: 2025-12-28 04:43
 */

(function () {
    'use strict';

    function applyMobileFixes() {
        // Only run on mobile/tablet (1024px or less)
        if (window.innerWidth > 1024) return;

        console.log('[MobileFix] Applying 3-column horizontal footer...');

        // HIDE footer logo on mobile
        const footerBrand = document.querySelector('.footer-brand');
        if (footerBrand) {
            footerBrand.style.cssText = `
                display: none !important;
            `;
        }

        // 3-column horizontal grid for footer: The Forge | Connect | Anvil
        const footerGrid = document.querySelector('.footer-grid');
        if (footerGrid) {
            footerGrid.style.cssText = `
                display: grid !important;
                grid-template-columns: 1fr 1fr 1fr !important;
                gap: 10px !important;
                align-items: start !important;
                justify-items: center !important;
                text-align: center !important;
                max-width: 100% !important;
                padding: 10px !important;
            `;
        }

        // Fix footer columns - compact vertical inside each column
        const footerCols = document.querySelectorAll('.footer-col');
        footerCols.forEach(col => {
            col.style.cssText = `
                width: 100% !important;
                max-width: 110px !important;
                text-align: center !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
            `;
        });

        // Fix social links - horizontal wrap
        const socialLinks = document.querySelector('.social-links');
        if (socialLinks) {
            socialLinks.style.cssText = `
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
                gap: 4px !important;
                width: 100% !important;
            `;
        }

        // Fix social buttons - compact
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.style.cssText = `
                width: auto !important;
                min-width: 50px !important;
                padding: 4px 6px !important;
                font-size: 0.5rem !important;
                border-radius: 4px !important;
            `;
        });

        // SHOW and style anvil container on mobile - compact version
        const anvilContainer = document.querySelector('.footer-anvil-container');
        if (anvilContainer) {
            anvilContainer.style.cssText = `
                display: block !important;
                width: 100% !important;
                max-width: 100px !important;
                position: relative !important;
                text-align: center !important;
            `;
        }

        // Scale down anvil link
        const anvilLink = document.querySelector('.footer-anvil-link');
        if (anvilLink) {
            anvilLink.style.cssText = `
                display: block !important;
                width: 80px !important;
                height: auto !important;
                margin: 0 auto !important;
                position: relative !important;
                transform: scale(0.7) !important;
                transform-origin: center top !important;
            `;
        }

        // Scale down anvil text elements
        const anvilTexts = anvilContainer?.querySelectorAll('span');
        anvilTexts?.forEach(span => {
            span.style.fontSize = '0.4rem';
            span.style.lineHeight = '1.1';
        });

        // Hide the glow effect on mobile (too large)
        const anvilGlow = anvilContainer?.querySelector('[style*="radial-gradient"]');
        if (anvilGlow) {
            anvilGlow.style.display = 'none';
        }

        // Hide footer logo fire (duplicate safety)
        const footerLogo = document.querySelector('.footer-logo-fire');
        if (footerLogo) {
            footerLogo.style.display = 'none';
        }

        // FIX ALL OVERFLOWING ELEMENTS
        const viewportWidth = window.innerWidth;
        const maxContentWidth = viewportWidth - 40;

        // Fix code windows and preview elements
        const codeWindows = document.querySelectorAll('.code-window, .holographic-box, .preview-wrapper, .prompt-bubble, [class*="code-"]');
        codeWindows.forEach(el => {
            el.style.maxWidth = maxContentWidth + 'px';
            el.style.width = '100%';
            el.style.overflowX = 'hidden';
            el.style.boxSizing = 'border-box';
        });

        // Fix step items
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach(item => {
            item.style.maxWidth = (viewportWidth - 30) + 'px';
            item.style.width = '100%';
            item.style.boxSizing = 'border-box';
            item.style.overflowX = 'hidden';
        });

        // Fix all headings that might overflow
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(h => {
            h.style.wordWrap = 'break-word';
            h.style.overflowWrap = 'break-word';
            h.style.wordBreak = 'break-word';
            h.style.maxWidth = '100%';
        });

        // Fix sections that overflow
        const sections = document.querySelectorAll('section, .split-section-container, .steps-wrapper');
        sections.forEach(s => {
            s.style.maxWidth = '100vw';
            s.style.overflowX = 'hidden';
        });

        console.log('[MobileFix] 3-column horizontal footer with anvil applied. Overflow fixes applied.');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMobileFixes);
    } else {
        applyMobileFixes();
    }

    // Re-run on resize (with debounce)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            applyMobileFixes();
        }, 250);
    });

})();

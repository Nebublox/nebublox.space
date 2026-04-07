/* ===================================
   BLOXSMITH AI - LEGAL MODAL JAVASCRIPT
   Shared "Rules of the Forge" modal functionality
   =================================== */

/**
 * Opens the Legal Modal (Rules of the Forge)
 * @param {string} section - Optional section ID to scroll to: 'refund', 'privacy', 'cookies', 'terms'
 */
function openLegalModal(section) {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Scroll to specific section if provided
        if (section) {
            setTimeout(() => {
                const el = document.getElementById(section);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}

/**
 * Closes the Legal Modal
 */
function closeLegalModal() {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLegalModal();
});

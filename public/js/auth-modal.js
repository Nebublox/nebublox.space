/**
 * BloxSmith AI - Authentication Modal JavaScript
 * Flow: Step 1 (Roblox) → Step 2 (Terms) → Step 3 (Security) → Step 4 (Account)
 * Iron Gate Forge Theme Edition
 */

let hammerStrikes = 0;
const totalStrikesNeeded = 4;

// Fire particle system for auth modal
let authParticles = [];
let authParticleAnimationId = null;
let authModalLoaded = false;

/**
 * Load and inject the auth modal component HTML
 */
async function loadAuthModalComponent() {
    if (authModalLoaded) return true;

    // Check if modal already exists in page
    let existingModal = document.getElementById('authModal');

    // Check if it has 4 steps (the correct version)
    if (existingModal && document.getElementById('authStep4')) {
        authModalLoaded = true;
        return true;
    }

    // Remove old/incomplete modal if exists
    if (existingModal) {
        existingModal.remove();
    }

    try {
        const response = await fetch('/components/auth-modal.html');
        if (!response.ok) throw new Error('Failed to load auth modal');

        const html = await response.text();
        document.body.insertAdjacentHTML('beforeend', html);
        authModalLoaded = true;

        // Setup checkbox listener for terms step
        setupTermsCheckbox();

        return true;
    } catch (err) {
        console.error('Error loading auth modal:', err);
        return false;
    }
}

/**
 * Setup the terms checkbox to enable/disable the proceed button
 */
function setupTermsCheckbox() {
    const checkbox = document.getElementById('termsAgreeCheckbox');
    const btn = document.getElementById('btnAgreeTerms');

    if (checkbox && btn) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        });
    }
}

/**
 * Initialize fire particle system for modal
 */
function initAuthFireParticles() {
    const canvas = document.getElementById('authFireCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    authParticles = [];

    function createParticle() {
        const x = Math.random() * canvas.width;
        const y = canvas.height + 10;
        const size = Math.random() * 3 + 1;
        const speedY = Math.random() * 2 + 0.5;
        const speedX = (Math.random() - 0.5) * 1;
        const isAsh = Math.random() > 0.6;
        const color = isAsh
            ? `rgba(200, 200, 200, ${Math.random() * 0.6})`
            : `rgba(255, ${Math.floor(Math.random() * 100 + 50)}, 0, ${Math.random() * 0.8})`;
        authParticles.push({ x, y, size, speedY, speedX, color, life: 1.0 });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Generate new particles
        if (Math.random() > 0.85) {
            createParticle();
        }

        for (let i = authParticles.length - 1; i >= 0; i--) {
            const p = authParticles[i];
            p.y -= p.speedY;
            p.x += p.speedX;
            p.life -= 0.005;

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.life <= 0 || p.y < -10) {
                authParticles.splice(i, 1);
            }
        }

        ctx.globalAlpha = 1;
        authParticleAnimationId = requestAnimationFrame(animateParticles);
    }

    // Start with some particles
    for (let i = 0; i < 50; i++) {
        createParticle();
        authParticles[authParticles.length - 1].y = Math.random() * canvas.height;
    }

    animateParticles();
}

/**
 * Stop fire particle animation
 */
function stopAuthFireParticles() {
    if (authParticleAnimationId) {
        cancelAnimationFrame(authParticleAnimationId);
        authParticleAnimationId = null;
    }
    authParticles = [];
}

/**
 * Open the authentication modal
 */
async function openAuthModal() {
    // Load modal component if needed
    await loadAuthModalComponent();

    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Reset to step 1
        resetAuthSteps();
        // Start fire particles
        setTimeout(() => initAuthFireParticles(), 100);
        // Add active class for animation
        setTimeout(() => modal.classList.add('active'), 50);
    }
}

/**
 * Close the authentication modal
 */
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = '';
        resetAuthSteps();
        stopAuthFireParticles();
    }
}

/**
 * Step 1 → Step 2: Go to terms step after clicking Connect Roblox
 */
function goToTermsStep() {
    document.getElementById('authStep1').classList.remove('active');
    document.getElementById('authStep2').classList.add('active');
}

/**
 * Reset all steps to initial state
 */
function resetAuthSteps() {
    hammerStrikes = 0;
    const steps = document.querySelectorAll('.auth-step');
    steps.forEach((step, i) => {
        step.classList.remove('active');
        if (i === 0) step.classList.add('active');
    });

    // Reset checkbox
    const checkbox = document.getElementById('termsAgreeCheckbox');
    if (checkbox) checkbox.checked = false;

    // Reset agree button
    const btn = document.getElementById('btnAgreeTerms');
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    }

    // Reset progress bar
    const bar = document.getElementById('securityProgress');
    if (bar) bar.style.width = '0%';

    // Reset status text
    const status = document.getElementById('securityStatus');
    if (status) {
        status.innerText = 'Waiting for impact...';
        status.style.color = '#666';
        status.style.fontWeight = '600';
    }
}

/**
 * Step 1: Show Rules of the Forge with checkbox
 * User must agree to terms before connecting Roblox
 */
let linkedRobloxUser = null;

/**
 * When openAuthModal is called, Step 1 shows the Rules of the Forge
 * The HTML for Step 1 should already have the terms display with checkbox
 */

/**
 * Step 1 → Step 2: After agreeing to terms, proceed to Roblox connection
 */
function goToRobloxStep() {
    const checkbox = document.getElementById('termsAgreeCheckbox');
    if (!checkbox || !checkbox.checked) {
        alert('Please read and accept the Rules of the Forge to continue.');
        return;
    }

    // Move to Roblox connection step
    document.getElementById('authStep1').classList.remove('active');
    document.getElementById('authStep2').classList.add('active');
}

/**
 * Step 2 → Step 3: After agreeing to terms, go to Security Protocol (hammer strikes)
 */
function goToSecurityStep() {
    document.getElementById('authStep2').classList.remove('active');
    document.getElementById('authStep3').classList.add('active');
}

// Alias for backwards compatibility with older auth modal HTML
function goToSecurityCheck() {
    // Redirect old calls to the new flow (Hammer step) instead of the form
    goToHammerStep();
}

/**
 * Go directly to the Hammer (Security) step - This is Step 3
 */
function goToHammerStep() {
    document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));

    const step3 = document.getElementById('authStep3');
    if (step3) {
        step3.classList.add('active');
        // Reset hammer state
        hammerStrikes = 0;
        const bar = document.getElementById('securityProgress');
        if (bar) bar.style.width = '0%';
        const status = document.getElementById('securityStatus');
        if (status) status.innerText = '⚒️ Awaiting Impact...';
    } else {
        // If step 3 missing, just redirect to auth
        window.location.href = '/api/auth/login';
    }
}

/**
 * Redirect to Roblox OAuth after security protocol is complete
 */
function redirectToRobloxOAuth() {
    // Show loading state in step 3
    const step3 = document.getElementById('authStep3');
    if (step3) {
        step3.innerHTML = `
            <div class="auth-header">
                <div style="font-size: 50px; margin-bottom: 15px;">🔗</div>
                <h2 style="font-size: 1.4rem; color: #ff8c00;">Connecting to Roblox...</h2>
                <p style="color: #888;">You will be redirected to Roblox to authorize BloxSmith AI.</p>
            </div>
            <div class="loader" style="margin: 20px auto;"></div>
        `;
    }

    // Redirect to OAuth login endpoint
    setTimeout(() => {
        window.location.href = '/api/auth/login';
    }, 1000);
}


/**
 * Hammer strike function for security protocol
 */
function strikeAnvil(side) {
    const hammer = document.getElementById(side === 'left' ? 'hammerLeft' : 'hammerRight');
    const anvil = document.querySelector('.anvil-video');
    const bar = document.getElementById('securityProgress');
    const status = document.getElementById('securityStatus');
    const sound = document.getElementById('hammerSound');

    // Play sound
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => { });
    }

    // Trigger hammer animation
    hammer.classList.remove('striking');
    void hammer.offsetWidth;
    hammer.classList.add('striking');

    // Anvil spark effect
    setTimeout(() => {
        if (anvil) {
            anvil.classList.add('spark');
            setTimeout(() => anvil.classList.remove('spark'), 100);
        }
    }, 75);

    // Game logic
    if (hammerStrikes < totalStrikesNeeded) {
        hammerStrikes++;
        let percentage = (hammerStrikes / totalStrikesNeeded) * 100;
        bar.style.width = percentage + "%";

        // Flavor text updates
        if (hammerStrikes === 1) status.innerText = "Heating metal...";
        if (hammerStrikes === 2) status.innerText = "Shaping form...";
        if (hammerStrikes === 3) status.innerText = "Tempering steel...";

        if (hammerStrikes >= totalStrikesNeeded) {
            status.innerText = "FORGED IN FIRE ✓";
            status.style.color = "#22c55e";
            status.style.fontWeight = "800";

            // Security check complete - redirect to Roblox OAuth
            setTimeout(() => {
                redirectToRobloxOAuth();
            }, 800);
        }
    }
}

/**
 * Complete authentication and create account
 * Uses the linked Roblox username as the display name
 */
function finishAuth(event) {
    event.preventDefault();

    const form = document.getElementById('authFormMain');
    const inputs = form.querySelectorAll('input');
    const email = inputs[1] ? inputs[1].value : '';

    // Use the Roblox username as the primary display name
    const displayName = linkedRobloxUser || inputs[0].value;

    // Prompt for Roblox user ID to fetch avatar (in production this would come from OAuth)
    let robloxUserId = prompt("Enter your Roblox User ID (found in your profile URL):\nExample: If your URL is roblox.com/users/123456789/profile, enter 123456789");
    if (!robloxUserId || isNaN(robloxUserId)) {
        robloxUserId = '1'; // Default fallback
    }

    // Save to localStorage with Roblox account linked
    const userData = {
        username: displayName,
        robloxUsername: linkedRobloxUser,
        robloxUserId: robloxUserId,
        robloxLinked: linkedRobloxUser ? true : false,
        email: email,
        createdAt: new Date().toISOString(),
        termsAccepted: true,
        avatar: `https://www.roblox.com/headshot-thumbnail/image?userId=${robloxUserId}&width=150&height=150&format=png`
    };
    localStorage.setItem('bloxsmith_user', JSON.stringify(userData));
    localStorage.setItem('bloxsmith_authenticated', 'true');
    // Force admin re-login by clearing admin session
    localStorage.removeItem('bloxsmith_admin');

    alert("Account Forged! Welcome, " + displayName + "!\n\nRoblox account linked: " + (linkedRobloxUser || 'None'));
    closeAuthModal();

    // Redirect or refresh to update UI
    if (typeof checkAuthStatus === 'function') {
        checkAuthStatus();
    }
    window.location.href = "profile.html";
}

/**
 * Check if user is already logged in and update UI
 * Fetches from /api/auth/user for real server-side session
 */
async function checkAuthStatus() {
    const authArea = document.getElementById('userAuthArea');
    if (!authArea) return;

    try {
        const response = await fetch('/api/auth/user', {
            credentials: 'include'
        });

        if (!response.ok) {
            // Not logged in - keep login button
            return;
        }

        const data = await response.json();

        if (data.authenticated && data.user) {
            const user = data.user;

            // If user is logged in, ensure admin session is cleared to force re-login
            localStorage.removeItem('bloxsmith_admin');

            // User is logged in - show avatar with settings gear and logout
            authArea.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;">
                    <a href="profile.html" class="btn-holo-forge" style="display:flex;align-items:center;justify-content:center;padding:8px 10px;" title="View Profile - ${user.displayName || user.username}">
                        <img src="/api/avatar?userId=${user.userId}" style="width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,85,0,0.5);object-fit:cover;" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black.svg';this.style.filter='invert(1)';this.style.width='18px';this.style.height='18px';this.style.borderRadius='0';">
                    </a>
                    <a href="settings.html" class="btn-holo-forge" style="display:flex;align-items:center;justify-content:center;padding:8px 10px;" title="Settings">
                        <i class="fas fa-cog" style="font-size:16px; background: linear-gradient(135deg, #888888 0%, #666666 50%, #aaaaaa 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 3px rgba(150,150,150,0.5));"></i>
                    </a>
                    <a href="#" onclick="logout(); return false;" class="btn-holo-forge" style="display:flex;align-items:center;justify-content:center;padding:8px 10px;" title="Logout">
                        <i class="fas fa-sign-out-alt" style="font-size:16px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 3px rgba(239,68,68,0.5));"></i>
                    </a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        // Keep login button on error
    }
}

/**
 * Logout function - calls API and redirects
 */
function logout() {
    window.location.href = '/api/auth/logout';
}

// Initialize auth status and setup checkbox on page load
function initAuthModal() {
    // Check if user is already logged in
    if (typeof checkAuthStatus === 'function') {
        checkAuthStatus();
    }

    // Setup checkbox listener for pages that have inline modal (like index.html)
    const checkbox = document.getElementById('termsAgreeCheckbox');
    const btn = document.getElementById('btnAgreeTerms');
    if (checkbox && btn) {
        // Set initial disabled state
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        });

        console.log('Auth modal: Checkbox listener attached');
    }
}

// Run immediately if document is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModal);
} else {
    // DOM is already ready, run immediately
    initAuthModal();
}

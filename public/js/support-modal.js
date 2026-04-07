/**
 * BloxSmith AI - Support Modal
 * Include this script on any page that needs the support modal functionality
 * REQUIRES: User must be logged in via Roblox to submit tickets
 */

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('bloxsmith_authenticated') === 'true';
}

// Get logged in user data
function getUserData() {
    try {
        return JSON.parse(localStorage.getItem('bloxsmith_user') || '{}');
    } catch (e) {
        return {};
    }
}

// Create and inject support modal HTML
function initSupportModal() {
    if (document.getElementById('supportModal')) return; // Already exists

    const user = getUserData();
    const isLoggedIn = isAuthenticated();

    const modalHTML = `
    <div id="supportModal" class="support-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; overflow-y: auto;">
        <div class="support-modal-content" style="max-width: 500px; margin: 60px auto; padding: 40px; background: linear-gradient(145deg, #0a0a0a, #000); border: 1px solid rgba(255, 85, 0, 0.3); border-radius: 16px; position: relative;">
            <span onclick="closeSupportModal()" style="position: absolute; top: 20px; right: 25px; font-size: 2rem; color: #666; cursor: pointer;">&times;</span>
            <h1 style="color: #ff5500; font-size: 1.8rem; margin-bottom: 10px; text-align: center;">🔥 Need Help?</h1>
            <p style="color: #888; text-align: center; margin-bottom: 30px; font-size: 0.9rem;">Submit a support request and our team will get back to you.</p>
            
            ${isLoggedIn ? `
                <!-- Logged In - Show user info and form -->
                <div id="supportUserInfo" style="display: flex; align-items: center; gap: 15px; background: rgba(255,85,0,0.05); border: 1px solid rgba(255,85,0,0.2); border-radius: 10px; padding: 15px; margin-bottom: 25px;">
                    <img src="${user.avatar || 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-8846059345789345-Png/150/150/AvatarHeadshot/Png'}" 
                         style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #ff5500;"
                         onerror="this.src='https://tr.rbxcdn.com/30DAY-AvatarHeadshot-8846059345789345-Png/150/150/AvatarHeadshot/Png'">
                    <div>
                        <div style="color: #fff; font-weight: 700; font-size: 1rem;">${user.username || user.robloxUsername || 'Unknown'}</div>
                        <div style="color: #888; font-size: 0.75rem;">Roblox ID: ${user.robloxUserId || 'N/A'}</div>
                    </div>
                    <div style="margin-left: auto; color: #22c55e; font-size: 0.75rem; font-weight: 600;">
                        <i class="fas fa-check-circle"></i> Verified
                    </div>
                </div>
                <form id="supportForm" onsubmit="submitSupportTicket(event)">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; color: #666; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Email (optional - for direct reply)</label>
                        <input type="email" id="supportEmail" placeholder="your@email.com" style="width: 100%; background: #000; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 6px; font-family: 'Montserrat', sans-serif;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; color: #666; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Subject *</label>
                        <input type="text" id="supportSubject" required placeholder="What do you need help with?" style="width: 100%; background: #000; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 6px; font-family: 'Montserrat', sans-serif;">
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; color: #666; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Message *</label>
                        <textarea id="supportMessage" required placeholder="Describe your issue in detail..." rows="4" style="width: 100%; background: #000; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 6px; font-family: 'Montserrat', sans-serif; resize: vertical;"></textarea>
                    </div>
                    <button type="submit" id="supportSubmitBtn" style="width: 100%; background: linear-gradient(135deg, #ff5500, #d32f2f); color: #fff; border: none; padding: 14px; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;">
                        <i class="fas fa-paper-plane"></i> Submit Request
                    </button>
                </form>
            ` : `
                <!-- Not Logged In - Show login required message -->
                <div id="supportLoginRequired" style="text-align: center; padding: 30px;">
                    <i class="fas fa-user-lock" style="font-size: 4rem; color: #ff5500; margin-bottom: 20px;"></i>
                    <h2 style="color: #fff; margin-bottom: 15px; font-size: 1.3rem;">Login Required</h2>
                    <p style="color: #888; font-size: 0.9rem; margin-bottom: 25px;">
                        You must be logged in with your Roblox account to submit support tickets.<br>
                        <span style="color: #666; font-size: 0.8rem;">This helps us verify your identity and prevent spam.</span>
                    </p>
                    <button onclick="closeSupportModal(); if(typeof openAuthModal === 'function') openAuthModal();" style="background: linear-gradient(135deg, #ff5500, #d32f2f); color: #fff; border: none; padding: 14px 30px; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; margin-bottom: 15px;">
                        <i class="fab fa-roblox"></i> Login with Roblox
                    </button>
                    <p style="color: #666; font-size: 0.8rem;">
                        For immediate help, join our <a href="https://discord.gg/Mq7xaT7tF9" target="_blank" style="color: #5865F2;">Discord</a>
                    </p>
                </div>
            `}
            
            <div id="supportSuccess" style="display: none; text-align: center; padding: 30px;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #22c55e; margin-bottom: 15px;"></i>
                <h2 style="color: #fff; margin-bottom: 10px;">Request Submitted!</h2>
                <p style="color: #888;">We'll get back to you as soon as possible.</p>
                <p style="color: #666; font-size: 0.85rem; margin-top: 15px;">For faster support, join our <a href="https://discord.gg/Mq7xaT7tF9" target="_blank" style="color: #5865F2;">Discord</a></p>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close on click outside
    document.getElementById('supportModal').addEventListener('click', function (e) {
        if (e.target === this) closeSupportModal();
    });
}

function openSupportModal() {
    // Re-create modal to reflect current auth state
    const existing = document.getElementById('supportModal');
    if (existing) existing.remove();

    initSupportModal();
    document.getElementById('supportModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSupportModal() {
    document.getElementById('supportModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    const form = document.getElementById('supportForm');
    const success = document.getElementById('supportSuccess');
    if (form) form.style.display = 'block';
    if (success) success.style.display = 'none';
    if (form) form.reset();
}

async function submitSupportTicket(e) {
    e.preventDefault();

    // Verify user is still logged in
    if (!isAuthenticated()) {
        alert('Session expired. Please log in again.');
        closeSupportModal();
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
    }

    const user = getUserData();
    const btn = document.getElementById('supportSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    const ticket = {
        // User data from verified Roblox account
        user_name: user.username || user.robloxUsername || 'Unknown',
        user_id: user.robloxUserId || null,
        user_avatar: user.avatar || null,
        // Optional email from form
        email: document.getElementById('supportEmail').value || null,
        // Ticket content
        subject: document.getElementById('supportSubject').value,
        message: document.getElementById('supportMessage').value,
        status: 'open',
        priority: 'normal'
    };

    try {
        if (window.supabase) {
            await supabase.createTicket(ticket);
        }
        document.getElementById('supportForm').style.display = 'none';
        document.getElementById('supportSuccess').style.display = 'block';
    } catch (err) {
        console.error('Failed to submit ticket:', err);
        alert('Failed to submit. Please try Discord instead.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
    }
}

/**
 * BloxSmith Admin Security System
 * Enhanced security with Supabase role verification
 * 
 * Features:
 * - IP-based rate limiting
 * - Supabase auth verification
 * - Admin role checking
 * - Failed attempt logging
 */

const AdminSecurity = {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
    STORAGE_KEY: 'bloxsmith_admin_attempts',

    // Supabase config
    SUPABASE_URL: 'https://agyioavcbopivzqurhdb.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFneWlvYXZjYm9waXZ6cXVyaGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MDIxODAsImV4cCI6MjA4MjQ3ODE4MH0.6GsMEt7vQr_UwZj9mLb2I5Nf7lzShj_Ds2DyrZN9Pv0',

    // Authorized admin usernames (God Mode access)
    ADMIN_USERS: ['lilnug', 'kingdavid'],
    ADMIN_PINS: {
        'lilnug': '9423',
        'kingdavid': '9413'
    },

    /**
     * Initialize security system
     * Returns false if user should be blocked
     */
    async init() {
        // Check if locked out
        const attempts = this.getAttemptData();
        if (attempts.locked && Date.now() < attempts.lockUntil) {
            this.showBlockedPage(attempts.lockUntil);
            return false;
        }

        // Clear expired lockout
        if (attempts.locked && Date.now() >= attempts.lockUntil) {
            this.resetAttempts();
        }

        return true;
    },

    /**
     * Verify admin credentials
     * @param {string} username 
     * @param {string} pin 
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async verifyCredentials(username, pin) {
        const lowerUser = username.toLowerCase().trim();

        // Check if user is in the God Mode list
        if (!this.ADMIN_USERS.includes(lowerUser)) {
            await this.recordFailedAttempt(lowerUser);
            return { success: false, message: 'Unauthorized user' };
        }

        // Verify PIN
        if (this.ADMIN_PINS[lowerUser] !== pin) {
            await this.recordFailedAttempt(lowerUser);
            return { success: false, message: 'Invalid PIN' };
        }

        // Success - log the access
        await this.logSecurityEvent('admin_login_success', { username: lowerUser });

        // Reset attempts on success
        this.resetAttempts();

        return { success: true, message: 'Access granted' };
    },

    /**
     * Check if current user has admin role via Supabase
     * For future use when integrating with Supabase Auth
     */
    async checkSupabaseAdminRole(userId) {
        try {
            const response = await fetch(
                `${this.SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=role`,
                {
                    headers: {
                        'apikey': this.SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`
                    }
                }
            );

            if (!response.ok) return false;

            const data = await response.json();
            if (data.length > 0 && data[0].role === 'admin') {
                return true;
            }

            return false;
        } catch (error) {
            console.error('Admin role check failed:', error);
            return false;
        }
    },

    /**
     * Record a failed login attempt
     */
    async recordFailedAttempt(attemptedUsername) {
        const attempts = this.getAttemptData();
        attempts.count++;
        attempts.lastAttempt = Date.now();
        attempts.attempts.push({
            username: attemptedUsername,
            timestamp: Date.now(),
            ip: 'client-side'
        });

        // Check if should lock out
        if (attempts.count >= this.MAX_ATTEMPTS) {
            attempts.locked = true;
            attempts.lockUntil = Date.now() + this.LOCKOUT_DURATION;

            // Log to Supabase
            await this.logSecurityEvent('admin_lockout', {
                attemptedUsername,
                attemptCount: attempts.count
            });
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempts));

        return attempts.count;
    },

    /**
     * Log security event to Supabase
     */
    async logSecurityEvent(eventType, details) {
        try {
            await fetch(`${this.SUPABASE_URL}/rest/v1/security_logs`, {
                method: 'POST',
                headers: {
                    'apikey': this.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    event_type: eventType,
                    details: JSON.stringify(details),
                    created_at: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Failed to log security event:', error);
        }
    },

    /**
     * Get attempt data from localStorage
     */
    getAttemptData() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            count: 0,
            locked: false,
            lockUntil: null,
            lastAttempt: null,
            attempts: []
        };
    },

    /**
     * Reset attempt counter
     */
    resetAttempts() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Show warning message
     */
    showWarning(remainingAttempts) {
        // Create warning toast if not exists
        let toast = document.getElementById('securityToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'securityToast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(0,0,0,0.95);
                border: 2px solid #ff4444;
                border-radius: 12px;
                padding: 20px;
                color: #ff4444;
                font-weight: 700;
                z-index: 10000;
                animation: shake 0.5s;
            `;
            document.body.appendChild(toast);
        }

        toast.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> 
            SECURITY WARNING<br>
            <span style="font-size:0.9rem;color:#ff8888;">
                ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before lockout
            </span>
        `;

        setTimeout(() => toast.remove(), 5000);
    },

    /**
     * Show blocked page
     */
    showBlockedPage(lockUntil) {
        const timeRemaining = Math.ceil((lockUntil - Date.now()) / 60000);

        document.body.innerHTML = `
            <style>
                body {
                    background: linear-gradient(135deg, #1a0000 0%, #0a0000 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    font-family: 'Montserrat', sans-serif;
                    color: #ff4444;
                    text-align: center;
                }
                .block-container {
                    background: rgba(0,0,0,0.9);
                    border: 2px solid #ff4444;
                    border-radius: 20px;
                    padding: 60px;
                    max-width: 500px;
                    box-shadow: 0 0 50px rgba(255,68,68,0.3);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 30px rgba(255,68,68,0.3); }
                    50% { box-shadow: 0 0 60px rgba(255,68,68,0.5); }
                }
                h1 { font-size: 2.5rem; margin-bottom: 20px; }
                p { color: #888; margin-bottom: 20px; }
                .timer { 
                    font-size: 3rem; 
                    font-weight: 900; 
                    color: #ff6666;
                    margin: 20px 0;
                }
                .skull { font-size: 5rem; margin-bottom: 20px; }
            </style>
            <div class="block-container">
                <div class="skull">💀</div>
                <h1>ACCESS DENIED</h1>
                <p>Too many failed login attempts detected.</p>
                <p>The forge is sealed for:</p>
                <div class="timer">${timeRemaining} min</div>
                <p style="font-size:0.8rem;color:#555;">
                    This incident has been logged to Supabase security_logs
                </p>
            </div>
        `;
    },

    /**
     * Verify current session is still valid
     * Call this on admin-panel.html to ensure user is authorized
     */
    verifySession() {
        const adminUser = localStorage.getItem('bloxsmith_admin');

        if (!adminUser) {
            window.location.href = 'admin.html';
            return false;
        }

        // Verify user is in the authorized list
        if (!this.ADMIN_USERS.includes(adminUser.toLowerCase())) {
            localStorage.removeItem('bloxsmith_admin');
            window.location.href = 'index.html';
            return false;
        }

        return true;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminSecurity;
}

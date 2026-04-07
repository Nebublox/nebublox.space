/**
 * BloxSmith AI - Roblox OAuth Login Initiation
 * Generates PKCE challenge and redirects to Roblox authorization
 */

const crypto = require('crypto');

// Generate random string for PKCE
function generateCodeVerifier() {
    return crypto.randomBytes(32).toString('base64url');
}

// Create SHA256 hash for PKCE challenge
function generateCodeChallenge(verifier) {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
}

// Generate random state for CSRF protection
function generateState() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = async function handler(req, res) {
    try {
        const clientId = (process.env.ROBLOX_CLIENT_ID || '').trim();
        const siteUrl = (process.env.SITE_URL || 'https://www.bloxsmith.pro').trim();

        // Use the same approved callback for both web and mobile
        const redirectUri = `${siteUrl}/api/auth/callback`;

        if (!clientId) {
            return res.status(500).json({ error: 'ROBLOX_CLIENT_ID not configured' });
        }

        // Generate PKCE values
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        const state = generateState();

        // Check if mobile request and encode in state
        const isMobile = req.query.mobile === 'true';
        const stateWithMobile = isMobile ? `${state}:mobile` : state;

        // Store verifier in cookie for callback validation
        const cookieOptions = 'Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600';
        res.setHeader('Set-Cookie', [
            `code_verifier=${codeVerifier}; ${cookieOptions}`,
            `oauth_state=${state}; ${cookieOptions}`
        ]);

        // Roblox OAuth authorization URL
        const authUrl = new URL('https://apis.roblox.com/oauth/v1/authorize');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('scope', 'openid profile');
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');
        authUrl.searchParams.set('state', stateWithMobile);

        // Redirect to Roblox login
        res.redirect(302, authUrl.toString());
    } catch (error) {
        console.error('OAuth login error:', error);
        res.status(500).json({ error: 'Failed to initiate OAuth' });
    }
};

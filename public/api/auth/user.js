/**
 * BloxSmith AI - Get Current User API
 * Returns user info from session cookie
 */

module.exports = async function handler(req, res) {
    try {
        const cookies = parseCookies(req.headers.cookie);
        const sessionCookie = cookies.bloxsmith_session;

        if (!sessionCookie) {
            return res.status(200).json({
                authenticated: false,
                error: 'Not logged in'
            });
        }

        // Decode session data
        const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());

        // Check if session expired
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
            // Clear expired session
            res.setHeader('Set-Cookie',
                `bloxsmith_session=; Path=/; HttpOnly; Secure; Max-Age=0`
            );
            return res.status(200).json({
                authenticated: false,
                error: 'Session expired'
            });
        }

        // Return user info (without tokens for security)
        res.json({
            authenticated: true,
            user: {
                userId: sessionData.userId,
                username: sessionData.username,
                displayName: sessionData.displayName,
                avatarUrl: sessionData.avatarUrl,
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            authenticated: false,
            error: 'Session error'
        });
    }
};

// Helper to parse cookies
function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookies[name] = value;
        });
    }
    return cookies;
}

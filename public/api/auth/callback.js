/**
 * BloxSmith AI - Roblox OAuth Callback Handler
 * Exchanges authorization code for tokens and fetches user info
 */

module.exports = async function handler(req, res) {
    try {
        const { code, state } = req.query;
        const clientId = (process.env.ROBLOX_CLIENT_ID || '').trim();
        const clientSecret = (process.env.ROBLOX_CLIENT_SECRET || '').trim();
        const siteUrl = (process.env.SITE_URL || 'https://www.bloxsmith.pro').trim();
        const redirectUri = `${siteUrl}/api/auth/callback`;

        // Parse cookies
        const cookies = parseCookies(req.headers.cookie);
        const storedVerifier = cookies.code_verifier;
        const storedState = cookies.oauth_state;

        // Check if state contains mobile flag
        const isMobileState = state && state.endsWith(':mobile');
        const cleanState = isMobileState ? state.replace(':mobile', '') : state;

        // Validate state to prevent CSRF
        if (!storedState || storedState !== cleanState) {
            return res.redirect(`${siteUrl}/index.html?error=invalid_state`);
        }

        if (!code) {
            return res.redirect(`${siteUrl}/index.html?error=no_code`);
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                code_verifier: storedVerifier,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Token exchange failed:', errorData);
            return res.redirect(`${siteUrl}/index.html?error=token_exchange_failed`);
        }

        const tokens = await tokenResponse.json();

        // Fetch user info from Roblox
        const userInfoResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`,
            },
        });

        if (!userInfoResponse.ok) {
            console.error('Failed to fetch user info');
            return res.redirect(`${siteUrl}/index.html?error=userinfo_failed`);
        }

        const userInfo = await userInfoResponse.json();

        // Sync user to Supabase (create if new, update if exists)
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                // Upsert user - use roblox_user_id as the unique identifier
                await fetch(`${supabaseUrl}/rest/v1/users`, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates,return=minimal'
                    },
                    body: JSON.stringify({
                        roblox_user_id: userInfo.sub,
                        name: userInfo.nickname || userInfo.preferred_username || userInfo.name,
                        email: userInfo.email || '',
                        plan: 'Free',
                        status: 'active',
                        joined: new Date().toISOString()
                    })
                });
                console.log('User synced to Supabase:', userInfo.preferred_username);
            } catch (syncError) {
                console.error('Supabase sync error (non-fatal):', syncError);
                // Continue with login even if sync fails
            }
        }

        // Create session data
        const sessionData = {
            userId: userInfo.sub,
            username: userInfo.preferred_username || userInfo.name,
            displayName: userInfo.nickname || userInfo.name,
            avatarUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${userInfo.sub}&width=150&height=150&format=png`,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiresAt: Date.now() + (tokens.expires_in * 1000),
            expiresAt: Date.now() + (10 * 365 * 24 * 60 * 60 * 1000), // 10 years
        };

        // Set session cookie (base64 encoded JSON)
        const sessionCookie = Buffer.from(JSON.stringify(sessionData)).toString('base64');

        // Clear PKCE cookies and set session (Max-Age = 10 years)
        res.setHeader('Set-Cookie', [
            `code_verifier=; Path=/; HttpOnly; Secure; Max-Age=0`,
            `oauth_state=; Path=/; HttpOnly; Secure; Max-Age=0`,
            `bloxsmith_session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=315360000`,
        ]);

        // Use mobile flag from state parameter (set earlier in the function)
        const redirectPage = isMobileState ? '/auth-redirect.html?mobile=true' : '/profile.html?login=success';

        // Redirect with mobile flag if needed
        res.redirect(`${siteUrl}${redirectPage}`);

    } catch (error) {
        console.error('OAuth callback error:', error);
        const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
        res.redirect(`${siteUrl}/index.html?error=callback_error`);
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

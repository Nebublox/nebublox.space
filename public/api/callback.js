module.exports = async function handler(req, res) {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).send(`Error: ${error}`);
    }

    if (!code) {
        return res.status(400).send("No code provided");
    }

    const CLIENT_ID = "6555271286260986933";
    const CLIENT_SECRET = process.env.ROBLOX_CLIENT_SECRET || "RBX-FhURBRUQ6EOZ1iaSXuQYHmEXS4vfTZZVWs3d1Ug_anWYFRv_E0AMsJZ8r1WUN_TU";

    // Supabase Setup
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    // Determine Redirect URI dynamically based on the request host
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'];
    // Try to match the incoming host, but ensure it's one of our allowed domains
    const baseUri = host.includes('localhost') ? `${protocol}://${host}` : `https://${host}`;
    const REDIRECT_URI = `${baseUri}/callback`;

    try {
        // Exchange code for token
        const tokenResponse = await fetch("https://apis.roblox.com/oauth/v1/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            console.error(tokenData);
            return res.status(500).send("Failed to retrieve access token: " + JSON.stringify(tokenData));
        }

        // Get User Info
        const userResponse = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userResponse.json();

        // Fetch avatar headshot from Roblox Thumbnails API
        let avatarUrl = 'https://tr.rbxcdn.com/53eb9b17fe1432a809c73a134d156943/150/150/AvatarHeadshot/Png';
        try {
            const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userData.sub}&size=150x150&format=Png&isCircular=false`);
            const avatarData = await avatarResponse.json();
            if (avatarData.data && avatarData.data[0] && avatarData.data[0].imageUrl) {
                avatarUrl = avatarData.data[0].imageUrl;
            }
        } catch (e) {
            console.log('Failed to fetch avatar, using default');
        }

        // SYNC TO SUPABASE
        if (supabase) {
            try {
                const { error: upsertError } = await supabase
                    .from('users')
                    .upsert({
                        id: userData.sub, // Using Roblox ID as primary key match
                        roblox_user_id: userData.sub,
                        name: userData.name || userData.preferred_username,
                        avatar: avatarUrl,
                        last_seen: new Date().toISOString()
                        // plan, joined, etc. are handled by defaults or existing rows
                    }, { onConflict: 'id' });

                if (upsertError) {
                    console.error('Supabase Sync Error:', upsertError);
                    // Don't block login on sync fail, but log it
                } else {
                    console.log(`Synced user ${userData.sub} to Supabase`);
                }
            } catch (syncErr) {
                console.error('Supabase Sync Exception:', syncErr);
            }
        } else {
            console.warn('Supabase not configured in Vercel env, skipping sync.');
        }

        // ADMIN CHECK
        const ADMIN_ID = "3159416380";
        const isAdmin = userData.sub === ADMIN_ID;

        // Determine destination based on state
        let destination = '/';
        let destLabel = 'Home';
        if (state === 'dashboard') {
            destination = '/profile.html';
            destLabel = 'Dashboard';
        } else if (state === 'admin') {
            destination = '/admin.html';
            destLabel = 'Admin Panel';
        } else if (state === 'settings') {
            destination = '/settings.html';
            destLabel = 'Settings';
        }

        if (state === 'admin' && !isAdmin) {
            return res.send(`
                <html><body style="background:#0a0a0a;color:white;font-family:sans-serif;text-align:center;padding:50px;">
                <h1 style="color:#ef4444">❌ Access Denied</h1>
                <p>You are not authorized to view the Admin Panel.</p>
                <p>Logged in as: ${userData.name || userData.preferred_username}</p>
                <a href="/" style="color:#ef4444;">Go Home</a>
                </body></html>
            `);
        }

        // Redirect with script to save data
        const safeUserData = JSON.stringify({
            id: userData.sub,
            name: userData.name || userData.preferred_username,
            profile: avatarUrl,
            isAdmin: isAdmin
        });

        const html = `
        <html>
        <head><title>Logged In - BloxSmith AI</title></head>
        <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;text-align:center;padding:50px;">
            <div style="max-width:400px;margin:0 auto;background:rgba(20,20,20,0.9);padding:40px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);">
                <img src="${avatarUrl}" style="width:100px;height:100px;border-radius:50%;border:3px solid #ef4444;margin-bottom:20px;box-shadow:0 0 20px rgba(239,68,68,0.3);">
                <h1 style="color:#22c55e;margin-bottom:10px;">✅ Welcome!</h1>
                <p style="font-size:1.3rem;margin-bottom:5px;color:white;">${userData.name || userData.preferred_username}</p>
                <p style="color:#888;margin-bottom:20px;">Redirecting to ${destLabel}...</p>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;">
                    <div style="width:0%;height:100%;background:linear-gradient(90deg,#ef4444,#22c55e);animation:loading 1.5s ease forwards;"></div>
                </div>
            </div>
            <style>@keyframes loading{to{width:100%;}}</style>
            <script>
                const user = ${safeUserData};
                localStorage.setItem('bloxsmith_user', JSON.stringify(user));
                localStorage.setItem('bloxsmith_roblox_user', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    profile: user.profile
                }));
                if (user.isAdmin) {
                    localStorage.setItem('bloxsmith_admin_token', '${tokenData.access_token}');
                }
                setTimeout(() => {
                    window.location.href = "${destination}";
                }, 1500);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error: " + err.message);
    }
}

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

    // Determine redirect URI dynamically
    // Hardcode to match the Client ID configuration EXACTLY.
    // Dynamic 'host' checks cause mismatches if the user is on 'www'.
    const REDIRECT_URI = "https://bloxsmith.pro/api/auth";

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
                redirect_uri: REDIRECT_URI, // Must match exactly
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
        let avatarUrl = 'https://tr.rbxcdn.com/53eb9b17fe1432a809c73a134d156943/150/150/AvatarHeadshot/Png'; // Default
        try {
            const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userData.sub}&size=150x150&format=Png&isCircular=false`);
            const avatarData = await avatarResponse.json();
            if (avatarData.data && avatarData.data[0] && avatarData.data[0].imageUrl) {
                avatarUrl = avatarData.data[0].imageUrl;
            }
        } catch (e) {
            console.log('Failed to fetch avatar, using default');
        }

        // ADMIN CHECK (King_davez / 3159416380)
        const ADMIN_ID = "3159416380";
        const isAdmin = userData.sub === ADMIN_ID;

        // Determine destination based on state or default
        let destination = '/profile.html';
        if (state === 'admin') {
            destination = '/admin.html';
        } else if (state === 'home') {
            destination = '/';
        }

        if (state === 'admin' && !isAdmin) {
            return res.send(`
                <html><body>
                <h1 style="color:red">Access Denied</h1>
                <p>You are not authorized to view the Admin Panel.</p>
                <p>Logged in as: ${userData.name || userData.preferred_username} (${userData.sub})</p>
                <a href="/">Go Home</a>
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

        // Determine destination label for display
        let destLabel = 'Home';
        if (state === 'admin') destLabel = 'Admin Panel';
        else if (state === 'dashboard') destLabel = 'Dashboard';

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
                
                // GRANT PRO STATUS if user is King_davez (3159416380)
                if (user.id === '3159416380') {
                    localStorage.setItem('bloxsmith_plan', 'pro');
                } else {
                    localStorage.setItem('bloxsmith_plan', 'free');
                }
                // Also set for app compatibility
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

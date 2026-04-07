/**
 * BloxSmith AI - Avatar Proxy
 * Fetches the fresh CDN link for a user's avatar and redirects to it.
 * Solves CORS and expiration issues.
 */

module.exports = async function handler(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`);

        if (!response.ok) {
            throw new Error(`Roblox API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0 && data.data[0].imageUrl) {
            // Cache for 1 hour
            res.setHeader('Cache-Control', 'public, max-age=3600');
            // Redirect to the actual CDN image
            return res.redirect(data.data[0].imageUrl);
        } else {
            // Fallback image
            return res.redirect('https://tr.rbxcdn.com/30day-avatar-headshot-png');
        }

    } catch (error) {
        console.error('Avatar fetch error:', error);
        // Fallback on error
        return res.redirect('https://tr.rbxcdn.com/30day-avatar-headshot-png');
    }
};

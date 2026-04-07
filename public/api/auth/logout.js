/**
 * BloxSmith AI - Logout API
 * Clears session cookie and redirects to home
 */

module.exports = async function handler(req, res) {
    const siteUrl = (process.env.SITE_URL || 'http://localhost:3000').trim();

    // Clear session cookie
    res.setHeader('Set-Cookie',
        `bloxsmith_session=; Path=/; HttpOnly; Max-Age=0`
    );

    // Check if this is an API call or redirect request
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        res.json({ success: true, message: 'Logged out' });
    } else {
        res.redirect(302, `${siteUrl}/`);
    }
};

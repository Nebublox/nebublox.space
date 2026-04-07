module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const envs = {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
        SITE_URL: process.env.SITE_URL || 'Not Set',
        NODE_ENV: process.env.NODE_ENV
    };

    res.status(200).json({
        message: 'Admin Diagnostic Endpoint',
        environment: envs,
        timestamp: new Date().toISOString()
    });
};

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // 1. CORS Setup
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Secret Key Check (Service Key required)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Server Config Error: Missing Supabase Env Vars.' });
    }

    // 3. SMTP Config Check
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        return res.status(500).json({ error: 'Server Config Error: Missing SMTP Env Vars.' });
    }

    const { subject, message, forceExec } = req.body;

    if (!subject || !message) {
        return res.status(400).json({ error: 'Missing subject or message content' });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 4. Fetch All Users
        // In a real production app with thousands of users, you would batch this or use a queue.
        // For now, we fetch all users with an email.
        const { data: users, error: dbError } = await supabase
            .from('users')
            .select('email')
            .not('email', 'is', null)
            .neq('email', '');

        if (dbError) throw dbError;

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found to email.' });
        }

        const recipientEmails = users.map(u => u.email).filter(e => e.includes('@')); // Basic filter
        console.log(`Preparing to email ${recipientEmails.length} users...`);

        // 5. Setup Transporter
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT || 587,
            secure: SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        // 6. Send Mail
        // Use BCC to hide recipient list from each other
        const info = await transporter.sendMail({
            from: `"${SMTP_FROM || 'BloxSmith Forge'}" <${SMTP_USER}>`,
            to: SMTP_USER, // Send to self
            bcc: recipientEmails, // Everyone else in BCC
            subject: subject,
            html: message, // Allow HTML content
            text: message.replace(/<[^>]*>?/gm, '') // Fallback text
        });

        console.log('Message sent: %s', info.messageId);

        // 7. Log Activity
        await supabase.from('activity_log').insert({
            event_type: 'announcement',
            description: `Sent announcement: "${subject}" to ${recipientEmails.length} users.`,
            created_at: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: `Announcement sent to ${recipientEmails.length} users.`,
            messageId: info.messageId
        });

    } catch (err) {
        console.error('Email Error:', err);
        res.status(500).json({ error: `Failed to send email: ${err.message}` });
    }
};

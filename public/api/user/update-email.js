/**
 * API Endpoint: Update User Email
 * Saves user's email address to Supabase database
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get session from cookie
        const sessionCookie = req.cookies.bloxsmith_session;
        if (!sessionCookie) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Decode session
        const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));

        // Check if session is expired
        if (sessionData.expiresAt && new Date(sessionData.expiresAt) < new Date()) {
            return res.status(401).json({ error: 'Session expired' });
        }

        const userId = sessionData.userId;
        const { email } = req.body;

        // Validate email format
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Update email in Supabase
        const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ejsxxoilsbyxchunoeml.supabase.co';
        const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

        // First, check if user exists
        const checkResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/users?roblox_id=eq.${userId}`,
            {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const existingUsers = await checkResponse.json();

        if (existingUsers && existingUsers.length > 0) {
            // User exists - update email
            const updateResponse = await fetch(
                `${SUPABASE_URL}/rest/v1/users?roblox_id=eq.${userId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({ email })
                }
            );

            if (!updateResponse.ok) {
                throw new Error('Failed to update email');
            }
        } else {
            // User doesn't exist - create new user record
            const createResponse = await fetch(
                `${SUPABASE_URL}/rest/v1/users`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        roblox_id: userId,
                        name: sessionData.username || sessionData.displayName,
                        email: email,
                        avatar: sessionData.avatarUrl || null
                    })
                }
            );

            if (!createResponse.ok) {
                throw new Error('Failed to create user record');
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Email updated successfully'
        });

    } catch (error) {
        console.error('Email update error:', error);
        return res.status(500).json({
            error: 'Failed to update email',
            details: error.message
        });
    }
}

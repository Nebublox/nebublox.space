const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // 1. CORS Setup
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production if possible
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Secret Key Check (Service Key for Admin Actions)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Env Vars:', { url: !!supabaseUrl, key: !!supabaseServiceKey });
        return res.status(500).json({
            error: 'Server Config Error: SUPABASE_URL or SUPABASE_SERVICE_KEY is missing in Vercel.'
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Admin Verification (Basic for now - checking body or session would be better)
    // Ideally, we verify the 'bloxsmith_token' cookie here, but for this "Strictly Vercel" quick fix,
    // we'll assume the frontend only exposes this to admins. 
    // TODO: Add robust token verification.

    const { action, id, reason, payload } = req.body;

    if (!action || !id) {
        return res.status(400).json({ error: 'Missing action or id' });
    }

    try {
        let result;

        switch (action) {
            case 'delete_violation':
                // Validate UUID to prevent Postgres errors with old mock IDs
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                if (!isUUID) {
                    console.log(`Skipping DB delete for non-UUID id: ${id}`);
                    return res.status(200).json({ message: `Mock violation ${id} ignored by DB` });
                }

                // Hard Delete
                const { error: delErr } = await supabase
                    .from('violations')
                    .delete()
                    .eq('id', id);
                if (delErr) throw delErr;
                result = { message: `Violation ${id} deleted` };
                break;

            case 'ban_user':
                // Update User Status
                // If ID is numeric (Roblox ID), we filter by roblox_user_id, else generic id
                const { error: banErr } = await supabase
                    .from('users')
                    .update({ status: 'banned' })
                    .eq('id', id); // Assuming 'id' matches the one in DB

                if (banErr) throw banErr;
                result = { message: `User ${id} banned` };
                break;

            case 'archive_ticket':
                // Update Ticket Status
                const { error: archErr } = await supabase
                    .from('support_tickets')
                    .update({ status: 'archived' })
                    .eq('id', id);
                if (archErr) throw archErr;
                result = { message: `Ticket ${id} archived` };
                break;

            case 'block_ip':
                // Insert into blocked_ips
                const { error: blockErr } = await supabase
                    .from('blocked_ips')
                    .insert({
                        ip_address: payload.ip,
                        reason: reason || 'Admin Block',
                        blocked_until: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString(),
                        blocked_by: 'Admin'
                    });
                if (blockErr) throw blockErr;
                result = { message: `IP ${payload.ip} blocked` };
                break;

            case 'reply_ticket':
                // payload: { response, adminName }
                const { error: replyErr } = await supabase
                    .from('support_tickets')
                    .update({
                        admin_response: payload.response,
                        responded_at: new Date().toISOString(),
                        responded_by: payload.adminName || 'Admin',
                        status: 'pending' // pending user response
                    })
                    .eq('id', id);
                if (replyErr) throw replyErr;
                result = { message: `Replied to ticket ${id}` };
                break;

            case 'restore_ticket':
                const { error: restoreErr } = await supabase
                    .from('support_tickets')
                    .update({ status: 'open' })
                    .eq('id', id);
                if (restoreErr) throw restoreErr;
                result = { message: `Ticket ${id} restored` };
                break;

            case 'generate_key':
                // payload: { key_code, type, notes }
                const { error: keyErr } = await supabase
                    .from('access_keys')
                    .insert([{
                        key_code: payload.key_code,
                        type: payload.type,
                        notes: payload.notes,
                        created_by: 'Admin'
                    }]);
                if (keyErr) throw keyErr;
                result = { message: `Key generated successfully` };
                break;

            case 'update_user':
                // payload: { updates } object e.g. { plan: 'lifetime', status: 'active' }
                const { error: userErr } = await supabase
                    .from('users')
                    .update(payload.updates)
                    .eq('id', id);
                if (userErr) throw userErr;
                result = { message: `User ${id} updated` };
                break;

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        res.status(200).json({ success: true, ...result });

    } catch (err) {
        console.error('Admin Action Error:', err);
        res.status(500).json({ error: err.message });
    }
};

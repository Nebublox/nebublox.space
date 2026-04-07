import { NextResponse } from 'next/server';

const DISCORD_API = 'https://discord.com/api/v10';

// Hardcoded Role IDs
const VOID_WALKER_ROLE_ID = '1470851279717666868';
const LOST_SOUL_ROLE_ID = '1470851311158296823';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const errorParam = url.searchParams.get('error');

    const origin = url.origin;
    const successUrl = new URL('/verify-success', origin);

    // User denied Discord authorization
    if (errorParam === 'access_denied') {
        successUrl.searchParams.set('error', 'access_denied');
        return NextResponse.redirect(successUrl.toString());
    }

    if (!code) {
        successUrl.searchParams.set('error', 'no_code');
        return NextResponse.redirect(successUrl.toString());
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    const botToken = process.env.DISCORD_TOKEN;

    if (!clientId || !clientSecret || !redirectUri || !botToken) {
        console.error('[VERIFY CALLBACK] Missing env vars:', { clientId: !!clientId, clientSecret: !!clientSecret, redirectUri: !!redirectUri, botToken: !!botToken });
        successUrl.searchParams.set('error', 'internal_error');
        return NextResponse.redirect(successUrl.toString());
    }

    try {
        // ── Step 1: Exchange code for access token ──
        const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenRes.ok) {
            const errText = await tokenRes.text();
            console.error('[VERIFY CALLBACK] Token exchange failed:', tokenRes.status, errText);
            successUrl.searchParams.set('error', 'auth_failed');
            return NextResponse.redirect(successUrl.toString());
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // ── Step 2: Get user info ──
        const userRes = await fetch(`${DISCORD_API}/users/@me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userRes.ok) {
            console.error('[VERIFY CALLBACK] User fetch failed:', userRes.status);
            successUrl.searchParams.set('error', 'user_fetch_failed');
            return NextResponse.redirect(successUrl.toString());
        }

        const userData = await userRes.json();
        const userId = userData.id as string;
        const username = userData.username as string;

        // ── Step 3: Assign Void Walker role via Bot REST API ──
        // Get all guilds the bot is in, then find the user and assign roles
        const guildsRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
            headers: { Authorization: `Bot ${botToken}` },
        });

        let roleAssigned = false;

        if (guildsRes.ok) {
            const guilds = await guildsRes.json();

            for (const guild of guilds) {
                try {
                    // Check if user is in this guild
                    const memberRes = await fetch(`${DISCORD_API}/guilds/${guild.id}/members/${userId}`, {
                        headers: { Authorization: `Bot ${botToken}` },
                    });

                    if (!memberRes.ok) continue; // User not in this guild

                    // Add Void Walker 🌑 role
                    const addRoleRes = await fetch(
                        `${DISCORD_API}/guilds/${guild.id}/members/${userId}/roles/${VOID_WALKER_ROLE_ID}`,
                        {
                            method: 'PUT',
                            headers: {
                                Authorization: `Bot ${botToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    console.log(`[VERIFY CALLBACK] Add Void Walker role: ${addRoleRes.status}`);

                    // Remove Lost Soul 👻 role
                    const removeRoleRes = await fetch(
                        `${DISCORD_API}/guilds/${guild.id}/members/${userId}/roles/${LOST_SOUL_ROLE_ID}`,
                        {
                            method: 'DELETE',
                            headers: { Authorization: `Bot ${botToken}` },
                        }
                    );
                    console.log(`[VERIFY CALLBACK] Remove Lost Soul role: ${removeRoleRes.status}`);

                    roleAssigned = true;
                    break; // Found the member, done
                } catch (err) {
                    console.error(`[VERIFY CALLBACK] Error processing guild ${guild.id}:`, err);
                    continue;
                }
            }
        } else {
            console.error('[VERIFY CALLBACK] Failed to fetch bot guilds:', guildsRes.status);
        }

        // ── Step 4: Redirect to success ──
        if (roleAssigned) {
            successUrl.searchParams.set('username', username);
        } else {
            // Still redirect to success but note they need to join the server
            successUrl.searchParams.set('username', username);
            successUrl.searchParams.set('note', 'join_server');
        }

        return NextResponse.redirect(successUrl.toString());

    } catch (err) {
        console.error('[VERIFY CALLBACK] Critical error:', err);
        successUrl.searchParams.set('error', 'internal_error');
        return NextResponse.redirect(successUrl.toString());
    }
}

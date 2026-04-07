import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json(
            { error: 'Discord OAuth credentials are not configured correctly.' },
            { status: 500 }
        );
    }

    // Construct the Discord OAuth2 URL
    // 'identify' to get their ID, 'guilds.join' to verify server membership
    const scopes = ['identify', 'guilds.join'];
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');

    discordAuthUrl.searchParams.append('client_id', clientId);
    discordAuthUrl.searchParams.append('redirect_uri', redirectUri);
    discordAuthUrl.searchParams.append('response_type', 'code');
    discordAuthUrl.searchParams.append('scope', scopes.join(' '));
    discordAuthUrl.searchParams.append('prompt', 'consent');

    // Redirect the user to Discord's authorization page
    return NextResponse.redirect(discordAuthUrl.toString());
}

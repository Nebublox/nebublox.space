'use client';

import Script from 'next/script';

export default function PuterScript() {
    return (
        <Script
            src="https://js.puter.com/v2/"
            strategy="afterInteractive"
            onLoad={() => {
                // Suppress auth check errors (KV works anonymously)
                if (typeof window !== 'undefined' && (window as any).puter) {
                    const originalFetch = window.fetch;
                    window.fetch = function (...args) {
                        const url = args[0]?.toString() || '';
                        if (url.includes('puter.com/whoami')) {
                            return originalFetch(...args).catch(() =>
                                Promise.resolve(new Response('{"authenticated":false}', { status: 200 }))
                            );
                        }
                        return originalFetch(...args);
                    };
                }
            }}
        />
    );
}

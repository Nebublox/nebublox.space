// Force Recompile
import './globals.css'
import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import FloatingParticles from './components/FloatingParticles'
import PuterScript from './components/PuterScript'
import NebulaBackground from './components/NebulaBackground'
import Script from 'next/script'
import ExecutorTicker from './components/ExecutorTicker'

export const metadata: Metadata = {
  title: 'NEBUBLOX - Ultimate Roblox Script Hub | Powered by NEBULA ENGINE',
  description: 'The premiere destination for high-performance Roblox scripts. Anime Ghost, Anime Finals, Anime Clash and more. Powered by the DarkMatter V1 Nebula Engine.',
  keywords: ['Roblox Scripts', 'Anime Ghost Script', 'Anime Finals Script', 'Anime Clash Script', 'Nebula Engine', 'DarkMatter V1', 'Roblox Automation'],
  authors: [{ name: 'DarkMatter' }],
  openGraph: {
    title: 'NEBUBLOX - Ultimate Roblox Script Hub',
    description: 'High-performance Roblox scripts powered by Nebula Engine.',
    url: 'https://nebublox.space',
    siteName: 'Nebublox',
    images: [
      {
        url: '/nebublox-logo.png',
        width: 1200,
        height: 630,
        alt: 'Nebublox Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEBUBLOX - Ultimate Roblox Script Hub',
    description: 'High-performance Roblox scripts powered by Nebula Engine.',
    images: ['/nebublox-logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P8C74ZX9');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-screen w-full flex flex-col items-center text-starlight overflow-x-hidden relative">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P8C74ZX9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Global Background - The Nebula */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <NebulaBackground />
        </div>

        {/* Puter.js Cloud OS SDK */}
        <PuterScript />

        {/* Analytics/Tracking Script */}
        <Script
          id="nebublox-tracking"
          strategy="afterInteractive"
          src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1245808"
          data-cfasync="false"
        />

        {/* Floating Pixel Particles */}
        <FloatingParticles />

        {/* Main Container */}
        <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen relative z-10">
          <Navbar />
          <ExecutorTicker />

          <main className="flex-grow w-full flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
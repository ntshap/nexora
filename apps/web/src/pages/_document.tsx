import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="NEXORA is a transparent, AI-driven DeFi platform that helps creative professionals earn yield safely through automated, non-custodial strategies." />
        <link rel="canonical" href="https://nexora.app" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NEXORA",
              "url": "https://nexora.app",
              "logo": "https://nexora.app/logo.png",
              "description": "AI-driven DeFi platform for creative professionals offering non-custodial yield optimization.",
              "foundingDate": "2026",
              "sameAs": [
                "https://twitter.com/nexora",
                "https://github.com/ntshap/nexora"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://nexora.app/about"
              }
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

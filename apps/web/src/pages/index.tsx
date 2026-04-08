import Head from "next/head";

import CoreFeaturesSection from "@/components/CoreFeaturesSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { Navbar } from "@/components/Navbar";
import WhyNexoraSection from "@/components/WhyNexoraSection";

const HomePage = () => (
  <>
    <Head>
      <title>NEXORA - AI-Driven DeFi Platform for Creative Professionals</title>
      <meta
        name="description"
        content="NEXORA helps creative professionals earn 5-8% yields safely through AI-driven DeFi strategies. Non-custodial vaults, automated optimization, designed for artists and musicians."
      />
      <link rel="canonical" href="https://nexora.app" />
      
      {/* Open Graph */}
      <meta property="og:title" content="NEXORA - AI-Driven DeFi Platform for Creative Professionals" />
      <meta
        property="og:description"
        content="NEXORA helps creative professionals earn 5-8% yields safely through AI-driven DeFi strategies. Non-custodial vaults, automated optimization, designed for artists and musicians."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://nexora.app" />
      <meta property="og:image" content="https://nexora.app/logo.png" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nexora" />
      <meta name="twitter:title" content="NEXORA - AI-Driven DeFi Platform for Creative Professionals" />
      <meta name="twitter:description" content="NEXORA helps creative professionals earn 5-8% yields safely through AI-driven DeFi strategies." />
      <meta name="twitter:image" content="https://nexora.app/logo.png" />
      
      {/* Structured Data - WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "NEXORA",
            "url": "https://nexora.app",
            "description": "AI-driven DeFi platform for creative professionals offering non-custodial yield optimization.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://nexora.app/blog?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </Head>
    <div className="min-h-screen bg-hero-bg">
      <Navbar />
      <HeroSection />
      <WhyNexoraSection />
      <HowItWorksSection />
      <CoreFeaturesSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  </>
);

export default HomePage;

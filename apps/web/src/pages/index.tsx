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
      <title>NEXORA</title>
      <meta
        name="description"
        content="NEXORA helps creative professionals grow wealth with transparent, AI-driven DeFi strategies."
      />
      <meta property="og:title" content="NEXORA" />
      <meta
        property="og:description"
        content="NEXORA accelerates creator wealth with intelligent on-chain yield strategies."
      />
      <meta property="og:image" content="/nexora-uploads/aec69c72-3eb2-46c3-b3ff-5567e422a175.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nexora" />
      <meta name="twitter:image" content="/nexora-uploads/aec69c72-3eb2-46c3-b3ff-5567e422a175.png" />
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

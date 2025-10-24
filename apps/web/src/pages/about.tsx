import Head from "next/head";

import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const pillars = [
  {
    title: "Creator-first",
    description:
      "Everything we build is designed for independent creatives juggling irregular cash flow. We automate the yield plumbing so you can focus on your craft.",
  },
  {
    title: "Transparent DeFi",
    description:
      "SynthVault and supporting vault strategies are fully on-chain and auditable. No black boxes, just verifiable receipts and human-readable explanations.",
  },
  {
    title: "Guided Autonomy",
    description:
      "Our portfolio plans, educational content, and alerts nudge you toward better decisions without ever locking you in. You stay in control of every transaction.",
  },
];

const team = [
  {
    name: "Lira Singh",
    role: "Product & Strategy",
    bio: "Former touring musician turned fintech PM who understands the pain of unpredictable income streams.",
  },
  {
    name: "Miguel Ortega",
    role: "Protocol Engineering",
    bio: "Smart contract engineer previously at LayerZero and VaultCraft, leading security reviews and deployments.",
  },
  {
    name: "Ayla Chen",
    role: "UX & Education",
    bio: "Design lead focused on demystifying DeFi through clear copy, interactive explainers, and community workshops.",
  },
];

const AboutPage = () => (
  <>
    <Head>
      <title>About NEXORA</title>
      <meta name="description" content="Learn more about the mission and team behind NEXORA." />
    </Head>
    <div className="min-h-screen bg-hero-bg text-hero-text">
      <Navbar />
      <main className="px-6 sm:px-12 lg:px-[100px] py-12 lg:py-16">
        <section className="mx-auto max-w-5xl rounded-[32px] border border-white/5 bg-[#0f1020] p-8 sm:p-12 shadow-[0_40px_80px_-60px_rgba(14,16,31,0.65)]">
          <header className="mb-10 space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-hero-text-muted">Our Story</p>
            <h1 className="text-3xl font-plus-jakarta font-extrabold sm:text-4xl">Building a creative-friendly DeFi co-pilot</h1>
            <p className="text-base text-hero-text-muted sm:text-lg">
              NEXORA started as a weekend project to help gigging artists keep their earnings productive without handing them
              over to custodians. Today we are a small, distributed team crafting transparent DeFi tools so creatives anywhere
              can grow wealth deliberately.
            </p>
          </header>

          <section className="grid gap-6 rounded-[28px] border border-white/5 bg-[#101123] p-8">
            <h2 className="text-2xl font-plus-jakarta font-semibold">What we stand for</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map((pillar) => (
                <article key={pillar.title} className="rounded-2xl border border-white/5 bg-[#11122a] p-6">
                  <h3 className="text-xl font-manrope font-semibold">{pillar.title}</h3>
                  <p className="mt-3 text-sm text-hero-text-muted">{pillar.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12 grid gap-6 rounded-[28px] border border-white/5 bg-[#101123] p-8">
            <h2 className="text-2xl font-plus-jakarta font-semibold">Meet the team</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {team.map((member) => (
                <article key={member.name} className="rounded-2xl border border-white/5 bg-[#11122a] p-6">
                  <p className="text-sm uppercase tracking-wide text-hero-text-muted">{member.role}</p>
                  <h3 className="mt-2 text-xl font-manrope font-semibold">{member.name}</h3>
                  <p className="mt-3 text-sm text-hero-text-muted">{member.bio}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  </>
);

export default AboutPage;

import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";

const blogPosts = [
  {
    title: "The Complete Guide to Earning Yield on Crypto Assets (Even Without Technical Knowledge)",
    description: "Learn how creative professionals can safely earn yield on their crypto assets through DeFi without needing deep technical expertise. Discover automated strategies, risk management, and NEXORA's simplified approach.",
    slug: "how-to-earn-yield-on-crypto-assets",
    category: "DeFi Guide",
    readTime: "8 min read",
    datePublished: "2026-04-04"
  },
  {
    title: "DeFi for Beginners: A Non-Technical Introduction for Creative Professionals",
    description: "Demystify decentralized finance with this beginner-friendly guide designed specifically for artists, musicians, and designers. Understanding DeFi concepts without blockchain complexity.",
    slug: "defi-for-beginners-non-technical",
    category: "Education",
    readTime: "7 min read",
    datePublished: "2026-04-03"
  },
  {
    title: "How to Safely Earn Yield Without Technical Knowledge: A Creator's Guide",
    description: "Discover the safest methods for earning yield on crypto assets without technical expertise. Learn about non-custodial vaults, risk management, and security-first approaches to DeFi.",
    slug: "how-to-safely-earn-yield-without-technical-knowledge",
    category: "Safety",
    readTime: "9 min read",
    datePublished: "2026-04-02"
  },
  {
    title: "Best DeFi Platform for Non-Technical Users: Complete Comparison 2026",
    description: "Compare the top DeFi platforms designed for non-technical users. Comprehensive analysis of features, safety, user experience, and which platform is best for different creator types.",
    slug: "best-defi-platform-for-non-technical-users",
    category: "Platform Review",
    readTime: "12 min read",
    datePublished: "2026-04-01"
  },
  {
    title: "Passive Income From Digital Assets: Strategies for Creative Professionals",
    description: "Generate passive income from your digital assets with automated strategies designed for busy creative professionals. Learn about yield optimization and hands-off income generation.",
    slug: "how-to-passively-earn-on-digital-assets",
    category: "Income Strategy",
    readTime: "10 min read",
    datePublished: "2026-03-31"
  }
];

const BlogIndex = () => {
  const canonicalUrl = "https://nexora.app/blog";
  
  return (
    <>
      <Head>
        <title>DeFi Blog for Creative Professionals | NEXORA</title>
        <meta 
          name="description" 
          content="Learn how creative professionals can safely earn yield and grow wealth through DeFi. Expert guides on yield farming, non-custodial platforms, and passive income strategies." 
        />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:title" content="DeFi Blog for Creative Professionals | NEXORA" />
        <meta property="og:description" content="Learn how creative professionals can safely earn yield and grow wealth through DeFi. Expert guides on yield farming, non-custodial platforms, and passive income strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://nexora.app/logo.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DeFi Blog for Creative Professionals | NEXORA" />
        <meta name="twitter:description" content="Learn how creative professionals can safely earn yield and grow wealth through DeFi. Expert guides on yield farming, non-custodial platforms, and passive income strategies." />
        <meta name="twitter:image" content="https://nexora.app/logo.png" />
      </Head>
      
      <div className="min-h-screen bg-hero-bg text-hero-text">
        <Navbar />
        
        <main className="mx-auto max-w-6xl px-6 py-12 sm:px-12 lg:px-16">
          <header className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-plus-jakarta font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              DeFi Education for
              <span className="block bg-gradient-text bg-clip-text text-transparent bg-[length:200%_200%] bg-[position:0%_50%] animate-gradient-text">
                Creative Professionals
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-hero-text-muted sm:text-xl">
              Learn how to safely grow your creative income through transparent, AI-driven DeFi strategies. 
              No technical expertise required – just practical guides for artists, musicians, and designers.
            </p>
          </header>
          
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </section>
          
          <section className="mt-20 rounded-2xl border border-white/10 bg-[#0f1020] p-12 text-center">
            <h2 className="mb-4 text-3xl font-plus-jakarta font-bold">
              Ready to Put Knowledge Into Action?
            </h2>
            <p className="mb-8 text-lg text-hero-text-muted">
              Start earning yield on your creative income with NEXORA's AI-driven DeFi platform designed specifically for non-technical users.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-gradient-hero px-8 py-3 font-semibold text-hero-text transition-all duration-300 hover:shadow-hero"
              >
                Launch App
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-3 font-semibold text-hero-text hover:border-white/30"
              >
                Learn About NEXORA
              </a>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogIndex;
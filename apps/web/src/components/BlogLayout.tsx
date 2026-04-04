import Head from "next/head";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  author: string;
  readTime: string;
  category: string;
}

const BlogLayout = ({
  children,
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author,
  readTime,
  category,
}: BlogLayoutProps) => {
  const canonicalUrl = `https://nexora.app/blog/${slug}`;
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "NEXORA",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nexora.app/logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "image": "https://nexora.app/logo.png",
    "url": canonicalUrl
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nexora.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://nexora.app/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Head>
        <title>{title} | NEXORA Blog</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://nexora.app/logo.png" />
        <meta property="article:published_time" content={datePublished} />
        <meta property="article:modified_time" content={dateModified} />
        <meta property="article:author" content={author} />
        <meta property="article:section" content={category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://nexora.app/logo.png" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>
      
      <div className="min-h-screen bg-hero-bg text-hero-text">
        <Navbar />
        
        <main className="mx-auto max-w-4xl px-6 py-12 sm:px-12 lg:px-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-hero-text-muted">
            <Link href="/" className="hover:text-hero-text">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-hero-text">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-hero-text">{title}</span>
          </nav>
          
          {/* Article header */}
          <header className="mb-12 space-y-6">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-gradient-hero px-4 py-1 text-sm font-semibold">
                {category}
              </span>
              <h1 className="text-3xl font-plus-jakarta font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="text-lg text-hero-text-muted sm:text-xl">
                {description}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-hero-text-muted">
              <span>By {author}</span>
              <span>•</span>
              <span>Published {new Date(datePublished).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span>•</span>
              <span>Last Updated {new Date(dateModified).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
              <span>•</span>
              <span>{readTime} read</span>
            </div>
          </header>
          
          {/* Article content */}
          <article className="prose prose-lg prose-invert max-w-none">
            {children}
          </article>
          
          {/* Call to action */}
          <section className="mt-16 rounded-2xl border border-white/10 bg-[#0f1020] p-8 text-center">
            <h3 className="mb-4 text-2xl font-plus-jakarta font-bold">
              Ready to Start Earning Yield?
            </h3>
            <p className="mb-6 text-hero-text-muted">
              Join NEXORA today and let our AI-driven platform help you grow your creative income through safe, transparent DeFi strategies.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-gradient-hero px-8 py-3 font-semibold text-hero-text transition-all duration-300 hover:shadow-hero"
            >
              Launch App
            </Link>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogLayout;
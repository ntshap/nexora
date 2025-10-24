import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const features = [
  {
    title: "AI-Driven Yield Planning",
    description:
      "Intelligent algorithms analyze market conditions to optimize your portfolio returns automatically.",
    image: "/nexora-uploads/0e4baa47-075e-4e27-b410-01eee1edd8b6.png",
  },
  {
    title: "Non-Custodial ERC-4626 Vaults",
    description:
      "Maintain full ownership of your assets while earning passive income through secure, standardized vaults.",
    image: "/nexora-uploads/9b38bdaa-af3d-48ec-be9b-8566bd3e5e73.png",
  },
  {
    title: "On-Chain Transparency via The Graph",
    description: "Track every transaction with complete visibility through decentralized indexing protocols.",
    image: "/nexora-uploads/30d517aa-3652-409f-84b3-907a8866aff9.png",
  },
  {
    title: "Optimized for Creative Professionals",
    description:
      "Simplified DeFi experience designed specifically for artists, musicians, and designers to grow their wealth.",
    image: "/nexora-uploads/92af23bf-1f68-4f8b-931b-ca3ca62e361e.png",
  },
];

const HeroSection = () => (
  <section className="relative overflow-hidden bg-hero-bg">
    <video
      className="absolute inset-0 h-full w-full scale-110 object-cover saturate-0"
      autoPlay
      muted
      loop
      playsInline
      controls={false}
    >
      <source
        src="https://res.cloudinary.com/da7s1izqw/video/upload/v1752106173/Cw9D8nOGuMDx0eVn02OhggPWXg_kesp06.mp4"
        type="video/mp4"
      />
    </video>

    <div
      className="absolute inset-0"
      style={{ backgroundColor: "#060613", mixBlendMode: "color" }}
    />

    <motion.div
      className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-6 pb-16 pt-28 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-16 xl:pt-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex-1 space-y-6 text-left sm:text-center lg:text-left" variants={itemVariants}>
        <h1 className="text-4xl font-plus-jakarta font-extrabold leading-tight text-hero-text sm:text-5xl lg:text-6xl xl:text-7xl">
          Empowering Creators
          <br />
          through{" "}
          <span className="bg-gradient-text bg-clip-text text-transparent">Transparent AI-Driven DeFi</span>
        </h1>
        <p className="max-w-2xl text-base font-manrope text-hero-text-muted sm:mx-auto sm:text-lg lg:mx-0 lg:text-xl">
          NEXORA helps creative professionals build wealth through intelligent, on-chain yield plans powered by
          transparent AI and decentralized infrastructure.
        </p>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            href="/dashboard"
            prefetch
            className="inline-flex items-center justify-center rounded-full border border-button-border bg-gradient-hero px-8 py-3 text-base font-manrope font-semibold text-hero-text transition-all duration-300 hover:shadow-hero sm:text-lg"
          >
            Launch App
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-3 text-base font-manrope font-semibold text-hero-text hover:border-white/30"
          >
            Explore How It Works
          </Link>
        </div>
      </motion.div>

    </motion.div>

    <motion.div
      id="how-it-works"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 sm:px-12 lg:px-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default HeroSection;


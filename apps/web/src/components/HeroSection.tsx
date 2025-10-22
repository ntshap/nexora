import { Button } from "@/components/ui/button";
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
  <div className="min-h-screen bg-hero-bg overflow-hidden relative">
    <video
      className="absolute inset-0 w-full h-full object-cover saturate-0 z-0 scale-120 -translate-y-[20%]"
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
      className="absolute inset-0 z-[1]"
      style={{ backgroundColor: "#060613", mixBlendMode: "color" }}
    ></div>

    <motion.div
      className="px-6 sm:px-12 lg:px-16 pt-[125px] pb-20 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          <motion.div className="flex-1 max-w-3xl" variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-plus-jakarta font-extrabold text-hero-text leading-tight">
              Empowering Creators
              <br />
              through{" "}
              <span className="bg-gradient-text bg-clip-text text-transparent">
                Transparent AI-Driven DeFi
              </span>
            </h1>
          </motion.div>

          <motion.div
            className="flex-1 max-w-sm lg:max-w-md flex flex-col items-start lg:items-end gap-6"
            variants={itemVariants}
          >
            <p className="text-lg sm:text-xl text-hero-text-muted font-manrope leading-relaxed text-left lg:text-right">
              NEXORA helps creative professionals build wealth through intelligent, on-chain yield plans powered by transparent AI and decentralized infrastructure.
            </p>
            <Button variant="hero" size="lg" className="rounded-full px-8 py-4 text-lg h-14 w-fit">
              Launch App
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>

    <motion.div
      className="px-6 sm:px-12 lg:px-16 py-16 lg:py-20 relative z-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 overflow-visible"
          variants={containerVariants}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  </div>
);

export default HeroSection;


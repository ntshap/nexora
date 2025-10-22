import { Zap, FolderOpen, MousePointer, Cloud } from "lucide-react";

const accentStyle = {
  background:
    "radial-gradient(ellipse 126.93% 100% at 50% 100%, #9E91FF 4%, #4931FF 64%)",
  boxShadow: "12.7px 12.7px 12.7px rgba(0, 0, 0, 0.1)",
};

const featureBlocks = [
  {
    icon: Zap,
    title: "Smart Risk Modeling",
    description: "Adaptive AI evaluates market and user profiles to ensure stable yield.",
  },
  {
    icon: FolderOpen,
    title: "Multi-Chain Access",
    description: "Supports Ethereum, Polygon, and Arbitrum for seamless portfolio scaling.",
  },
  {
    icon: MousePointer,
    title: "Creator-Centric Design",
    description: "Simple, intuitive interface tailored for creators without DeFi experience.",
  },
  {
    icon: Cloud,
    title: "Complete Asset Control",
    description: "Non-custodial and fully transparent - your keys, your vaults.",
  },
];

const CoreFeaturesSection = () => (
  <section
    className="w-full px-6 sm:px-12 lg:px-[100px] py-12 lg:py-20"
    style={{ backgroundColor: "#060613" }}
  >
    <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-20">
      <div className="flex flex-col justify-start items-start gap-6">
        <h2 className="w-full max-w-[427px] text-[#DDDDDD] text-2xl sm:text-3xl lg:text-[40px] font-plus-jakarta font-extrabold leading-tight lg:leading-[48px]">
          Decentralized Finance for the Creative Economy
        </h2>
        <p className="w-full max-w-[356px] text-[#646464] text-base sm:text-lg lg:text-xl font-manrope font-normal leading-relaxed lg:leading-7">
          NEXORA combines AI, DeFi, and transparency to empower creators worldwide. With rule-based risk models, cross-chain integration, and clean UX, it brings institutional-grade finance into the hands of the creative class.
        </p>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
        {featureBlocks.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl flex flex-col justify-end items-start gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={accentStyle}>
              <Icon color="#DDDDDD" size={32} />
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-4">
              <h3 className="w-full text-[#DDDDDD] text-xl lg:text-2xl font-manrope font-bold leading-tight">
                {title}
              </h3>
              <p className="w-full text-[#646464] text-sm lg:text-base font-manrope font-normal leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CoreFeaturesSection;


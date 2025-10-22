import { Wallet, Brain, Vault, LineChart } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      icon: Wallet,
      title: "Connect Wallet",
      description: "Sign in securely using your wallet or creative ID."
    },
    {
      number: "2",
      icon: Brain,
      title: "AI Risk Analysis",
      description: "NEXORA's intelligent agent analyzes your asset profile and risk tolerance."
    },
    {
      number: "3",
      icon: Vault,
      title: "Vault Allocation",
      description: "Smart DeFi vaults (ERC-4626) are automatically optimized for yield and safety."
    },
    {
      number: "4",
      icon: LineChart,
      title: "Track & Withdraw",
      description: "Real-time analytics powered by The Graph keep your portfolio transparent and accessible anytime."
    }
  ];

  return (
    <div className="w-full px-6 sm:px-12 lg:px-[100px] py-12 lg:py-20 bg-hero-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[#DDDDDD] text-3xl sm:text-4xl lg:text-[48px] font-plus-jakarta font-extrabold leading-tight lg:leading-[56px] mb-4">
            How NEXORA Works
          </h2>
          <p className="text-[#646464] text-lg sm:text-xl font-manrope font-normal">
            Non-custodial. Transparent. Designed for creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ 
                    background: 'radial-gradient(ellipse 126.93% 100.00% at 50.00% 100.00%, #9E91FF 4%, #4931FF 64%)',
                    boxShadow: '12.7px 12.7px 12.7px rgba(0,0,0,0.1)'
                  }}
                >
                  <IconComponent color="#DDDDDD" size={36} />
                </div>
                <h3 className="text-[#DDDDDD] text-xl lg:text-2xl font-manrope font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-[#646464] text-sm lg:text-base font-manrope font-normal leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;


import { Button } from "@/components/ui/button";

const FinalCTASection = () => {
  return (
    <div className="w-full px-6 sm:px-12 lg:px-[100px] py-16 lg:py-24 bg-hero-bg">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-[#DDDDDD] text-3xl sm:text-4xl lg:text-[52px] font-plus-jakarta font-extrabold leading-tight lg:leading-[60px] mb-6">
          Redefine How Creators Grow Their Wealth.
        </h2>
        <p className="text-[#646464] text-lg sm:text-xl lg:text-2xl font-manrope font-normal leading-relaxed mb-8">
          Smarter. Safer. More Transparent. Join the next evolution of creator-driven finance.
        </p>
        <Button 
          variant="hero" 
          size="lg"
          className="rounded-full px-8 py-4 text-lg h-14"
        >
          Try NEXORA Now
        </Button>
      </div>
    </div>
  );
};

export default FinalCTASection;


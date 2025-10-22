const Footer = () => (
  <footer
    className="w-full px-6 sm:px-12 lg:px-[100px] py-8 lg:py-12 border-t border-hero-text/10"
    style={{ backgroundColor: "#060612" }}
  >
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center lg:items-start gap-2">
          <img
            src="/nexora-uploads/aec69c72-3eb2-46c3-b3ff-5567e422a175.png"
            alt="NEXORA Logo"
            className="h-8 mb-2"
          />
          <p className="text-[#646464] text-sm font-manrope font-normal">
            Intelligence. Transparency. Freedom for Creators.
          </p>
        </div>
        <div className="text-[#646464] text-sm font-manrope font-normal">
          &copy; 2025 NEXORA. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;


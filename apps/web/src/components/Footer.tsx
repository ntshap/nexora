import Image from "next/image";
import Link from "next/link";

const Footer = () => (
  <footer
    className="w-full px-6 sm:px-12 lg:px-[100px] py-8 lg:py-12 border-t border-hero-text/10"
    style={{ backgroundColor: "#060612" }}
  >
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="flex flex-col items-center lg:items-start gap-2">
          <Image src="/logo.png" alt="NEXORA Logo" width={180} height={48} className="h-12 w-auto mb-2" />
          <p className="text-[#646464] text-sm font-manrope font-normal">
            Intelligence. Transparency. Freedom for Creators.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 text-center lg:text-left">
          <div>
            <h3 className="text-hero-text font-semibold mb-3">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-[#646464] hover:text-hero-text text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-[#646464] hover:text-hero-text text-sm transition-colors">
                  Plans
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#646464] hover:text-hero-text text-sm transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-hero-text font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-[#646464] hover:text-hero-text text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/blog/defi-for-beginners-non-technical" className="text-[#646464] hover:text-hero-text text-sm transition-colors">
                  DeFi Guide
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-earn-yield-on-crypto-assets" className="text-[#646464] hover:text-hero-text text-sm transition-colors">
                  Yield Guide
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-hero-text font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-[#646464] text-sm">Terms of Service</span>
              </li>
              <li>
                <span className="text-[#646464] text-sm">Privacy Policy</span>
              </li>
              <li>
                <span className="text-[#646464] text-sm">Risk Disclosures</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-hero-text/10 text-center">
        <div className="text-[#646464] text-sm font-manrope font-normal">
          &copy; 2026 NEXORA. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;


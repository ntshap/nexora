import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentPropsWithoutRef } from "react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type NavLink = {
  url: string;
  title: string;
  subMenuLinks?: NavLink[];
};

type NavbarConfig = {
  logo: ImageProps;
  navLinks: NavLink[];
};

type NavbarProps = ComponentPropsWithoutRef<"section"> & Partial<NavbarConfig>;

const defaultNavbar: NavbarConfig = {
  logo: {
    url: "/",
    src: "/logo.png",
    alt: "NEXORA Logo",
  },
  navLinks: [
    {
      url: "/about",
      title: "About"
    },
    {
      url: "/blog",
      title: "Blog"
    },
    {
      url: "/plans",
      title: "Plans"
    }
  ],
};

const topLineVariants = {
  open: {
    translateY: 8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: -45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const middleLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1 },
  },
  closed: {
    width: "1.5rem",
    transition: { delay: 0.3, duration: 0.2 },
  },
};

const bottomLineVariants = {
  open: {
    translateY: -8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: 45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const Navbar = (props: NavbarProps) => {
  const { logo, navLinks } = { ...defaultNavbar, ...props };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const showNavMenu = navLinks.length > 0;

  const primaryActions = (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#0b061a] shadow-[0_22px_48px_-28px_rgba(98,76,255,0.95)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-26px_rgba(98,76,255,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09091f]"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-text bg-[length:220%_220%] bg-[position:0%_50%] animate-gradient-text" />
        <span className="relative">Launch App</span>
      </Link>
      <div className="rounded-full bg-gradient-to-r from-[#7a63ff]/55 via-[#4f7dff]/45 to-[#36d3ff]/55 p-[1.5px] shadow-[0_18px_40px_-30px_rgba(90,70,255,0.95)]">
        <div className="rounded-full bg-[#080919]/95 px-0.5 py-0.5">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative z-[999] w-full bg-gradient-to-b from-[#07071c]/92 via-[#040414]/70 to-transparent px-4 py-5 sm:px-8">
      <div className="pointer-events-none absolute inset-x-8 bottom-0 hidden h-px bg-gradient-to-r from-transparent via-[#6f5bff]/60 to-transparent sm:block" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src={logo.src}
                alt={logo.alt ?? "NEXORA"}
                width={280}
                height={82}
                className="h-[86px] w-auto"
                priority
              />
            </Link>
            {showNavMenu && (
              <div className="flex items-center gap-4 lg:hidden">
                <button
                  className="flex size-11 flex-col items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#7b64ff]/45 via-[#2a2d55]/70 to-[#0f132d]/90 shadow-[0_20px_40px_-25px_rgba(90,70,255,0.9)] transition-all duration-300 hover:border-white/40 hover:shadow-[0_24px_50px_-25px_rgba(90,70,255,1)]"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Toggle navigation"
                >
                  <motion.span
                    className="my-[3px] h-0.5 w-6 bg-hero-text"
                    animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                    variants={topLineVariants}
                  />
                  <motion.span className="my-[3px] h-0.5 w-6 bg-hero-text" animate={isMobileMenuOpen ? "open" : "closed"} variants={middleLineVariants} />
                  <motion.span
                    className="my-[3px] h-0.5 w-6 bg-hero-text"
                    animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                    variants={bottomLineVariants}
                  />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:justify-end">{primaryActions}</div>
        </div>
        {showNavMenu && (
          <motion.div
            variants={{
              open: { height: "var(--height-open, 100dvh)" },
              close: { height: "var(--height-closed, 0)" },
            }}
            animate={isMobileMenuOpen ? "open" : "close"}
            initial="close"
            exit="close"
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(135deg,rgba(132,108,255,0.4)_0%,rgba(49,200,255,0.25)_45%,rgba(10,12,28,0.85)_100%)] p-[1.5px] backdrop-blur-[22px] lg:flex lg:flex-1 lg:items-center lg:justify-center lg:rounded-full lg:border-0 lg:bg-transparent lg:p-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,132,255,0.35),transparent_65%)] opacity-80" />
            <div className="relative flex flex-col items-center gap-3 rounded-[25px] bg-[#07081a]/92 px-6 py-6 text-center shadow-[0_30px_80px_-45px_rgba(76,58,255,0.85)] sm:px-8 lg:flex-row lg:gap-1.5 lg:px-12 lg:py-3.5 lg:text-left">
              {navLinks.map((navLink) =>
                navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                  <SubMenu key={navLink.title} navLink={navLink} isMobile={isMobile} />
                ) : (
                  <a
                    key={navLink.title}
                    href={navLink.url}
                    className="group relative block w-full overflow-hidden rounded-full px-5 py-2 font-manrope text-sm font-semibold text-hero-text transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c63ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:w-auto lg:px-6 lg:py-2.5 lg:text-base"
                  >
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7a63ff]/55 via-[#5b7dff]/45 to-[#36d3ff]/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    <span className="relative">{navLink.title}</span>
                  </a>
                ),
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const SubMenu = ({ navLink, isMobile }: { navLink: NavLink; isMobile: boolean }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section
      className="relative"
      onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
      onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
    >
      <button
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2 font-manrope text-sm font-semibold text-hero-text transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c63ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:w-auto lg:flex-none lg:justify-start lg:px-6 lg:py-2.5 lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7a63ff]/55 via-[#5b7dff]/45 to-[#36d3ff]/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="relative">{navLink.title}</span>
        <motion.span
          className="relative"
          animate={isDropdownOpen ? "rotated" : "initial"}
          variants={{ rotated: { rotate: 180 }, initial: { rotate: 0 } }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      {isDropdownOpen && (
        <AnimatePresence>
          <motion.nav
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            variants={{
              open: { visibility: "visible", opacity: "var(--opacity-open, 100%)", y: 0 },
              close: { visibility: "hidden", opacity: "var(--opacity-close, 0)", y: "var(--y-close, 0%)" },
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="mt-2 rounded-2xl border border-white/10 bg-[#07081a]/95 p-2 shadow-[0_30px_65px_-35px_rgba(90,70,255,0.85)] backdrop-blur-xl lg:absolute lg:left-1/2 lg:mt-3 lg:z-50 lg:w-56 lg:-translate-x-1/2 lg:p-3 lg:[--y-close:25%]"
          >
            {navLink.subMenuLinks?.map((subMenuLink) => (
              <a
                key={subMenuLink.title}
                href={subMenuLink.url}
                className="group relative block overflow-hidden rounded-xl px-4 py-3 font-manrope text-sm text-hero-text transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c63ff]/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#07081a]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#7a63ff]/45 via-[#5b7dff]/35 to-[#36d3ff]/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="relative">{subMenuLink.title}</span>
              </a>
            ))}
          </motion.nav>
        </AnimatePresence>
      )}
    </section>
  );
};

export { Navbar };

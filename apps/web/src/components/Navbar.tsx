import Image from "next/image";
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
    { title: "Plans", url: "/plans" },
    { title: "Portfolio", url: "/portfolio" },
    { title: "About", url: "/about" },
    {
      title: "Resources",
      url: "#",
      subMenuLinks: [
        { title: "Docs", url: "https://github.com" },
        { title: "Pitch Deck", url: "#deck" },
        { title: "Support", url: "mailto:team@nexora.app" },
      ],
    },
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

  return (
    <section className="z-[999] flex w-full items-center border-b border-hero-text/10 px-6 sm:px-10 lg:px-16" style={{ backgroundColor: "#060612" }}>
      <div className="mx-auto grid size-full max-w-5xl gap-4 py-[22px] px-4 sm:px-6 lg:grid-cols-[0.5fr_1fr_0.5fr] lg:items-center lg:justify-between">
        <div className="flex min-h-16 items-center justify-between md:min-h-18 lg:min-h-full">
          <a href={logo.url} className="flex items-center">
            <Image
              src={logo.src}
              alt={logo.alt ?? "NEXORA"}
              width={200}
              height={56}
              className="h-14 w-auto"
              priority
            />
          </a>
          <div className="flex items-center gap-4 lg:hidden">
            <button className="-mr-2 flex size-12 flex-col items-center justify-center" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
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
        </div>
        <motion.div
          variants={{
            open: { height: "var(--height-open, 100dvh)" },
            close: { height: "var(--height-closed, 0)" },
          }}
          animate={isMobileMenuOpen ? "open" : "close"}
          initial="close"
          exit="close"
          transition={{ duration: 0.4 }}
          className="bg-hero-bg px-6 text-center lg:flex lg:items-center lg:justify-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
        >
          {navLinks.map((navLink) =>
            navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
              <SubMenu key={navLink.title} navLink={navLink} isMobile={isMobile} />
            ) : (
              <a
                key={navLink.title}
                href={navLink.url}
                className="block py-3 font-manrope text-md text-hero-text transition-colors first:pt-7 hover:text-hero-text-muted lg:px-4 lg:py-2 lg:text-base first:lg:pt-2"
              >
                {navLink.title}
              </a>
            ),
          )}
          <div className="block py-6 lg:hidden">
            <ConnectWalletButton />
          </div>
        </motion.div>
        <div className="hidden justify-self-end lg:block">
          <ConnectWalletButton />
        </div>
      </div>
    </section>
  );
};

const SubMenu = ({ navLink, isMobile }: { navLink: NavLink; isMobile: boolean }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section onMouseEnter={() => !isMobile && setIsDropdownOpen(true)} onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}>
      <button
        className="flex w-full items-center justify-center gap-4 py-3 text-center font-manrope text-md text-hero-text transition-colors hover:text-hero-text-muted lg:w-auto lg:flex-none lg:justify-start lg:gap-2 lg:px-4 lg:py-2 lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{navLink.title}</span>
        <motion.span animate={isDropdownOpen ? "rotated" : "initial"} variants={{ rotated: { rotate: 180 }, initial: { rotate: 0 } }} transition={{ duration: 0.3 }}>
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
            transition={{ duration: 0.2 }}
            className="bg-hero-bg lg:absolute lg:z-50 lg:rounded-lg lg:border lg:border-hero-text/10 lg:p-2 lg:shadow-hero lg:[--y-close:25%]"
          >
            {navLink.subMenuLinks?.map((subMenuLink) => (
              <a
                key={subMenuLink.title}
                href={subMenuLink.url}
                className="block py-3 font-manrope text-hero-text transition-colors hover:text-hero-text-muted lg:rounded-md lg:px-4 lg:py-2 lg:text-left lg:hover:bg-hero-text/5"
              >
                {subMenuLink.title}
              </a>
            ))}
          </motion.nav>
        </AnimatePresence>
      )}
    </section>
  );
};

export { Navbar };

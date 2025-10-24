import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plans", label: "Plans" },
  { href: "/portfolio", label: "Portfolio" },
];

const DesktopNav = ({ activePath }: { activePath: string }) => (
  <nav className="hidden sm:flex items-center justify-center gap-6 rounded-full border border-white/10 bg-[#101123]/80 px-6 py-3 backdrop-blur-xl">
    {navItems.map((item) => {
      const isActive = activePath === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            isActive ? "bg-gradient-hero text-hero-text shadow-hero" : "text-hero-text-muted hover:text-hero-text"
          }`}
        >
          {item.label}
        </Link>
      );
    })}
  </nav>
);

const MobileNav = ({ activePath }: { activePath: string }) => (
  <nav className="fixed bottom-4 left-1/2 z-30 w-[90vw] max-w-md -translate-x-1/2 rounded-full border border-white/10 bg-[#101123]/90 px-4 py-3 backdrop-blur-xl sm:hidden">
    <ul className="flex items-center justify-between text-sm font-medium text-hero-text-muted">
      {navItems.map((item) => {
        const isActive = activePath === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`rounded-full px-4 py-2 transition ${
                isActive ? "bg-gradient-hero text-hero-text shadow-hero" : "hover:text-hero-text"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

export const BottomNav = () => {
  const router = useRouter();
  const activePath = router.pathname;

  return (
    <>
      <MobileNav activePath={activePath} />
      <div className="pointer-events-none fixed bottom-6 left-0 hidden w-full justify-center sm:flex">
        <div className="pointer-events-auto">
          <DesktopNav activePath={activePath} />
        </div>
      </div>
    </>
  );
};

const highlights = [
  {
    eyebrow: "Automated Yield Plans",
    title: "Risk-aware strategies tuned for creative income cycles",
    description:
      "We analyse cash flow volatility to suggest vault mixes that soften drought months while compounding during peak seasons.",
  },
  {
    eyebrow: "Fully Transparent",
    title: "Self-custody vaults with realtime reporting",
    description:
      "Every transaction is on-chain and auditable. You get ledger-style receipts, allocation visibility, and alerts for material changes.",
  },
  {
    eyebrow: "Guided Autonomy",
    title: "Unified dashboard with contextual education",
    description:
      "Plans, deposits, and performance tracking live together with bite-sized explainers so you always understand the why behind every move.",
  },
];

const WhyNexoraSection = () => (
  <section className="w-full px-6 sm:px-12 lg:px-[100px] py-16 lg:py-24" style={{ backgroundColor: "#060613" }}>
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-6 text-center lg:text-left">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-[#121330]/80 px-4 py-1 text-xs uppercase tracking-[0.45em] text-hero-text-muted">
          Why creators choose NEXORA
        </span>
        <h2 className="text-[#F5F5FF] text-3xl sm:text-4xl lg:text-[48px] font-plus-jakarta font-extrabold leading-tight lg:leading-[58px]">
          Designed for creative professionals who demand clarity and control
        </h2>
        <p className="text-[#8C8CA6] text-base sm:text-lg lg:text-xl font-manrope leading-relaxed">
          We spent months interviewing musicians, designers, and storytellers. The common thread? Traditional finance tools
          weren&apos;t built for irregular income. NEXORA wraps decentralized finance in an experience that respects your craft.
        </p>
      </div>
      <div className="space-y-4 rounded-[32px] border border-white/5 bg-gradient-to-br from-[#11122a]/90 via-[#10102A]/80 to-[#0B0C1A]/90 p-8 shadow-[0_40px_80px_-60px_rgba(12,15,45,0.9)]">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/5 bg-[#0C0D1D]/70 p-6 transition hover:border-white/10 hover:shadow-[0_25px_60px_-40px_rgba(97,80,255,0.6)]"
          >
            <span className="inline-flex items-center rounded-full bg-[#1C1D32] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8B82FF]">
              {item.eyebrow}
            </span>
            <h3 className="mt-3 text-lg font-manrope font-semibold text-[#E3E3F9]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#9FA0BF] leading-relaxed">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WhyNexoraSection;

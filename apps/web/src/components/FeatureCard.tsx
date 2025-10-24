import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
interface FeatureCardProps {
  title: string;
  description: string;
  image?: string;
  isHighlighted?: boolean;
}

export const FeatureCard = ({
  title,
  description,
  image,
  isHighlighted = false,
}: FeatureCardProps) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-white/5 bg-transparent px-8 py-10 text-left transition-all duration-300 hover:-translate-y-3 hover:border-[#7b6dff]/40 hover:shadow-[0_50px_120px_-60px_rgba(90,80,255,0.45)]">
    <span
      className="pointer-events-none absolute inset-x-8 top-6 h-1 rounded-full bg-gradient-text opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      aria-hidden="true"
    />
    <div className="flex justify-center">
      {image && <Image src={image} alt={title} width={192} height={192} className="h-48 w-48 object-contain" />}
    </div>
    <div className="mt-10 flex flex-col gap-4">
      <h3
        className={`text-2xl font-manrope font-bold leading-tight text-white/25 transition-colors duration-300 group-hover:bg-gradient-text group-hover:bg-clip-text group-hover:text-transparent ${
          isHighlighted ? "bg-gradient-text bg-clip-text text-transparent" : ""
        }`}
      >
        {title}
      </h3>
      <p className="text-base font-manrope leading-relaxed text-white/35 transition-colors duration-300 group-hover:text-hero-text-muted">
        {description}
      </p>
    </div>
    <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <ArrowUpRight className="h-4 w-4 text-white/60" />
    </div>
  </article>
);


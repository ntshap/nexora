import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className = "bg-white/10", ...props }: SkeletonProps) => (
  <div className={`animate-pulse rounded-xl ${className}`} {...props} />
);

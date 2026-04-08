import Link from "next/link";

interface BlogCardProps {
  title: string;
  description: string;
  slug: string;
  category: string;
  readTime: string;
  datePublished: string;
}

const BlogCard = ({
  title,
  description,
  slug,
  category,
  readTime,
  datePublished,
}: BlogCardProps) => {
  const publishedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <article className="group rounded-2xl border border-white/10 bg-[#0f1020] p-6 transition-all duration-300 hover:border-white/20 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-block rounded-full bg-gradient-hero px-3 py-1 text-xs font-semibold">
          {category}
        </span>
        <div className="text-xs text-hero-text-muted">
          {publishedDate} • {readTime}
        </div>
      </div>
      
      <Link href={`/blog/${slug}`} className="block">
        <h2 className="mb-3 text-xl font-plus-jakarta font-bold leading-tight group-hover:text-white transition-colors">
          {title}
        </h2>
        <p className="text-hero-text-muted leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 inline-flex items-center text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
          Read More
          <svg 
            className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
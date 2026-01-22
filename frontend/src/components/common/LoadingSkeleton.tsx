type LoadingSkeletonProps = {
  count?: number;
  className?: string;
};

export default function LoadingSkeleton({ count = 20, className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton-card w-full rounded-3xl border-2 border-transparent min-h-[400px] sm:min-h-[300px]"
        />
      ))}
    </div>
  );
}

"use client";

type ImageSkeletonProps = {
  className?: string;
  rounded?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

export default function ImageSkeleton({ 
  className = "", 
  rounded = true,
  fullWidth = false,
  fullHeight = false,
}: ImageSkeletonProps) {
  return (
    <div
      className={`skeleton-card ${rounded ? "rounded-3xl" : ""} border-2 border-transparent ${fullWidth ? "w-full" : ""} ${fullHeight ? "h-full" : ""} ${className}`}
    />
  );
}

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, useEffect, useState } from "react";

const skeletonVariants = cva(
  "relative overflow-hidden bg-gray-200 rounded-md",
  {
    variants: {
      size: {
        xs: "h-2",
        sm: "h-4",
        md: "h-6",
        lg: "h-8",
        xl: "h-10",
        "2xl": "h-12",
        custom: "",
      },
      animation: {
        pulse: "animate-skeleton-pulse",
        shimmer: "before:animate-shimmer before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        progress: "after:absolute after:top-0 after:left-0 after:h-1 after:bg-blue-500 after:animate-progress",
        combined: "animate-skeleton-pulse before:animate-shimmer before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent after:absolute after:top-0 after:left-0 after:h-1 after:bg-blue-500 after:animate-progress",
        wave: "before:absolute before:inset-0 before:animate-fade-in-out before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        none: "",
      },
      fullWidth: { true: "w-full", false: "" },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      animation: "combined",
      fullWidth: false,
      rounded: "md",
    },
  }
);

export interface AnimatedSkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  delay?: number;
  duration?: number;
  showProgress?: boolean;
  progress?: number;
}

function AnimatedSkeleton({
  className,
  size,
  animation,
  fullWidth,
  rounded,
  width,
  height,
  delay = 0,
  duration,
  showProgress,
  progress,
  style,
  ...props
}: AnimatedSkeletonProps) {
  const [progressValue, setProgressValue] = useState(progress || 0);

  // Simulate loading progress if showProgress is true and no progress is provided
  useEffect(() => {
    if (showProgress && !progress) {
      const interval = setInterval(() => {
        setProgressValue((prev) => {
          const next = prev + Math.random() * 15;
          return next > 100 ? 100 : next;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [showProgress, progress]);

  const animationStyle = {
    ...style,
    width: fullWidth ? '100%' : width,
    height: size === 'custom' ? height : undefined,
    animationDelay: delay ? `${delay}s` : undefined,
    animationDuration: duration ? `${duration}s` : undefined,
  };

  // If showing progress bar but not using the combined animation
  const progressBar = showProgress && animation !== 'combined' && animation !== 'progress' ? (
    <div 
      className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-out" 
      style={{ width: `${progressValue}%` }} 
    />
  ) : null;

  return (
    <div
      className={cn(skeletonVariants({ size, animation, fullWidth, rounded }), className)}
      style={animationStyle}
      {...props}
    >
      {progressBar}
      {props.children}
    </div>
  );
}

export { AnimatedSkeleton };
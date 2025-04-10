import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  showText?: boolean;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(({
  value,
  size = 60,
  strokeWidth = 4,
  className,
  color = "#6366F1",
  showText = true,
  ...props
}, ref) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedValue / 100) * circumference;
  
  return (
    <div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Background circle */}
      <svg width={size} height={size} className="absolute top-0 left-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
      </svg>
      
      {/* Progress circle */}
      <motion.svg
        width={size}
        height={size}
        className="absolute top-0 left-0 -rotate-90"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </motion.svg>
      
      {/* Text percentage */}
      {showText && (
        <span className="text-xs font-semibold absolute" style={{ color }}>
          {normalizedValue}%
        </span>
      )}
    </div>
  );
});

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  centered = false,
  className = ""
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-16 ${className}`}>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

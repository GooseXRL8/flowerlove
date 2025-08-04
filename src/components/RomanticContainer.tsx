import React from 'react';
import { cn } from '@/lib/utils';

interface RomanticContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dreamy' | 'sunset' | 'glass';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

export const RomanticContainer: React.FC<RomanticContainerProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  animate = false
}) => {
  const variantClasses = {
    default: 'bg-card/50 backdrop-blur-sm border border-border/30',
    dreamy: 'gradient-dreamy border border-primary/20',
    sunset: 'gradient-sunset border border-primary-light/30',
    glass: 'glass-romantic border border-primary/20'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  return (
    <div
      className={cn(
        'rounded-2xl shadow-elegant transition-all duration-500',
        variantClasses[variant],
        paddingClasses[padding],
        animate && 'animate-fade-in hover-lift',
        className
      )}
    >
      {children}
    </div>
  );
};
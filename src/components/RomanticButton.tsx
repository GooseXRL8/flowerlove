import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RomanticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'love' | 'dreamy';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  glowEffect?: boolean;
  icon?: React.ReactNode;
}

export const RomanticButton: React.FC<RomanticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  className,
  glowEffect = false,
  icon
}) => {
  const variantClasses = {
    primary: cn(
      'bg-primary text-primary-foreground',
      'hover:bg-primary-dark hover:shadow-romantic',
      'shadow-soft border border-primary/20'
    ),
    secondary: cn(
      'bg-secondary text-secondary-foreground',
      'hover:bg-secondary/80 hover:shadow-soft',
      'border border-secondary/30'
    ),
    ghost: cn(
      'bg-transparent text-foreground',
      'hover:bg-muted/50 hover:text-primary',
      'border border-transparent hover:border-primary/20'
    ),
    love: cn(
      'gradient-romantic text-white',
      'hover:gradient-romantic-intense hover:shadow-glow',
      'border border-primary-light/30'
    ),
    dreamy: cn(
      'gradient-dreamy text-foreground',
      'hover:shadow-elegant border border-primary/10',
      'backdrop-blur-sm'
    )
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative transition-all duration-300 ease-out',
        'transform hover:scale-[1.02] active:scale-[0.98]',
        'font-medium tracking-wide',
        variantClasses[variant],
        sizeClasses[size],
        glowEffect && 'hover-glow',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Shimmer effect */}
      {!disabled && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer" />
        </div>
      )}
      
      <span className="relative flex items-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    </Button>
  );
};
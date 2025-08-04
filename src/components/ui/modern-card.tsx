import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'elevated' | 'romantic' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  glowEffect?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className,
  variant = 'glass',
  size = 'md',
  interactive = false,
  glowEffect = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glowEffect || !cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const card = cardRef.current;
    card.addEventListener('mousemove', handleMouseMove);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [glowEffect]);

  const baseClasses = "relative overflow-hidden transition-all duration-300 ease-out";
  
  const variantClasses = {
    glass: "bg-background/30 backdrop-blur-lg border border-white/10 shadow-xl",
    elevated: "bg-card shadow-2xl border border-border/50",
    romantic: "bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-lg",
    soft: "bg-muted/50 border border-muted-foreground/10 shadow-md"
  };

  const sizeClasses = {
    sm: "p-4 rounded-lg",
    md: "p-6 rounded-xl",
    lg: "p-8 rounded-2xl"
  };

  const interactiveClasses = interactive 
    ? "hover:scale-[1.02] hover:shadow-2xl cursor-pointer transform-gpu" 
    : "";

  const glowClasses = glowEffect 
    ? "before:absolute before:inset-0 before:bg-gradient-radial before:from-primary/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" 
    : "";

  return (
    <div
      ref={cardRef}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        interactiveClasses,
        glowClasses,
        className
      )}
    >
      {glowEffect && (
        <div 
          className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.1), transparent 40%)`
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
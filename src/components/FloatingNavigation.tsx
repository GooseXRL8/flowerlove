import React from 'react';
import { Heart, Settings, Image, Calendar, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const navigationItems = [
  { id: 'main', icon: Heart, label: 'Principal', color: 'text-primary' },
  { id: 'memories', icon: Image, label: 'Memórias', color: 'text-primary-light' },
  { id: 'timeline', icon: Calendar, label: 'Timeline', color: 'text-love-purple' },
  { id: 'share', icon: Instagram, label: 'Compartilhar', color: 'text-love-green' },
  { id: 'settings', icon: Settings, label: 'Configurações', color: 'text-muted-foreground' },
];

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn(
      'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50',
      'glass-romantic rounded-2xl p-2 shadow-romantic',
      'border border-primary/20 backdrop-blur-xl',
      className
    )}>
      <div className="flex items-center gap-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3 rounded-xl',
                'transition-all duration-300 ease-out group',
                'hover:bg-primary/10 active:scale-95',
                isActive && 'bg-primary/20 shadow-romantic'
              )}
              style={{ 
                animationDelay: `${index * 100}ms` 
              }}
            >
              {/* Glow effect for active tab */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg -z-10 animate-pulse-soft" />
              )}
              
              <Icon 
                className={cn(
                  'w-5 h-5 transition-all duration-300',
                  isActive ? 'text-primary scale-110' : item.color,
                  'group-hover:scale-110'
                )} 
              />
              
              {/* Expand text on active */}
              <span className={cn(
                'text-sm font-medium transition-all duration-300 overflow-hidden',
                isActive 
                  ? 'opacity-100 max-w-xs text-primary' 
                  : 'opacity-0 max-w-0 text-muted-foreground',
                'group-hover:opacity-100 group-hover:max-w-xs'
              )}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse-soft" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
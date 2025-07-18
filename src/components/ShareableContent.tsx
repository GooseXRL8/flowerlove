import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ShareableContentProps {
  coupleImageUrl: string;
  timeText: string;
  appTitle: string;
}

const ShareableContent: React.FC<ShareableContentProps> = ({
  coupleImageUrl,
  timeText,
  appTitle
}) => {
  return (
    <div
      id="shareable-content"
      className="relative w-[540px] h-[960px] bg-gradient-to-br from-primary/20 via-secondary/30 to-primary/10 flex flex-col items-center justify-center overflow-hidden"
      style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-16 w-8 h-8 text-primary/20 rotate-12">💐</div>
        <div className="absolute top-40 right-20 w-6 h-6 text-secondary/30 -rotate-12">🌸</div>
        <div className="absolute bottom-32 left-12 w-5 h-5 text-primary/25 rotate-45">💕</div>
        <div className="absolute bottom-48 right-16 w-7 h-7 text-secondary/20 -rotate-45">🌹</div>
        <div className="absolute top-60 left-8 w-4 h-4 text-primary/30 rotate-90">💖</div>
        <div className="absolute bottom-60 right-8 w-6 h-6 text-secondary/25 -rotate-90">🦋</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* App title */}
        <h1 className="font-romantic text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          {appTitle}
        </h1>

        {/* Couple image */}
        <div className="mb-8 relative">
          <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-primary/30 shadow-romantic">
            <AspectRatio ratio={1} className="bg-secondary/20">
              <img 
                src={coupleImageUrl} 
                alt="Couple photo" 
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', coupleImageUrl);
                  // Fallback para imagem padrão se houver erro
                  (e.target as HTMLImageElement).src = "/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png";
                }}
                onLoad={() => {
                  console.log('Imagem carregada com sucesso:', coupleImageUrl);
                }}
              />
            </AspectRatio>
          </div>
          {/* Decorative hearts around the image */}
          <div className="absolute -top-4 -right-4 text-2xl text-primary animate-pulse-soft">💖</div>
          <div className="absolute -bottom-4 -left-4 text-2xl text-secondary animate-pulse-soft">💕</div>
        </div>

        {/* Relationship text */}
        <div className="space-y-4">
          <h2 className="font-romantic text-3xl text-primary/90 font-semibold">
            Estamos juntos há...
          </h2>
          <p className="font-body text-2xl text-foreground font-medium bg-card/80 px-6 py-4 rounded-2xl shadow-soft border border-primary/20">
            {timeText}
          </p>
        </div>

        {/* Romantic quote */}
        <div className="mt-12 max-w-sm">
          <p className="font-romantic text-lg text-primary/70 italic">
            "O amor verdadeiro não tem fim"
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-primary animate-heart-beat">💖</span>
            <span className="text-secondary animate-heart-beat" style={{ animationDelay: '0.5s' }}>💖</span>
            <span className="text-primary animate-heart-beat" style={{ animationDelay: '1s' }}>💖</span>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 text-primary/50">
          <span className="text-sm font-body">💐</span>
          <span className="text-sm font-body italic">Criado com amor</span>
          <span className="text-sm font-body">💐</span>
        </div>
      </div>
    </div>
  );
};

export default ShareableContent;
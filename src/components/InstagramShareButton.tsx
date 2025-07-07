import React from 'react';
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useInstagramShare } from '@/hooks/useInstagramShare';
import ShareableContent from './ShareableContent';

interface InstagramShareButtonProps {
  coupleImageUrl: string;
  timeText: string;
  appTitle: string;
}

const InstagramShareButton: React.FC<InstagramShareButtonProps> = ({
  coupleImageUrl,
  timeText,
  appTitle
}) => {
  const { shareToInstagram, isGenerating } = useInstagramShare();

  return (
    <>
      <Button
        variant="romantic"
        size="lg"
        onClick={shareToInstagram}
        disabled={isGenerating}
        className="w-full gap-3 text-lg py-6 shadow-romantic hover:shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <Share size={24} />
        {isGenerating ? 'Gerando imagem...' : '📤 Compartilhar nos Stories'}
      </Button>

      {/* Hidden shareable content for image generation */}
      <ShareableContent
        coupleImageUrl={coupleImageUrl}
        timeText={timeText}
        appTitle={appTitle}
      />
    </>
  );
};

export default InstagramShareButton;
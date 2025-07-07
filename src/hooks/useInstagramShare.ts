import { useState } from 'react';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

export function useInstagramShare() {
  const [isGenerating, setIsGenerating] = useState(false);

  const detectPlatform = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid;
    
    return { isIOS, isAndroid, isMobile };
  };

  const generateImage = async (): Promise<string | null> => {
    try {
      const element = document.getElementById('shareable-content');
      if (!element) {
        throw new Error('Elemento compartilhável não encontrado');
      }

      // Temporarily show the element
      const originalStyle = element.style.cssText;
      element.style.cssText = 'position: fixed; left: 0; top: 0; z-index: 9999;';

      const canvas = await html2canvas(element, {
        width: 540,
        height: 960,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Hide the element again
      element.style.cssText = originalStyle;

      // Convert to base64
      const dataURL = canvas.toDataURL('image/png', 1.0);
      return dataURL;
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      return null;
    }
  };

  const shareToInstagram = async () => {
    setIsGenerating(true);

    try {
      const { isMobile, isIOS } = detectPlatform();

      if (!isMobile) {
        toast({
          title: "Dispositivo não suportado",
          description: "O compartilhamento para o Instagram está disponível apenas em dispositivos móveis.",
          variant: "destructive"
        });
        return;
      }

      const imageDataURL = await generateImage();
      if (!imageDataURL) {
        throw new Error('Não foi possível gerar a imagem');
      }

      // Convert base64 to blob
      const base64Data = imageDataURL.split(',')[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: 'image/png' });

      // Try to share using Web Share API first (more reliable)
      if (navigator.share) {
        const file = new File([blob], 'love-story.png', { type: 'image/png' });
        
        try {
          await navigator.share({
            title: 'Nossa História de Amor',
            text: 'Veja nossa jornada de amor! 💕',
            files: [file]
          });
          
          toast({
            title: "Sucesso!",
            description: "Imagem pronta para compartilhar! 💖"
          });
          return;
        } catch (shareError) {
          // If Web Share API fails, continue to deep link method
          console.log('Web Share API failed, trying deep link...');
        }
      }

      // Fallback: Create deep link for Instagram Stories
      const instagramUrl = `instagram-stories://share?background_image=${encodeURIComponent(imageDataURL)}`;
      
      // Try to open Instagram
      window.location.href = instagramUrl;

      // Show success message
      toast({
        title: "Abrindo Instagram...",
        description: "Se o Instagram não abrir automaticamente, copie a imagem e cole manualmente nos Stories! 💕"
      });

      // Fallback: Download the image
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'nossa-historia-de-amor.png';
        link.href = imageDataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1000);

    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível gerar o conteúdo para compartilhamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    shareToInstagram,
    isGenerating
  };
}
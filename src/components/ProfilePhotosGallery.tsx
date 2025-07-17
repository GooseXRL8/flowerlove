import React, { useState } from 'react';
import { useProfilePhotos } from '@/hooks/useProfilePhotos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfilePhotosGalleryProps {
  userId: string;
  className?: string;
}

const ProfilePhotosGallery: React.FC<ProfilePhotosGalleryProps> = ({ 
  userId, 
  className 
}) => {
  const { photos, loading, count, maxPhotos, canAddMore, addPhoto, deletePhoto } = useProfilePhotos(userId);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim()) return;
    
    setIsAdding(true);
    const success = await addPhoto(newPhotoUrl.trim());
    if (success) {
      setNewPhotoUrl('');
    }
    setIsAdding(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    await deletePhoto(photoId);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Galeria de Fotos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando fotos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Galeria de Fotos ({count}/{maxPhotos})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new photo */}
        {canAddMore && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Cole a URL da foto aqui..."
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhoto()}
              />
              <Button 
                onClick={handleAddPhoto}
                disabled={!newPhotoUrl.trim() || isAdding}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Máximo de {maxPhotos} fotos por perfil
            </p>
          </div>
        )}

        {/* Photos grid */}
        {photos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma foto adicionada ainda</p>
            {canAddMore && (
              <p className="text-sm">Adicione uma URL de foto acima</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={photo.url}
                    alt="Foto do perfil"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                      target.alt = 'Erro ao carregar imagem';
                    }}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className={cn(
                    "absolute top-1 right-1 h-6 w-6 p-0",
                    "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePhotosGallery;
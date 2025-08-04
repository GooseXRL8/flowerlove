
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import HomePage from "@/components/HomePage";
import ProfilePhotosGallery from "@/components/ProfilePhotosGallery";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CoupleProfile } from '@/types/auth';

const ProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { currentUser, profiles, users, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!profileId) {
      toast({
        title: "Erro",
        description: "ID do perfil não fornecido",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    const foundProfile = profiles.find(p => p.id === profileId);
    
    if (!foundProfile) {
      toast({
        title: "Erro",
        description: "Perfil não encontrado",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    // Check if user has access to this profile
    const hasAccess = currentUser?.isAdmin || currentUser?.assignedProfileId === profileId;
    
    if (!hasAccess) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar este perfil",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    setProfile(foundProfile);
    setLoading(false);
  }, [profileId, profiles, currentUser, navigate, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dreamy">
      <div className="fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <HomePage />
    </div>
  );
};

export default ProfilePage;

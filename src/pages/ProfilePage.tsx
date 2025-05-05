
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import HomePage from "@/components/HomePage";
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
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      {profile && currentUser?.isAdmin && (
        <div className="fixed top-4 right-4 z-50 bg-card p-2 rounded-md shadow-md border">
          <div className="text-xs text-muted-foreground mb-1">Credenciais do perfil:</div>
          {profile.assignedUserId ? (
            <div className="text-sm font-mono">
              {users.find(u => u.id === profile.assignedUserId)?.username} / 
              {users.find(u => u.id === profile.assignedUserId)?.password}
            </div>
          ) : (
            <div className="text-sm">Nenhum usuário associado</div>
          )}
        </div>
      )}
      
      <HomePage />
    </>
  );
};

export default ProfilePage;

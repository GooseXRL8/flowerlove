
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

export const ProfilesTab = () => {
  const { profiles, createProfile, deleteProfile, users } = useAuth();
  const [newProfileName, setNewProfileName] = useState('');
  const navigate = useNavigate();
  
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite um nome para o perfil",
        variant: "destructive"
      });
      return;
    }
    
    try {
      createProfile(newProfileName);
      setNewProfileName('');
      toast({
        title: "Perfil criado",
        description: `Perfil "${newProfileName}" foi criado com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o perfil",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteProfile = (id: string) => {
    try {
      deleteProfile(id);
      toast({
        title: "Perfil excluído",
        description: "O perfil foi excluído com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o perfil",
        variant: "destructive"
      });
    }
  };
  
  const handleViewProfile = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="space-y-4">
      <GlowCard glowColor="blue" customSize className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Criar Novo Perfil</h3>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Nome do perfil" 
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <Button onClick={handleCreateProfile}>
            <Plus className="mr-2 h-4 w-4" />
            Criar
          </Button>
        </div>
      </GlowCard>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => {
          const assignedUser = users.find(u => u.assignedProfileId === profile.id);
          
          return (
            <GlowCard key={profile.id} glowColor="green" customSize className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Criado em: {profile.startDate.toLocaleDateString()}
                </p>
                {assignedUser && (
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      Usuário: {assignedUser.username}
                    </p>
                    <p className="text-xs text-green-600">
                      Senha: {assignedUser.password}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" onClick={() => handleViewProfile(profile.id)}>
                  Visualizar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir perfil</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o perfil "{profile.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProfile(profile.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
};

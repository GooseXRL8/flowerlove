
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const UserDashboard = () => {
  const { currentUser, logout, profiles } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Find the profile assigned to this user
  const assignedProfile = currentUser?.assignedProfileId 
    ? profiles.find(p => p.id === currentUser.assignedProfileId)
    : null;
  
  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bem-vindo, {currentUser?.username}</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </header>
      
      <div className="max-w-md mx-auto text-center space-y-6">
        {assignedProfile ? (
          <>
            <h2 className="text-xl font-medium">Seu perfil de relacionamento:</h2>
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{assignedProfile.name}</h3>
              <p className="text-muted-foreground mb-4">
                Criado em: {assignedProfile.startDate.toLocaleDateString()}
              </p>
              <Button onClick={() => navigate(`/profile/${assignedProfile.id}`)}>
                Acessar Perfil
              </Button>
            </div>
          </>
        ) : (
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-medium mb-2">Nenhum perfil encontrado</h3>
            <p className="text-muted-foreground">
              Você ainda não possui um perfil de relacionamento associado.
              Por favor, entre em contato com o administrador.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;


import React from 'react';
import { useAuth } from '@/hooks/useAuth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, User } from "lucide-react";
import { ProfilesTab } from '@/components/admin/ProfilesTab';
import { UsersTab } from '@/components/admin/UsersTab';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel de Administração</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </header>
      
      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profiles">
            <Users className="mr-2 h-4 w-4" />
            Perfis de Casal
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles">
          <ProfilesTab />
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

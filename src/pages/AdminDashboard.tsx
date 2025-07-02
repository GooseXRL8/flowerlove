
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
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Romantic background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-20 w-6 h-6 text-secondary/20 animate-float">🌹</div>
        <div className="absolute top-40 right-24 w-5 h-5 text-secondary/25 animate-pulse-soft">💕</div>
        <div className="absolute bottom-32 left-16 w-7 h-7 text-secondary/30 animate-heart-beat">🌸</div>
      </div>
      
      <header className="flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-4xl font-romantic font-bold text-primary mb-2 animate-fade-in">
            💖 Painel de Administração
          </h1>
          <p className="text-muted-foreground font-body">Gerencie perfis de casais e usuários</p>
        </div>
        <Button variant="outline" size="lg" onClick={handleLogout} className="shadow-soft hover:shadow-card">
          <LogOut className="mr-2 h-5 w-5" />
          Sair
        </Button>
      </header>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-secondary/30 shadow-soft">
            <TabsTrigger value="profiles" className="h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="mr-2 h-5 w-5" />
              Perfis de Casal
            </TabsTrigger>
            <TabsTrigger value="users" className="h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="mr-2 h-5 w-5" />
              Usuários
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profiles" className="animate-fade-in">
            <ProfilesTab />
          </TabsContent>
          
          <TabsContent value="users" className="animate-fade-in">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

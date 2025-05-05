
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LogOut, Plus, Trash2, User, Users } from "lucide-react";

const AdminDashboard = () => {
  const { currentUser, logout, profiles, createProfile, deleteProfile, createUser, assignUserToProfile, users } = useAuth();
  const [newProfileName, setNewProfileName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
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
  
  const handleCreateUser = async () => {
    if (!newUsername.trim() || !selectedProfileId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Wait for the user to be created and then get the result
      const newUser = await createUser(newUsername, false, selectedProfileId);
      setNewUsername('');
      setSelectedProfileId(null);
      
      await assignUserToProfile(newUser.id, selectedProfileId);
      
      toast({
        title: "Usuário criado",
        description: `Usuário "${newUsername}" criado com senha: ${newUser.password}`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o usuário",
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
        
        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Criar Novo Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => {
              const assignedUser = users.find(u => u.id === profile.assignedUserId);
              
              return (
                <Card key={profile.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{profile.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Criado em: {profile.startDate.toLocaleDateString()}
                    </p>
                    {assignedUser && (
                      <p className="text-sm font-medium mt-2">
                        Usuário: {assignedUser.username}
                        <br />
                        Senha: {assignedUser.password}
                      </p>
                    )}
                  </CardContent>
                  <div className="flex bg-muted/20 p-2 pt-0 gap-2 justify-end">
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
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome de usuário</label>
                  <Input 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Perfil para associar</label>
                  <select 
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={selectedProfileId || ''}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                  >
                    <option value="">Selecione um perfil</option>
                    {profiles
                      .filter(profile => !profile.assignedUserId)
                      .map(profile => (
                        <option key={profile.id} value={profile.id}>
                          {profile.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <Button onClick={handleCreateUser}>
                  Criar Usuário
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4">
            {users
              .filter(user => !user.isAdmin)
              .map(user => {
                const assignedProfile = profiles.find(p => p.id === user.assignedProfileId);
                
                return (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          <p className="text-sm text-muted-foreground">
                            Senha: {user.password}
                          </p>
                          {assignedProfile && (
                            <p className="text-sm">
                              Perfil: {assignedProfile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

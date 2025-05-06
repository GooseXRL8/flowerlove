
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export const UsersTab = () => {
  const { users, profiles, createUser, assignUserToProfile, deleteUser } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

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
      // Create the user
      const newUser = await createUser(newUsername, false, selectedProfileId);
      
      // Assign the user to the profile
      await assignUserToProfile(newUser.id, selectedProfileId);
      
      // Reset form
      setNewUsername('');
      setSelectedProfileId(null);
      
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

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o usuário "{user.username}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })
        }
      </div>
    </div>
  );
};

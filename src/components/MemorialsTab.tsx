
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, BookOpen, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface MemorialsTabProps {
  startDate: Date;
}

interface Memory {
  id: string;
  title: string;
  description: string;
  date: Date;
  isFavorite?: boolean;
}

interface MemoryFormValues {
  title: string;
  description: string;
  date: string;
}

const MemorialsTab: React.FC<MemorialsTabProps> = ({ startDate }) => {
  // Calculate how many days since the relationship started
  const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  // State for memories
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      title: "Primeiro Encontro",
      description: "O dia em que nos conhecemos pessoalmente pela primeira vez.",
      date: new Date(startDate.getTime()),
      isFavorite: false,
    },
    {
      id: '2',
      title: "Primeira Viagem Juntos",
      description: "Nossa primeira aventura viajando juntos.",
      date: new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days after start
      isFavorite: false,
    }
  ]);

  // State for selected memory for reminder dialog
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form for adding new memories
  const form = useForm<MemoryFormValues>({
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  // For responsive drawer/dialog
  const isMobile = useIsMobile();

  // Function to handle "Relembrar" button click
  const handleRememberClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  // Function to handle adding new memory
  const handleAddMemory = (data: MemoryFormValues) => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      isFavorite: false,
    };
    
    setMemories([...memories, newMemory]);
    form.reset();
    
    toast({
      title: "Memória adicionada",
      description: `"${data.title}" foi adicionada às suas memórias.`,
    });
  };
  
  // Function to toggle favorite status of a memory
  const handleToggleFavorite = (memory: Memory) => {
    const updatedMemories = memories.map((item) => 
      item.id === memory.id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    
    setMemories(updatedMemories);
    
    // Find the updated memory to show appropriate toast message
    const updatedMemory = updatedMemories.find(item => item.id === memory.id);
    if (updatedMemory) {
      toast({
        title: updatedMemory.isFavorite ? "Memória favoritada" : "Memória desfavoritada",
        description: `"${updatedMemory.title}" foi ${updatedMemory.isFavorite ? 'adicionada aos' : 'removida dos'} favoritos.`,
      });
    }
  };
  
  // Function to delete a memory
  const handleDeleteMemory = () => {
    if (!selectedMemory) return;
    
    const filteredMemories = memories.filter(memory => memory.id !== selectedMemory.id);
    setMemories(filteredMemories);
    
    toast({
      title: "Memória excluída",
      description: `"${selectedMemory.title}" foi removida das suas memórias.`,
    });
    
    setSelectedMemory(null);
    setIsDeleteDialogOpen(false);
  };

  // Add Memory Form Content
  const AddMemoryFormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddMemory)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nome da memória" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva este momento especial..." rows={3} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Salvar memória</Button>
      </form>
    </Form>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Nossas Memórias
        </h2>
        <p className="text-muted-foreground text-sm">
          {daysSinceStart} dias de amor e momentos especiais
        </p>
      </div>

      {memories.map((memory) => (
        <Card key={memory.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>{memory.title}</CardTitle>
            <CardDescription>
              {memory.date.toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{memory.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted/20">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary"
                  onClick={() => handleRememberClick(memory)}
                >
                  <BookOpen size={16} className="mr-2" />
                  Relembrar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedMemory?.title}</DialogTitle>
                  <DialogDescription>
                    {selectedMemory?.date.toLocaleDateString('pt-BR', { 
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">Detalhes desta memória:</p>
                  <p>{selectedMemory?.description}</p>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash size={16} />
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline">Fechar</Button>
                    <Button 
                      variant={selectedMemory?.isFavorite ? "secondary" : "ghost"} 
                      className={`flex items-center gap-2 ${selectedMemory?.isFavorite ? "bg-pink-100 text-pink-700 hover:bg-pink-200" : ""}`}
                      onClick={() => selectedMemory && handleToggleFavorite(selectedMemory)}
                    >
                      <Heart size={16} fill={selectedMemory?.isFavorite ? "currentColor" : "none"} />
                      <span>{selectedMemory?.isFavorite ? "Favoritado" : "Favoritar"}</span>
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
      
      <div className="text-center pt-4">
        {!isMobile ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus size={16} />
                Adicionar memória
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar nova memória</DialogTitle>
                <DialogDescription>
                  Registre um momento especial que vocês compartilharam juntos.
                </DialogDescription>
              </DialogHeader>
              <AddMemoryFormContent />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus size={16} />
                Adicionar memória
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Adicionar nova memória</DrawerTitle>
                <DrawerDescription>
                  Registre um momento especial que vocês compartilharam juntos.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <AddMemoryFormContent />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      
      {/* Alert Dialog para confirmar exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Esta memória será permanentemente excluída
              dos seus registros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMemory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemorialsTab;

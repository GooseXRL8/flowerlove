
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";

interface MemorialsTabProps {
  startDate: Date;
}

interface Memory {
  id: string;
  title: string;
  description: string;
  date: Date;
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
    },
    {
      id: '2',
      title: "Primeira Viagem Juntos",
      description: "Nossa primeira aventura viajando juntos.",
      date: new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days after start
    }
  ]);

  // State for selected memory for reminder dialog
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  // Form for adding new memories
  const form = useForm<MemoryFormValues>({
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  // For responsive drawer/dialog
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
    };
    
    setMemories([...memories, newMemory]);
    form.reset();
    
    toast({
      title: "Memória adicionada",
      description: `"${data.title}" foi adicionada às suas memórias.`,
    });
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
                  <DialogTitle>{memory.title}</DialogTitle>
                  <DialogDescription>
                    {memory.date.toLocaleDateString('pt-BR', { 
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">Detalhes desta memória:</p>
                  <p>{memory.description}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Fechar</Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Heart size={16} />
                    <span>Favoritar</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
      
      <div className="text-center pt-4">
        {isDesktop ? (
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
    </div>
  );
};

export default MemorialsTab;

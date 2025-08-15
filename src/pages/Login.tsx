
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlowCard } from "@/components/ui/spotlight-card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // If already logged in, redirect to appropriate page
    if (currentUser && !loading) {
      navigate(currentUser.isAdmin ? '/admin' : '/dashboard');
    }
  }, [currentUser, navigate, loading]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Login attempt with:", username, password);
    
    try {
      setIsLoggingIn(true);
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso!",
        });
        
        // Let the useEffect handle redirection
      } else {
        console.log("Login failed");
        toast({
          title: "Falha no login",
          description: "Nome de usuário ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <p>Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Romantic background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-8 h-8 text-secondary/20 animate-float">🌹</div>
        <div className="absolute top-32 right-20 w-6 h-6 text-secondary/30 animate-pulse-soft">💕</div>
        <div className="absolute bottom-40 left-12 w-7 h-7 text-secondary/25 animate-heart-beat">🌸</div>
        <div className="absolute bottom-20 right-16 w-5 h-5 text-secondary/30 animate-float">💖</div>
      </div>
      
      <GlowCard glowColor="purple" customSize className="w-full max-w-md shadow-romantic hover:shadow-lg transition-all duration-500 animate-fade-in p-8">
        <div className="text-center pb-8">
          <div className="mb-4">
            <div className="text-6xl animate-heart-beat mb-4">💕</div>
            <h1 className="text-4xl font-romantic font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              FlowerLove
            </h1>
          </div>
          <p className="text-base font-body text-muted-foreground">
            Entre na sua conta e acompanhe sua jornada de amor
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Nome de usuário
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoggingIn}
                required
                className="h-12 rounded-lg border-2 border-border focus:border-primary/50 transition-all duration-300"
                placeholder="Digite seu nome de usuário"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
                required
                className="h-12 rounded-lg border-2 border-border focus:border-primary/50 transition-all duration-300"
                placeholder="Digite sua senha"
              />
            </div>
          </div>
          
          <div className="pt-6">
            <Button 
              type="submit" 
              variant="romantic"
              className="w-full h-12 text-base font-medium" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>💖</span>
                  Entrar
                  <span>💖</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </GlowCard>
    </div>
  );
};

export default Login;


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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register, currentUser, loading } = useAuth();
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
    
    if (isSignUp) {
      if (password !== confirmPassword) {
        toast({ title: "Erro", description: "As senhas não coincidem", variant: "destructive" });
        return;
      }
      if (password.length < 4) {
        toast({ title: "Erro", description: "A senha deve ter pelo menos 4 caracteres", variant: "destructive" });
        return;
      }
      try {
        setIsLoggingIn(true);
        const success = await register(username, password);
        if (success) {
          toast({ title: "Conta criada!", description: "Bem-vindo ao FlowerLove! 💕" });
        } else {
          toast({ title: "Erro", description: "Nome de usuário já existe", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Erro", description: "Erro ao criar conta", variant: "destructive" });
      } finally {
        setIsLoggingIn(false);
      }
      return;
    }

    try {
      setIsLoggingIn(true);
      const success = await login(username, password);
      if (success) {
        toast({ title: "Login bem-sucedido", description: "Você foi autenticado com sucesso!" });
      } else {
        toast({ title: "Falha no login", description: "Nome de usuário ou senha incorretos", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro no login", description: "Ocorreu um erro ao tentar fazer login", variant: "destructive" });
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
              {isSignUp ? 'Criar Conta' : 'FlowerLove'}
            </h1>
          </div>
          <p className="text-base font-body text-muted-foreground">
            {isSignUp ? 'Crie sua conta e comece sua jornada de amor' : 'Entre na sua conta e acompanhe sua jornada de amor'}
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
            {isSignUp && (
              <div className="space-y-3">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar Senha
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoggingIn}
                  required
                  className="h-12 rounded-lg border-2 border-border focus:border-primary/50 transition-all duration-300"
                  placeholder="Confirme sua senha"
                />
              </div>
            )}
          </div>
          
          <div className="pt-6 space-y-3">
            <Button 
              type="submit" 
              variant="romantic"
              className="w-full h-12 text-base font-medium" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>💖</span>
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                  <span>💖</span>
                </div>
              )}
            </Button>
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setConfirmPassword(''); }}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </form>
      </GlowCard>
    </div>
  );
};

export default Login;


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TimeCounter from './TimeCounter';
import RoseAnimation from './RoseAnimation';
import ThemeSwitcher from './ThemeSwitcher';
import DatePicker from './DatePicker';
import CoupleNameForm from './CoupleNameForm';
import { toast } from "@/components/ui/use-toast";
import Layout from './Layout';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Theme = 'default' | 'purple' | 'green';

const HomePage: React.FC = () => {
  // State for theme
  const [theme, setTheme] = useState<Theme>('default');
  
  // Fixed relationship start date: September 7, 2024
  const startDate = new Date(2024, 8, 7); // Note: Month is 0-indexed, so 8 = September
  
  // State for duration
  const [duration, setDuration] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0
  });

  // State for couple names
  const [coupleNames, setCoupleNames] = useState<{ partner1: string; partner2: string } | null>(() => {
    const savedNames = localStorage.getItem('coupleNames');
    return savedNames ? JSON.parse(savedNames) : null;
  });
  
  // Effect to apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    document.body.classList.remove('theme-purple', 'theme-green');
    if (theme === 'purple') document.body.classList.add('theme-purple');
    if (theme === 'green') document.body.classList.add('theme-green');
  }, [theme]);
  
  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${getThemeName(newTheme)}.`,
    });
  };

  // Handle couple names change
  const handleNamesSet = (names: { partner1: string; partner2: string }) => {
    setCoupleNames(names);
    localStorage.setItem('coupleNames', JSON.stringify(names));
  };
  
  // Random love quotes
  const loveQuotes = [
    "Amor não é olhar um para o outro, mas olhar juntos na mesma direção.",
    "O amor é a força mais poderosa do universo.",
    "Cada dia com você é um dia mais feliz que o anterior.",
    "Amar não é encontrar alguém perfeito, mas ver perfeitamente as imperfeições.",
    "O amor não se vê com os olhos mas com o coração."
  ];
  
  const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
  
  return (
    <Layout>
      <div className="w-full max-w-3xl mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Nosso Amor
        </h1>
        <p className="text-muted-foreground">Celebre cada momento do seu relacionamento</p>
        
        <div className="mt-6 italic text-sm text-center px-6">
          "{randomQuote}"
        </div>
      </div>
      
      <div className="w-full max-w-3xl space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary">Contador de Amor</h2>
            <p className="text-muted-foreground mb-4">
              Acompanhe precisamente há quanto tempo vocês estão juntos, celebrando cada segundo desse amor especial.
            </p>
            <Link to="/contador">
              <Button variant="outline" className="group">
                Ver contador completo 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="backdrop-blur-sm bg-background/50 p-4 rounded-lg">
            <TimeCounter 
              startDate={startDate} 
              onTimeUpdate={setDuration}
              coupleNames={coupleNames} 
            />
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 backdrop-blur-sm bg-background/50 p-4 rounded-lg">
            <div className="flex justify-center">
              <RoseAnimation relationshipDuration={duration} />
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold mb-4 text-primary">Rosa do Amor</h2>
            <p className="text-muted-foreground mb-4">
              Observe uma rosa virtual que floresce e cresce junto com o seu relacionamento, simbolizando o amor que cultivam juntos.
            </p>
            <Link to="/rosa">
              <Button variant="outline" className="group">
                Ver rosa completa 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
        
        <section className="bg-primary/5 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Personalize sua Experiência</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="text-lg font-medium mb-3">Data do Relacionamento</h3>
              <Card>
                <CardContent className="pt-6">
                  <DatePicker date={startDate} onDateChange={() => {}} />
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    Relacionamento iniciado em 7 de setembro de 2024
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Nomes do Casal</h3>
              <CoupleNameForm 
                onNamesSet={handleNamesSet} 
                initialNames={coupleNames} 
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Escolha um Tema</h3>
            <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

function getThemeName(theme: Theme): string {
  switch (theme) {
    case 'default': return 'Rosa';
    case 'purple': return 'Roxo';
    case 'green': return 'Verde';
    default: return 'Padrão';
  }
}

export default HomePage;

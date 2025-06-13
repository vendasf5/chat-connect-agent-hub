
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { Palette, Check } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: 'default',
    name: 'Azul Corporativo',
    description: 'Tema padrão com tons de azul profissional',
    colors: {
      primary: '222.2 47.4% 11.2%',
      secondary: '210 40% 96.1%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
    },
    preview: { primary: '#1e293b', secondary: '#f1f5f9', accent: '#3b82f6' }
  },
  {
    id: 'emerald',
    name: 'Verde Esmeralda',
    description: 'Tons de verde moderno e elegante',
    colors: {
      primary: '158 64% 52%',
      secondary: '152 76% 97%',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
    },
    preview: { primary: '#10b981', secondary: '#ecfdf5', accent: '#059669' }
  },
  {
    id: 'purple',
    name: 'Roxo Moderno',
    description: 'Elegância com tons de roxo vibrante',
    colors: {
      primary: '262 83% 58%',
      secondary: '270 95% 98%',
      background: '0 0% 100%',
      foreground: '224 71% 4%',
    },
    preview: { primary: '#8b5cf6', secondary: '#faf5ff', accent: '#7c3aed' }
  },
  {
    id: 'orange',
    name: 'Laranja Vibrante',
    description: 'Energia com tons quentes de laranja',
    colors: {
      primary: '25 95% 53%',
      secondary: '48 96% 89%',
      background: '0 0% 100%',
      foreground: '20 14% 4%',
    },
    preview: { primary: '#f97316', secondary: '#fef3c7', accent: '#ea580c' }
  },
  {
    id: 'rose',
    name: 'Rosa Elegante',
    description: 'Sofisticação com tons de rosa',
    colors: {
      primary: '330 81% 60%',
      secondary: '326 100% 97%',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
    },
    preview: { primary: '#e11d48', secondary: '#fdf2f8', accent: '#be185d' }
  },
  {
    id: 'dark',
    name: 'Modo Escuro',
    description: 'Interface escura moderna e confortável',
    colors: {
      primary: '210 40% 98%',
      secondary: '217.2 32.6% 17.5%',
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
    },
    preview: { primary: '#f8fafc', secondary: '#334155', accent: '#0f172a' }
  }
];

const ThemeSelector = () => {
  const { themeSettings, updateTheme } = useTheme();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(themeSettings.theme_name || 'default');

  const handleThemeSelect = async (theme: ThemeOption) => {
    setSelectedTheme(theme.id);
    
    await updateTheme({
      primary_color: theme.colors.primary,
      secondary_color: theme.colors.secondary,
      background_color: theme.colors.background,
      foreground_color: theme.colors.foreground,
      theme_name: theme.name,
    });

    toast({
      title: 'Tema aplicado',
      description: `O tema "${theme.name}" foi aplicado com sucesso!`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Temas de Cores</span>
        </CardTitle>
        <CardDescription>
          Escolha um tema que combine com sua marca e preferência visual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeOptions.map((theme) => (
            <div
              key={theme.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTheme === theme.id 
                  ? 'border-primary shadow-lg' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeSelect(theme)}
            >
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="h-6 w-6 p-0 rounded-full">
                    <Check className="w-3 h-3" />
                  </Badge>
                </div>
              )}
              
              <div className="flex space-x-2 mb-3">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.preview.primary }}
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.preview.secondary }}
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.preview.accent }}
                />
              </div>
              
              <h3 className="font-semibold text-sm mb-1">{theme.name}</h3>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Tema Atual</h4>
          <p className="text-sm text-muted-foreground">
            {themeOptions.find(t => t.id === selectedTheme)?.name || 'Tema Personalizado'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;

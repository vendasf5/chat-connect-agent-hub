
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { Palette, Check, Sparkles } from 'lucide-react';

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
    background: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: 'corporate-blue',
    name: 'Azul Corporativo',
    description: 'Tema profissional com tons de azul elegante',
    colors: {
      primary: '222.2 47.4% 11.2%',
      secondary: '210 40% 96.1%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
    },
    preview: { 
      primary: '#1e293b', 
      secondary: '#f1f5f9', 
      accent: '#3b82f6',
      background: '#ffffff'
    }
  },
  {
    id: 'emerald-fresh',
    name: 'Verde Esmeralda',
    description: 'Tons de verde moderno e revigorante',
    colors: {
      primary: '158 64% 52%',
      secondary: '152 76% 97%',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
    },
    preview: { 
      primary: '#10b981', 
      secondary: '#ecfdf5', 
      accent: '#059669',
      background: '#ffffff'
    }
  },
  {
    id: 'purple-modern',
    name: 'Roxo Moderno',
    description: 'Elegância contemporânea com roxo vibrante',
    colors: {
      primary: '262 83% 58%',
      secondary: '270 95% 98%',
      background: '0 0% 100%',
      foreground: '224 71% 4%',
    },
    preview: { 
      primary: '#8b5cf6', 
      secondary: '#faf5ff', 
      accent: '#7c3aed',
      background: '#ffffff'
    }
  },
  {
    id: 'orange-energy',
    name: 'Laranja Energético',
    description: 'Energia e vitalidade com tons quentes',
    colors: {
      primary: '25 95% 53%',
      secondary: '48 96% 89%',
      background: '0 0% 100%',
      foreground: '20 14% 4%',
    },
    preview: { 
      primary: '#f97316', 
      secondary: '#fef3c7', 
      accent: '#ea580c',
      background: '#ffffff'
    }
  },
  {
    id: 'rose-elegant',
    name: 'Rosa Elegante',
    description: 'Sofisticação feminina com tons de rosa',
    colors: {
      primary: '330 81% 60%',
      secondary: '326 100% 97%',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
    },
    preview: { 
      primary: '#e11d48', 
      secondary: '#fdf2f8', 
      accent: '#be185d',
      background: '#ffffff'
    }
  },
  {
    id: 'dark-professional',
    name: 'Modo Escuro Profissional',
    description: 'Interface escura moderna e confortável',
    colors: {
      primary: '210 40% 98%',
      secondary: '217.2 32.6% 17.5%',
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
    },
    preview: { 
      primary: '#f8fafc', 
      secondary: '#334155', 
      accent: '#0f172a',
      background: '#0f172a'
    }
  }
];

const ThemeSelector = () => {
  const { themeSettings, updateTheme } = useTheme();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(
    themeOptions.find(t => t.name === themeSettings.theme_name)?.id || 'corporate-blue'
  );

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
      title: 'Tema aplicado com sucesso!',
      description: `O tema "${theme.name}" foi aplicado e salvo automaticamente.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
            <Palette className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Personalização de Temas</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Escolha um tema que reflita a personalidade da sua marca e proporcione a melhor experiência visual
        </p>
      </div>

      {/* Tema Atual */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>Tema Atual</span>
          </CardTitle>
          <CardDescription>
            Tema aplicado atualmente em todo o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {themeOptions.find(t => t.id === selectedTheme)?.preview && (
                  <>
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: themeOptions.find(t => t.id === selectedTheme)?.preview.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: themeOptions.find(t => t.id === selectedTheme)?.preview.secondary }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: themeOptions.find(t => t.id === selectedTheme)?.preview.accent }}
                    />
                  </>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {themeOptions.find(t => t.id === selectedTheme)?.name || 'Tema Personalizado'}
                </h3>
                <p className="text-muted-foreground">
                  {themeOptions.find(t => t.id === selectedTheme)?.description}
                </p>
              </div>
            </div>
            <Badge variant="default" className="px-4 py-2">
              Ativo
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Temas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeOptions.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              selectedTheme === theme.id 
                ? 'ring-2 ring-primary shadow-xl scale-105' 
                : 'hover:ring-1 hover:ring-primary/50'
            }`}
            style={{
              background: theme.id === 'dark-professional' 
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            }}
            onClick={() => handleThemeSelect(theme)}
          >
            <CardHeader className="relative">
              {selectedTheme === theme.id && (
                <div className="absolute top-4 right-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: theme.preview.primary }}
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: theme.preview.secondary }}
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: theme.preview.accent }}
                />
              </div>
              
              <CardTitle className={`text-lg ${theme.id === 'dark-professional' ? 'text-white' : ''}`}>
                {theme.name}
              </CardTitle>
              <CardDescription className={theme.id === 'dark-professional' ? 'text-gray-300' : ''}>
                {theme.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Preview da UI */}
              <div className={`p-3 rounded-lg border ${theme.id === 'dark-professional' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="space-y-2">
                  <div 
                    className="h-2 rounded"
                    style={{ backgroundColor: theme.preview.primary, width: '80%' }}
                  />
                  <div 
                    className="h-2 rounded"
                    style={{ backgroundColor: theme.preview.secondary, width: '60%' }}
                  />
                  <div 
                    className="h-2 rounded"
                    style={{ backgroundColor: theme.preview.accent, width: '40%' }}
                  />
                </div>
              </div>
              
              <Button 
                variant={selectedTheme === theme.id ? "default" : "outline"}
                className="w-full mt-4"
                size="sm"
              >
                {selectedTheme === theme.id ? 'Tema Ativo' : 'Aplicar Tema'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;

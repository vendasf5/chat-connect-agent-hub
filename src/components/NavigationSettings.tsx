
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const NavigationSettings = () => {
  const { toast } = useToast();
  const [navigationColors, setNavigationColors] = useState({
    defaultBg: '#000000',
    defaultText: '#ffffff',
    hoverBg: '#374151',
    activeBg: '#2563eb',
    activeText: '#ffffff',
  });

  const presetStyles = [
    {
      name: 'Preto Padrão',
      defaultBg: '#000000',
      defaultText: '#ffffff',
      hoverBg: '#374151',
      activeBg: '#2563eb',
      activeText: '#ffffff',
    },
    {
      name: 'Cinza Moderno',
      defaultBg: '#6b7280',
      defaultText: '#ffffff',
      hoverBg: '#4b5563',
      activeBg: '#2563eb',
      activeText: '#ffffff',
    },
    {
      name: 'Azul Escuro',
      defaultBg: '#1e3a8a',
      defaultText: '#ffffff',
      hoverBg: '#1e40af',
      activeBg: '#3b82f6',
      activeText: '#ffffff',
    },
    {
      name: 'Verde Escuro',
      defaultBg: '#166534',
      defaultText: '#ffffff',
      hoverBg: '#15803d',
      activeBg: '#22c55e',
      activeText: '#ffffff',
    },
  ];

  const applyPreset = (preset: typeof presetStyles[0]) => {
    const newColors = {
      defaultBg: preset.defaultBg,
      defaultText: preset.defaultText,
      hoverBg: preset.hoverBg,
      activeBg: preset.activeBg,
      activeText: preset.activeText,
    };
    setNavigationColors(newColors);
    applyNavigationStyles(newColors);
    toast({
      title: 'Estilo aplicado',
      description: `Estilo "${preset.name}" aplicado com sucesso.`,
    });
  };

  const applyNavigationStyles = (colors: typeof navigationColors) => {
    const root = document.documentElement;
    root.style.setProperty('--nav-default-bg', colors.defaultBg);
    root.style.setProperty('--nav-default-text', colors.defaultText);
    root.style.setProperty('--nav-hover-bg', colors.hoverBg);
    root.style.setProperty('--nav-active-bg', colors.activeBg);
    root.style.setProperty('--nav-active-text', colors.activeText);
  };

  const handleSave = () => {
    applyNavigationStyles(navigationColors);
    localStorage.setItem('navigationColors', JSON.stringify(navigationColors));
    toast({
      title: 'Cores da navegação salvas',
      description: 'As configurações de cores foram aplicadas com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estilos Predefinidos de Navegação</CardTitle>
          <CardDescription>
            Escolha um dos estilos predefinidos para os botões de navegação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {presetStyles.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => applyPreset(preset)}
              >
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: preset.defaultBg }}
                  />
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: preset.hoverBg }}
                  />
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: preset.activeBg }}
                  />
                </div>
                <span className="text-sm">{preset.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalização Avançada de Navegação</CardTitle>
          <CardDescription>
            Configure cores personalizadas para os botões de navegação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultBg">Cor de Fundo Padrão</Label>
              <Input
                id="defaultBg"
                type="color"
                value={navigationColors.defaultBg}
                onChange={(e) => setNavigationColors({...navigationColors, defaultBg: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultText">Cor do Texto Padrão</Label>
              <Input
                id="defaultText"
                type="color"
                value={navigationColors.defaultText}
                onChange={(e) => setNavigationColors({...navigationColors, defaultText: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hoverBg">Cor de Fundo no Hover</Label>
              <Input
                id="hoverBg"
                type="color"
                value={navigationColors.hoverBg}
                onChange={(e) => setNavigationColors({...navigationColors, hoverBg: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activeBg">Cor de Fundo Ativo</Label>
              <Input
                id="activeBg"
                type="color"
                value={navigationColors.activeBg}
                onChange={(e) => setNavigationColors({...navigationColors, activeBg: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activeText">Cor do Texto Ativo</Label>
              <Input
                id="activeText"
                type="color"
                value={navigationColors.activeText}
                onChange={(e) => setNavigationColors({...navigationColors, activeText: e.target.value})}
              />
            </div>
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações de Navegação
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationSettings;

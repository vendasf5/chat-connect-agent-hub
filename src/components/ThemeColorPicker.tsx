
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';

const ThemeColorPicker = () => {
  const { themeSettings, updateTheme } = useTheme();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(themeSettings);

  const presetThemes = [
    {
      name: 'Azul Padrão',
      primary_color: '222.2 47.4% 11.2%',
      secondary_color: '210 40% 96.1%',
      background_color: '0 0% 100%',
      foreground_color: '222.2 84% 4.9%',
    },
    {
      name: 'Verde Moderno',
      primary_color: '142 76% 36%',
      secondary_color: '138 76% 97%',
      background_color: '0 0% 100%',
      foreground_color: '240 10% 3.9%',
    },
    {
      name: 'Roxo Elegante',
      primary_color: '262 83% 58%',
      secondary_color: '270 95% 98%',
      background_color: '0 0% 100%',
      foreground_color: '224 71% 4%',
    },
    {
      name: 'Laranja Vibrante',
      primary_color: '25 95% 53%',
      secondary_color: '48 96% 89%',
      background_color: '0 0% 100%',
      foreground_color: '20 14% 4%',
    },
  ];

  const handleSave = async () => {
    await updateTheme(localSettings);
    toast({
      title: 'Tema atualizado',
      description: 'As cores do sistema foram alteradas com sucesso.',
    });
  };

  const applyPreset = async (preset: typeof presetThemes[0]) => {
    const newSettings = {
      ...localSettings,
      ...preset,
      theme_name: preset.name,
    };
    setLocalSettings(newSettings);
    await updateTheme(newSettings);
    toast({
      title: 'Tema aplicado',
      description: `Tema "${preset.name}" aplicado com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temas Predefinidos</CardTitle>
          <CardDescription>
            Escolha um dos temas predefinidos para aplicar rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {presetThemes.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => applyPreset(preset)}
              >
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: `hsl(${preset.primary_color})` }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: `hsl(${preset.secondary_color})` }}
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
          <CardTitle>Personalização Avançada</CardTitle>
          <CardDescription>
            Configure cores personalizadas usando valores HSL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary">Cor Primária (HSL)</Label>
            <Input
              id="primary"
              value={localSettings.primary_color}
              onChange={(e) => setLocalSettings({...localSettings, primary_color: e.target.value})}
              placeholder="222.2 47.4% 11.2%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondary">Cor Secundária (HSL)</Label>
            <Input
              id="secondary"
              value={localSettings.secondary_color}
              onChange={(e) => setLocalSettings({...localSettings, secondary_color: e.target.value})}
              placeholder="210 40% 96.1%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background">Cor de Fundo (HSL)</Label>
            <Input
              id="background"
              value={localSettings.background_color}
              onChange={(e) => setLocalSettings({...localSettings, background_color: e.target.value})}
              placeholder="0 0% 100%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="foreground">Cor do Texto (HSL)</Label>
            <Input
              id="foreground"
              value={localSettings.foreground_color}
              onChange={(e) => setLocalSettings({...localSettings, foreground_color: e.target.value})}
              placeholder="222.2 84% 4.9%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="themeName">Nome do Tema</Label>
            <Input
              id="themeName"
              value={localSettings.theme_name}
              onChange={(e) => setLocalSettings({...localSettings, theme_name: e.target.value})}
              placeholder="Meu tema personalizado"
            />
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Salvar Tema Personalizado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeColorPicker;

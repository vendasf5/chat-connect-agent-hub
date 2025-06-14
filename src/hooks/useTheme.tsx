
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ThemeSettings {
  id?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  foreground_color: string;
  theme_name: string;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  updateTheme: (settings: Partial<ThemeSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultTheme: ThemeSettings = {
  primary_color: '222.2 47.4% 11.2%',
  secondary_color: '210 40% 96.1%',
  background_color: '0 0% 100%',
  foreground_color: '222.2 84% 4.9%',
  theme_name: 'Azul Corporativo',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadThemeSettings();
    } else {
      setThemeSettings(defaultTheme);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    applyThemeToDocument(themeSettings);
  }, [themeSettings]);

  const loadThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading theme:', error);
      } else if (data) {
        const loadedTheme = {
          id: data.id,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          background_color: data.background_color,
          foreground_color: data.foreground_color,
          theme_name: data.theme_name,
        };
        setThemeSettings(loadedTheme);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (newSettings: Partial<ThemeSettings>) => {
    if (!user) return;

    const updatedSettings = { ...themeSettings, ...newSettings };
    setThemeSettings(updatedSettings);
    applyThemeToDocument(updatedSettings);

    try {
      const { error } = await supabase
        .from('theme_settings')
        .upsert({
          user_id: user.id,
          primary_color: updatedSettings.primary_color,
          secondary_color: updatedSettings.secondary_color,
          background_color: updatedSettings.background_color,
          foreground_color: updatedSettings.foreground_color,
          theme_name: updatedSettings.theme_name,
        });

      if (error) {
        console.error('Error updating theme:', error);
      }
    } catch (error) {
      console.error('Error updating theme settings:', error);
    }
  };

  const applyThemeToDocument = (settings: ThemeSettings) => {
    const root = document.documentElement;
    
    // Aplicar as cores CSS customizadas
    root.style.setProperty('--primary', settings.primary_color);
    root.style.setProperty('--secondary', settings.secondary_color);
    root.style.setProperty('--background', settings.background_color);
    root.style.setProperty('--foreground', settings.foreground_color);
    
    // Aplicar cores derivadas para componentes
    root.style.setProperty('--card', settings.background_color);
    root.style.setProperty('--card-foreground', settings.foreground_color);
    root.style.setProperty('--popover', settings.background_color);
    root.style.setProperty('--popover-foreground', settings.foreground_color);
    root.style.setProperty('--primary-foreground', settings.background_color);
    root.style.setProperty('--secondary-foreground', settings.foreground_color);
    
    // Cores de estado baseadas no tema
    if (settings.theme_name === 'Modo Escuro Profissional') {
      root.style.setProperty('--muted', '217.2 32.6% 17.5%');
      root.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
      root.style.setProperty('--accent', '217.2 32.6% 17.5%');
      root.style.setProperty('--accent-foreground', settings.foreground_color);
      root.style.setProperty('--border', '217.2 32.6% 17.5%');
      root.style.setProperty('--input', '217.2 32.6% 17.5%');
      root.style.setProperty('--ring', '212.7 26.8% 83.9%');
    } else {
      root.style.setProperty('--muted', settings.secondary_color);
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
      root.style.setProperty('--accent', settings.secondary_color);
      root.style.setProperty('--accent-foreground', settings.foreground_color);
      root.style.setProperty('--border', '214.3 31.8% 91.4%');
      root.style.setProperty('--input', '214.3 31.8% 91.4%');
      root.style.setProperty('--ring', '222.2 84% 4.9%');
    }
    
    // Cores de estado sempre necessárias
    root.style.setProperty('--destructive', '0 84.2% 60.2%');
    root.style.setProperty('--destructive-foreground', '210 40% 98%');
    root.style.setProperty('--radius', '0.5rem');
  };

  const value = {
    themeSettings,
    updateTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

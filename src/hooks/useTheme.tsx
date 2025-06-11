
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
  theme_name: 'default',
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
        setThemeSettings(data);
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

    try {
      const { error } = await supabase
        .from('theme_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
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
    root.style.setProperty('--primary', settings.primary_color);
    root.style.setProperty('--secondary', settings.secondary_color);
    root.style.setProperty('--background', settings.background_color);
    root.style.setProperty('--foreground', settings.foreground_color);
  };

  const value = {
    themeSettings,
    updateTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

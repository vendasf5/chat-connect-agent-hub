
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ModernCard from './ModernCard';
import { CompanySettings } from '@/types';
import { 
  Building2, 
  Upload, 
  Image as ImageIcon,
  Palette,
  Eye
} from 'lucide-react';

const CompanyBrandingTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Buscar configurações da empresa
  const { data: companySettings, isLoading } = useQuery({
    queryKey: ['company-settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as CompanySettings;
    },
    enabled: !!user,
  });

  // Mutation para salvar configurações
  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<CompanySettings>) => {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          user_id: user?.id,
          ...settings,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
      toast({
        title: 'Configurações salvas',
        description: 'As configurações da empresa foram atualizadas com sucesso.',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    const companyNameInput = document.getElementById('company-name') as HTMLInputElement;
    const companyName = companyNameInput?.value || 'Femar Atende';

    let logoUrl = companySettings?.logo_url;

    // Se houver um novo arquivo de logo, fazer upload
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${user?.id}/logo.${fileExt}`;
      
      // Fazer upload do arquivo (simulado - em produção usaria Supabase Storage)
      logoUrl = previewUrl; // Por enquanto usa a URL de preview
    }

    saveSettingsMutation.mutate({
      company_name: companyName,
      logo_url: logoUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo da Empresa */}
      <ModernCard
        title="Logo da Empresa"
        description="Configure o logo que aparecerá no login e no menu superior"
        icon={<ImageIcon className="w-5 h-5" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Upload do Logo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Escolher
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                defaultValue={companySettings?.company_name || 'Femar Atende'}
                placeholder="Nome da sua empresa"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Preview do Logo</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              {(previewUrl || companySettings?.logo_url) ? (
                <img
                  src={previewUrl || companySettings?.logo_url}
                  alt="Logo da empresa"
                  className="max-h-32 mx-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="space-y-2">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Nenhum logo carregado</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={saveSettingsMutation.isPending}>
          {saveSettingsMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </ModernCard>

      {/* Onde o Logo Aparece */}
      <ModernCard
        title="Onde o Logo Aparece"
        description="Veja onde sua marca será exibida no sistema"
        icon={<Eye className="w-5 h-5" />}
        badge="Preview"
        badgeVariant="outline"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Página de Login</span>
            </h4>
            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-3 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Logo aparece centralizado acima do formulário de login
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Menu Superior</span>
            </h4>
            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  {companySettings?.company_name || 'Femar Atende'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Logo e nome aparecem no canto superior esquerdo
              </p>
            </div>
          </div>
        </div>
      </ModernCard>

      {/* Dicas de Design */}
      <ModernCard
        title="Dicas para um Logo Perfeito"
        description="Recomendações para melhor resultado visual"
        icon={<Palette className="w-5 h-5" />}
        badge="Dicas"
        badgeVariant="outline"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">📐 Dimensões</h4>
            <p className="text-sm text-muted-foreground">
              Ideal: 200x50px ou proporções similares. Evite logos muito altos.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">🎨 Formato</h4>
            <p className="text-sm text-muted-foreground">
              PNG com fundo transparente funciona melhor para adaptação aos temas.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">✨ Qualidade</h4>
            <p className="text-sm text-muted-foreground">
              Use vetores ou imagens de alta resolução para melhor definição.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default CompanyBrandingTab;

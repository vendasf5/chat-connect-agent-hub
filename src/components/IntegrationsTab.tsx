
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ModernCard from './ModernCard';
import { 
  Database, 
  Zap, 
  Server, 
  Webhook, 
  Plus,
  Copy,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { CustomIntegration } from '@/types';

const IntegrationsTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'api' as 'api' | 'webhook',
    url: '',
    api_key: ''
  });

  // Buscar configurações de API
  const { data: apiConfig } = useQuery({
    queryKey: ['api-config', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  // Buscar integrações personalizadas
  const { data: customIntegrations = [] } = useQuery({
    queryKey: ['custom-integrations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_integrations')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data as CustomIntegration[];
    },
    enabled: !!user,
  });

  // Mutation para adicionar nova integração
  const addIntegrationMutation = useMutation({
    mutationFn: async (integration: Omit<CustomIntegration, 'id' | 'user_id'>) => {
      const { error } = await supabase
        .from('custom_integrations')
        .insert({
          ...integration,
          user_id: user?.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-integrations'] });
      setNewIntegration({ name: '', type: 'api', url: '', api_key: '' });
      toast({
        title: 'Integração adicionada',
        description: 'Nova integração foi configurada com sucesso.',
      });
    },
  });

  // Mutation para toggle de integração
  const toggleIntegrationMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('custom_integrations')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-integrations'] });
    },
  });

  const handleAddIntegration = () => {
    if (!newIntegration.name || !newIntegration.url) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome e URL da integração.',
        variant: 'destructive',
      });
      return;
    }

    addIntegrationMutation.mutate({
      ...newIntegration,
      is_active: true,
    });
  };

  const copyConfig = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'Configuração copiada para a área de transferência.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Supabase */}
      <ModernCard
        title="Supabase"
        description="Banco de dados principal com autenticação e tempo real"
        icon={<Zap className="w-5 h-5" />}
        badge="Conectado"
        badgeVariant="default"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">URL do Projeto</Label>
            <div className="flex items-center space-x-2">
              <Input 
                value="https://guqkcvbdfinzaacvqbjc.supabase.co"
                readOnly
                className="bg-muted"
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyConfig("https://guqkcvbdfinzaacvqbjc.supabase.co")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Chave Anon</Label>
            <div className="flex items-center space-x-2">
              <Input 
                value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                readOnly
                className="bg-muted"
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyConfig("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cWtjdmJkZmluemFhY3ZxYmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MTQ0ODYsImV4cCI6MjA2NTE5MDQ4Nn0.l6Z4ICZSkou3r9QT-UjntSWogZcNjrU6BKLI6qwjwmw")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Status: Conectado e funcionando</span>
          </div>
          <Switch checked={true} disabled />
        </div>
      </ModernCard>

      {/* MySQL */}
      <ModernCard
        title="MySQL"
        description="Banco de dados secundário para armazenamento adicional"
        icon={<Server className="w-5 h-5" />}
        badge="Desconectado"
        badgeVariant="secondary"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mysql-host">Host</Label>
            <Input id="mysql-host" placeholder="localhost" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mysql-port">Porta</Label>
            <Input id="mysql-port" placeholder="3306" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mysql-database">Database</Label>
            <Input id="mysql-database" placeholder="femar_atende" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mysql-username">Usuário</Label>
            <Input id="mysql-username" placeholder="root" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mysql-password">Senha</Label>
            <Input id="mysql-password" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-800">Status: Desconectado</span>
          </div>
          <Switch checked={false} />
        </div>
        <Button className="w-full">
          Testar Conexão
        </Button>
      </ModernCard>

      {/* Evolution API */}
      <ModernCard
        title="Evolution API"
        description="API para integração com WhatsApp Business"
        icon={<Webhook className="w-5 h-5" />}
        badge={apiConfig?.evolution_api_url ? "Configurado" : "Pendente"}
        badgeVariant={apiConfig?.evolution_api_url ? "default" : "secondary"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="evolution-url">URL da API</Label>
            <Input 
              id="evolution-url" 
              defaultValue={apiConfig?.evolution_api_url}
              placeholder="https://api.evolution.com" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evolution-key">Chave da API</Label>
            <Input 
              id="evolution-key" 
              type="password"
              defaultValue={apiConfig?.evolution_api_key}
              placeholder="••••••••••••••••" 
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">Status: {apiConfig?.evolution_api_url ? 'Configurado' : 'Pendente'}</span>
          </div>
          <Switch checked={!!apiConfig?.evolution_api_url} />
        </div>
        <Button className="w-full">
          Salvar Configurações
        </Button>
      </ModernCard>

      {/* Integrações Personalizadas */}
      <ModernCard
        title="Integrações Personalizadas"
        description="Adicione APIs e Webhooks personalizados"
        icon={<Plus className="w-5 h-5" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="new-name">Nome</Label>
              <Input 
                id="new-name"
                value={newIntegration.name}
                onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                placeholder="Nome da integração" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-type">Tipo</Label>
              <select 
                id="new-type"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                value={newIntegration.type}
                onChange={(e) => setNewIntegration({...newIntegration, type: e.target.value as 'api' | 'webhook'})}
              >
                <option value="api">API</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-url">URL</Label>
              <Input 
                id="new-url"
                value={newIntegration.url}
                onChange={(e) => setNewIntegration({...newIntegration, url: e.target.value})}
                placeholder="https://..." 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-key">API Key (opcional)</Label>
              <Input 
                id="new-key"
                value={newIntegration.api_key}
                onChange={(e) => setNewIntegration({...newIntegration, api_key: e.target.value})}
                placeholder="Chave da API" 
              />
            </div>
          </div>
          <Button onClick={handleAddIntegration} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Integração
          </Button>
        </div>

        {/* Lista de Integrações */}
        {customIntegrations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Integrações Configuradas</h4>
            {customIntegrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={integration.type === 'api' ? 'default' : 'outline'}>
                    {integration.type.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.url}</p>
                  </div>
                </div>
                <Switch 
                  checked={integration.is_active}
                  onCheckedChange={(checked) => 
                    toggleIntegrationMutation.mutate({ 
                      id: integration.id!, 
                      is_active: checked 
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </ModernCard>
    </div>
  );
};

export default IntegrationsTab;

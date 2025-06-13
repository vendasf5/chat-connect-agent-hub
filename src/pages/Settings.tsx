
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ThemeSelector from '@/components/ThemeSelector';
import DatabaseConnectionCard from '@/components/DatabaseConnectionCard';
import NavigationSettings from '@/components/NavigationSettings';
import { 
  Database, 
  Palette, 
  Navigation, 
  Bell, 
  ArrowRightLeft, 
  Zap,
  Server,
  Settings as SettingsIcon
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [notifications, setNotifications] = useState({
    newConversations: true,
    transfers: true,
    agentStatus: false,
    systemAlerts: true
  });

  // Buscar configurações de API
  const { data: apiConfig, isLoading: isLoadingApiConfig } = useQuery({
    queryKey: ['api-config', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  // Mutation para salvar configurações de API
  const saveApiConfigMutation = useMutation({
    mutationFn: async (config: any) => {
      const { error } = await supabase
        .from('api_configurations')
        .upsert({
          user_id: user?.id,
          ...config,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-config'] });
      toast({
        title: 'Configurações salvas',
        description: 'As configurações foram atualizadas com sucesso.',
      });
    },
  });

  const handleSaveApiConfig = (configData: any) => {
    saveApiConfigMutation.mutate(configData);
  };

  const handleSaveNotifications = () => {
    console.log('Salvando configurações de notificações:', notifications);
    toast({
      title: 'Notificações atualizadas',
      description: 'Suas preferências de notificação foram salvas.',
    });
  };

  const handleDatabaseSave = (type: string) => (config: any) => {
    console.log(`Salvando configuração ${type}:`, config);
    toast({
      title: `${type} configurado`,
      description: `Conexão com ${type} foi configurada com sucesso.`,
    });
  };

  const handleDatabaseToggle = (type: string) => (enabled: boolean) => {
    console.log(`${type} ${enabled ? 'habilitado' : 'desabilitado'}`);
    toast({
      title: `${type} ${enabled ? 'habilitado' : 'desabilitado'}`,
      description: `Conexão com ${type} foi ${enabled ? 'ativada' : 'desativada'}.`,
    });
  };

  if (isLoadingApiConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
            <SettingsIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Configure integrações, aparência e preferências para personalizar sua experiência
        </p>
      </div>

      <Tabs defaultValue="themes" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 h-14 p-1 bg-muted/50">
          <TabsTrigger value="themes" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Temas</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Navigation className="w-4 h-4" />
            <span className="hidden sm:inline">Navegação</span>
          </TabsTrigger>
          <TabsTrigger value="databases" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Bancos</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="transfers" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Transferências</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          <ThemeSelector />
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <NavigationSettings />
        </TabsContent>

        <TabsContent value="databases" className="space-y-6">
          <div className="grid gap-6">
            <DatabaseConnectionCard
              title="Supabase"
              description="Banco de dados principal com autenticação e tempo real"
              icon={<Zap className="w-5 h-5 text-green-600" />}
              config={{
                name: 'Supabase',
                host: 'guqkcvbdfinzaacvqbjc.supabase.co',
                port: '5432',
                database: 'postgres',
                username: 'postgres',
                password: '••••••••',
                enabled: true,
              }}
              onSave={handleDatabaseSave('Supabase')}
              onToggle={handleDatabaseToggle('Supabase')}
              isConnected={true}
            />

            <DatabaseConnectionCard
              title="MySQL"
              description="Banco de dados MySQL para armazenamento adicional"
              icon={<Server className="w-5 h-5 text-orange-600" />}
              config={{
                name: 'MySQL',
                host: 'localhost',
                port: '3306',
                database: 'femar_atende',
                username: 'root',
                password: '',
                enabled: false,
              }}
              onSave={handleDatabaseSave('MySQL')}
              onToggle={handleDatabaseToggle('MySQL')}
              isConnected={false}
            />
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span>Estrutura do Banco</span>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Automático
                </Badge>
              </CardTitle>
              <CardDescription>
                Ao conectar um novo banco, a estrutura será criada automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Tabelas Principais</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• agents</li>
                    <li>• conversations</li>
                    <li>• messages</li>
                    <li>• transfers</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Configurações</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• api_configurations</li>
                    <li>• theme_settings</li>
                    <li>• profiles</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Sessões</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• agent_sessions</li>
                    <li>• auth.users</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Funcionalidades</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• RLS Policies</li>
                    <li>• Triggers</li>
                    <li>• Functions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Preferências de Notificação</span>
              </CardTitle>
              <CardDescription>
                Configure quando e como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Label className="font-medium">Novas Conversas</Label>
                      <Badge variant={notifications.newConversations ? "default" : "secondary"}>
                        {notifications.newConversations ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receber notificação quando uma nova conversa for iniciada
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newConversations}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, newConversations: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Label className="font-medium">Transferências</Label>
                      <Badge variant={notifications.transfers ? "default" : "secondary"}>
                        {notifications.transfers ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre transferências para atendimento humano
                    </p>
                  </div>
                  <Switch
                    checked={notifications.transfers}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, transfers: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Label className="font-medium">Status dos Agentes</Label>
                      <Badge variant={notifications.agentStatus ? "default" : "secondary"}>
                        {notifications.agentStatus ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Alertas sobre mudanças no status dos agentes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.agentStatus}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, agentStatus: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Label className="font-medium">Alertas do Sistema</Label>
                      <Badge variant={notifications.systemAlerts ? "default" : "secondary"}>
                        {notifications.systemAlerts ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre problemas e manutenções
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, systemAlerts: checked})
                    }
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications} className="w-full">
                Salvar Preferências de Notificação
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5" />
                <span>Configurações de Transferência</span>
              </CardTitle>
              <CardDescription>
                Configure como as transferências para atendimento humano funcionam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout para Auto-Transferência</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="timeout"
                      type="number"
                      defaultValue={apiConfig?.auto_transfer_timeout || 300}
                      placeholder="300"
                    />
                    <span className="text-sm text-muted-foreground">segundos</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="queueSize">Tamanho Máximo da Fila</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="queueSize"
                      type="number"
                      defaultValue={apiConfig?.max_queue_size || 10}
                      placeholder="10"
                    />
                    <span className="text-sm text-muted-foreground">conversas</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transferMessage">Mensagem de Transferência</Label>
                <Textarea
                  id="transferMessage"
                  defaultValue={apiConfig?.transfer_message || 'Você será transferido para um atendente humano. Por favor, aguarde...'}
                  placeholder="Mensagem enviada ao cliente durante a transferência"
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <Button onClick={() => {
                const timeout = (document.getElementById('timeout') as HTMLInputElement)?.value;
                const queueSize = (document.getElementById('queueSize') as HTMLInputElement)?.value;
                const transferMessage = (document.getElementById('transferMessage') as HTMLTextAreaElement)?.value;
                handleSaveApiConfig({
                  evolution_api_url: apiConfig?.evolution_api_url,
                  evolution_api_key: apiConfig?.evolution_api_key,
                  n8n_webhook_url: apiConfig?.n8n_webhook_url,
                  auto_transfer_timeout: parseInt(timeout),
                  max_queue_size: parseInt(queueSize),
                  transfer_message: transferMessage,
                });
              }} className="w-full">
                Salvar Configurações de Transferência
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

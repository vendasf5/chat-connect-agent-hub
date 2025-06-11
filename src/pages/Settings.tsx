
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ThemeColorPicker from '@/components/ThemeColorPicker';

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
        description: 'As configurações da API foram atualizadas com sucesso.',
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

  if (isLoadingApiConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Configure as integrações, cores e preferências do sistema</p>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theme">Cores & Tema</TabsTrigger>
          <TabsTrigger value="api">APIs & Integrações</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="transfers">Transferências</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-6">
          <ThemeColorPicker />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolution API</CardTitle>
              <CardDescription>
                Configure a conexão com a Evolution API para gerenciar as instâncias do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="evolutionUrl">URL da Evolution API</Label>
                <Input
                  id="evolutionUrl"
                  defaultValue={apiConfig?.evolution_api_url || 'https://api.evolution.com'}
                  placeholder="https://api.evolution.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="evolutionKey">Chave da API</Label>
                <Input
                  id="evolutionKey"
                  type="password"
                  defaultValue={apiConfig?.evolution_api_key || ''}
                  placeholder="Sua chave da Evolution API"
                />
              </div>
              
              <Button onClick={() => {
                const evolutionUrl = (document.getElementById('evolutionUrl') as HTMLInputElement)?.value;
                const evolutionKey = (document.getElementById('evolutionKey') as HTMLInputElement)?.value;
                handleSaveApiConfig({
                  evolution_api_url: evolutionUrl,
                  evolution_api_key: evolutionKey,
                  n8n_webhook_url: apiConfig?.n8n_webhook_url,
                  auto_transfer_timeout: apiConfig?.auto_transfer_timeout,
                  max_queue_size: apiConfig?.max_queue_size,
                  transfer_message: apiConfig?.transfer_message,
                });
              }}>
                Salvar Configurações da Evolution API
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>N8N Webhooks</CardTitle>
              <CardDescription>
                Configure os webhooks do N8N para automações e integrações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="n8nUrl">URL Base dos Webhooks</Label>
                <Input
                  id="n8nUrl"
                  defaultValue={apiConfig?.n8n_webhook_url || 'https://hooks.n8n.io/webhook'}
                  placeholder="https://hooks.n8n.io/webhook"
                />
              </div>
              
              <Button onClick={() => {
                const n8nUrl = (document.getElementById('n8nUrl') as HTMLInputElement)?.value;
                handleSaveApiConfig({
                  evolution_api_url: apiConfig?.evolution_api_url,
                  evolution_api_key: apiConfig?.evolution_api_key,
                  n8n_webhook_url: n8nUrl,
                  auto_transfer_timeout: apiConfig?.auto_transfer_timeout,
                  max_queue_size: apiConfig?.max_queue_size,
                  transfer_message: apiConfig?.transfer_message,
                });
              }}>
                Salvar Configurações do N8N
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure quando e como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Novas Conversas</Label>
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
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Transferências</Label>
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
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Status dos Agentes</Label>
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
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas do Sistema</Label>
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
              
              <Button onClick={handleSaveNotifications}>
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Transferência</CardTitle>
              <CardDescription>
                Configure como as transferências para atendimento humano funcionam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout para Auto-Transferência (segundos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  defaultValue={apiConfig?.auto_transfer_timeout || 300}
                  placeholder="300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="queueSize">Tamanho Máximo da Fila</Label>
                <Input
                  id="queueSize"
                  type="number"
                  defaultValue={apiConfig?.max_queue_size || 10}
                  placeholder="10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transferMessage">Mensagem de Transferência</Label>
                <Textarea
                  id="transferMessage"
                  defaultValue={apiConfig?.transfer_message || 'Você será transferido para um atendente humano. Por favor, aguarde...'}
                  placeholder="Mensagem enviada ao cliente durante a transferência"
                  rows={3}
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
              }}>
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

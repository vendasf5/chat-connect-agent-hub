
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ApiConfig } from '@/types';

const Settings = () => {
  const { toast } = useToast();
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    evolutionApiUrl: 'https://api.evolution.com',
    evolutionApiKey: '',
    n8nWebhookUrl: 'https://hooks.n8n.io/webhook'
  });

  const [notifications, setNotifications] = useState({
    newConversations: true,
    transfers: true,
    agentStatus: false,
    systemAlerts: true
  });

  const [transferSettings, setTransferSettings] = useState({
    autoTransferTimeout: '300',
    maxQueueSize: '10',
    transferMessage: 'Você será transferido para um atendente humano. Por favor, aguarde...'
  });

  const handleSaveApiConfig = () => {
    // Aqui você salvaria as configurações no seu backend
    console.log('Salvando configurações de API:', apiConfig);
    toast({
      title: 'Configurações salvas',
      description: 'As configurações da API foram atualizadas com sucesso.',
    });
  };

  const handleSaveNotifications = () => {
    console.log('Salvando configurações de notificações:', notifications);
    toast({
      title: 'Notificações atualizadas',
      description: 'Suas preferências de notificação foram salvas.',
    });
  };

  const handleSaveTransferSettings = () => {
    console.log('Salvando configurações de transferência:', transferSettings);
    toast({
      title: 'Configurações de transferência salvas',
      description: 'As configurações foram atualizadas com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Configure as integrações e preferências do sistema</p>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api">APIs & Integrações</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="transfers">Transferências</TabsTrigger>
        </TabsList>

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
                  value={apiConfig.evolutionApiUrl}
                  onChange={(e) => setApiConfig({...apiConfig, evolutionApiUrl: e.target.value})}
                  placeholder="https://api.evolution.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="evolutionKey">Chave da API</Label>
                <Input
                  id="evolutionKey"
                  type="password"
                  value={apiConfig.evolutionApiKey}
                  onChange={(e) => setApiConfig({...apiConfig, evolutionApiKey: e.target.value})}
                  placeholder="Sua chave da Evolution API"
                />
              </div>
              
              <Button onClick={handleSaveApiConfig}>
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
                  value={apiConfig.n8nWebhookUrl}
                  onChange={(e) => setApiConfig({...apiConfig, n8nWebhookUrl: e.target.value})}
                  placeholder="https://hooks.n8n.io/webhook"
                />
              </div>
              
              <Button onClick={handleSaveApiConfig}>
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
                  value={transferSettings.autoTransferTimeout}
                  onChange={(e) => setTransferSettings({
                    ...transferSettings, 
                    autoTransferTimeout: e.target.value
                  })}
                  placeholder="300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="queueSize">Tamanho Máximo da Fila</Label>
                <Input
                  id="queueSize"
                  type="number"
                  value={transferSettings.maxQueueSize}
                  onChange={(e) => setTransferSettings({
                    ...transferSettings, 
                    maxQueueSize: e.target.value
                  })}
                  placeholder="10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transferMessage">Mensagem de Transferência</Label>
                <Textarea
                  id="transferMessage"
                  value={transferSettings.transferMessage}
                  onChange={(e) => setTransferSettings({
                    ...transferSettings, 
                    transferMessage: e.target.value
                  })}
                  placeholder="Mensagem enviada ao cliente durante a transferência"
                  rows={3}
                />
              </div>
              
              <Button onClick={handleSaveTransferSettings}>
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


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Settings, Phone } from 'lucide-react';
import { Agent } from '@/types';
import { AgentDialog } from '@/components/AgentDialog';

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Agente Vendas',
      extension: '1001',
      status: 'online',
      description: 'Especialista em vendas e qualificação de leads',
      apiUrl: 'https://api.evolution.com/instance1',
      webhookUrl: 'https://hooks.n8n.io/webhook/vendas',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Agente Suporte',
      extension: '1002',
      status: 'online',
      description: 'Atendimento técnico e resolução de problemas',
      apiUrl: 'https://api.evolution.com/instance2',
      webhookUrl: 'https://hooks.n8n.io/webhook/suporte',
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Agente Marketing',
      extension: '1003',
      status: 'offline',
      description: 'Campanhas promocionais e nutrição de leads',
      apiUrl: 'https://api.evolution.com/instance3',
      webhookUrl: 'https://hooks.n8n.io/webhook/marketing',
      createdAt: '2024-01-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.extension.includes(searchTerm)
  );

  const handleSaveAgent = (agentData: Omit<Agent, 'id' | 'createdAt'>) => {
    if (editingAgent) {
      setAgents(agents.map(agent =>
        agent.id === editingAgent.id
          ? { ...agentData, id: editingAgent.id, createdAt: editingAgent.createdAt }
          : agent
      ));
    } else {
      const newAgent: Agent = {
        ...agentData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAgents([...agents, newAgent]);
    }
    setDialogOpen(false);
    setEditingAgent(null);
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'busy': return 'Ocupado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agentes</h1>
          <p className="text-muted-foreground">Gerencie seus agentes de conversação</p>
        </div>
        <Button onClick={() => {
          setEditingAgent(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Agente
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar agentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingAgent(agent);
                    setDialogOpen(true);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ramal: {agent.extension}</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                  {getStatusLabel(agent.status)}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>API:</strong> {agent.apiUrl}</p>
                <p><strong>Webhook:</strong> {agent.webhookUrl}</p>
                <p><strong>Criado:</strong> {agent.createdAt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum agente encontrado</p>
        </div>
      )}

      <AgentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agent={editingAgent}
        onSave={handleSaveAgent}
      />
    </div>
  );
};

export default Agents;

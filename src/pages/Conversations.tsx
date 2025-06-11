
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Clock, User } from 'lucide-react';
import { Conversation } from '@/types';

const Conversations = () => {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      agentId: '1',
      customerName: 'João Silva',
      customerPhone: '+55 11 99999-9999',
      status: 'active',
      lastMessage: 'Gostaria de saber mais sobre os produtos',
      timestamp: '10:30'
    },
    {
      id: '2',
      agentId: '2',
      customerName: 'Maria Santos',
      customerPhone: '+55 11 88888-8888',
      status: 'pending',
      lastMessage: 'Preciso de ajuda com minha conta',
      timestamp: '10:15'
    },
    {
      id: '3',
      agentId: '1',
      customerName: 'Carlos Oliveira',
      customerPhone: '+55 11 77777-7777',
      status: 'transferred',
      lastMessage: 'Quero falar com um atendente humano',
      timestamp: '09:45'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.customerPhone.includes(searchTerm)
  );

  const getStatusColor = (status: Conversation['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'transferred': return 'bg-blue-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Conversation['status']) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'pending': return 'Pendente';
      case 'transferred': return 'Transferida';
      case 'closed': return 'Fechada';
      default: return 'Desconhecida';
    }
  };

  const getAgentName = (agentId: string) => {
    const agentNames: { [key: string]: string } = {
      '1': 'Agente Vendas',
      '2': 'Agente Suporte',
      '3': 'Agente Marketing'
    };
    return agentNames[agentId] || 'Agente Desconhecido';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Conversas</h1>
        <p className="text-muted-foreground">Monitore todas as conversas em tempo real</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{conversation.customerName}</CardTitle>
                    <CardDescription>{conversation.customerPhone}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.status)}`}></div>
                    {getStatusLabel(conversation.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>Agente: {getAgentName(conversation.agentId)}</span>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">{conversation.lastMessage}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{conversation.timestamp}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Conversa
                    </Button>
                    {conversation.status === 'active' && (
                      <Button size="sm">
                        Transferir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
        </div>
      )}
    </div>
  );
};

export default Conversations;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Clock, Phone, MessageSquare } from 'lucide-react';

const Transfers = () => {
  const transfers = [
    {
      id: '1',
      customerName: 'Carlos Oliveira',
      customerPhone: '+55 11 77777-7777',
      agentName: 'Agente Vendas',
      reason: 'Solicitação do cliente - problema complexo',
      timestamp: '09:45',
      status: 'waiting',
      humanAgent: 'Disponível'
    },
    {
      id: '2',
      customerName: 'Ana Costa',
      customerPhone: '+55 11 66666-6666',
      agentName: 'Agente Suporte',
      reason: 'Escalação automática - tempo limite excedido',
      timestamp: '09:30',
      status: 'completed',
      humanAgent: 'João - Supervisor'
    },
    {
      id: '3',
      customerName: 'Pedro Lima',
      customerPhone: '+55 11 55555-5555',
      agentName: 'Agente Marketing',
      reason: 'Cliente insatisfeito - requer atenção especial',
      timestamp: '09:15',
      status: 'completed',
      humanAgent: 'Maria - Gerente'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting': return 'Aguardando';
      case 'completed': return 'Concluída';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transferências</h1>
        <p className="text-muted-foreground">Gerencie transferências para atendimento humano</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+3 desde ontem</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Tempo médio: 2 min</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">+2% esta semana</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {transfers.map((transfer) => (
          <Card key={transfer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{transfer.customerName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {transfer.customerPhone}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(transfer.status)}`}></div>
                  {getStatusLabel(transfer.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Agente Original:</p>
                  <p>{transfer.agentName}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Atendente Humano:</p>
                  <p>{transfer.humanAgent}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground text-sm">Motivo da Transferência:</p>
                <p className="text-sm bg-muted p-2 rounded mt-1">{transfer.reason}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{transfer.timestamp}</span>
                </div>
                
                {transfer.status === 'waiting' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Cancelar
                    </Button>
                    <Button size="sm">
                      Conectar Agente
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Transfers;

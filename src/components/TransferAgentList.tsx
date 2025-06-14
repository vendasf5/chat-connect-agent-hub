
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import ModernCard from './ModernCard';
import { Users, CheckCircle, XCircle, ArrowRightLeft } from 'lucide-react';
import { Agent } from '@/types';

interface TransferAgentListProps {
  agents: Agent[];
  isLoading: boolean;
  onToggle: (agentId: string, canTransfer: boolean) => void;
  isPending: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'text-green-600 bg-green-100';
    case 'busy': return 'text-yellow-600 bg-yellow-100';
    case 'offline': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'online': return 'Online';
    case 'busy': return 'Ocupado';
    case 'offline': return 'Offline';
    default: return 'Desconhecido';
  }
};

const TransferAgentList = ({
  agents,
  isLoading,
  onToggle,
  isPending
}: TransferAgentListProps) => (
  <ModernCard
    title="Configurações de Transferência por Agente"
    description="Controle quais agentes podem realizar transferências para atendimento humano"
    icon={<ArrowRightLeft className="w-5 h-5" />}
  >
    {isLoading ? (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ) : agents.length === 0 ? (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Nenhum agente cadastrado ainda.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Adicione agentes na aba "Agentes" para configurar suas permissões de transferência.
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <Badge className={`px-2 py-1 text-xs ${getStatusColor(agent.status)}`}>
                    {getStatusLabel(agent.status)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Ramal: {agent.extension}
                  </span>
                  {agent.department && (
                    <span className="text-sm text-muted-foreground">
                      Depto: {agent.department}
                    </span>
                  )}
                  {agent.email && (
                    <span className="text-sm text-muted-foreground">
                      {agent.email}
                    </span>
                  )}
                </div>
                {agent.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {agent.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {agent.can_transfer !== false ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {agent.can_transfer !== false ? 'Pode Transferir' : 'Bloqueado'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Max: {agent.max_concurrent_chats || 5} chats
                </p>
              </div>
              <Switch
                checked={agent.can_transfer !== false}
                onCheckedChange={(checked) => onToggle(agent.id, checked)}
                disabled={isPending}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </ModernCard>
);

export default TransferAgentList;

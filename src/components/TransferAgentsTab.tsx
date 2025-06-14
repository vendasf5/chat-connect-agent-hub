
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import ModernCard from './ModernCard';
import { Agent } from '@/types';
import { 
  UserCheck, 
  Users, 
  Clock, 
  ArrowRightLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';

const TransferAgentsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar agentes
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Agent[];
    },
    enabled: !!user,
  });

  // Mutation para atualizar permissão de transferência
  const updateTransferPermissionMutation = useMutation({
    mutationFn: async ({ agentId, canTransfer }: { agentId: string; canTransfer: boolean }) => {
      const { error } = await supabase
        .from('agents')
        .update({ can_transfer: canTransfer })
        .eq('id', agentId);
      
      if (error) throw error;
    },
    onSuccess: (_, { canTransfer }) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: 'Permissão atualizada',
        description: `Transferência ${canTransfer ? 'habilitada' : 'desabilitada'} com sucesso.`,
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a permissão de transferência.',
        variant: 'destructive',
      });
    },
  });

  const handleToggleTransfer = (agentId: string, canTransfer: boolean) => {
    updateTransferPermissionMutation.mutate({ agentId, canTransfer });
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const enabledAgents = agents.filter(agent => agent.can_transfer !== false).length;
  const totalAgents = agents.length;

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModernCard
          title="Total de Agentes"
          icon={<Users className="w-5 h-5" />}
          className="text-center"
        >
          <div className="text-3xl font-bold text-primary">{totalAgents}</div>
        </ModernCard>
        
        <ModernCard
          title="Podem Transferir"
          icon={<UserCheck className="w-5 h-5" />}
          className="text-center"
        >
          <div className="text-3xl font-bold text-green-600">{enabledAgents}</div>
        </ModernCard>
        
        <ModernCard
          title="Bloqueados"
          icon={<XCircle className="w-5 h-5" />}
          className="text-center"
        >
          <div className="text-3xl font-bold text-red-600">{totalAgents - enabledAgents}</div>
        </ModernCard>
        
        <ModernCard
          title="Taxa de Habilitação"
          icon={<ArrowRightLeft className="w-5 h-5" />}
          className="text-center"
        >
          <div className="text-3xl font-bold text-blue-600">
            {totalAgents > 0 ? Math.round((enabledAgents / totalAgents) * 100) : 0}%
          </div>
        </ModernCard>
      </div>

      {/* Lista de Agentes */}
      <ModernCard
        title="Configurações de Transferência por Agente"
        description="Controle quais agentes podem realizar transferências para atendimento humano"
        icon={<ArrowRightLeft className="w-5 h-5" />}
      >
        {agents.length === 0 ? (
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
                    onCheckedChange={(checked) => handleToggleTransfer(agent.id, checked)}
                    disabled={updateTransferPermissionMutation.isPending}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </ModernCard>

      {/* Informações sobre Transferências */}
      <ModernCard
        title="Como Funcionam as Transferências"
        description="Entenda o sistema de transferências do Femar Atende"
        icon={<Clock className="w-5 h-5" />}
        badge="Informação"
        badgeVariant="outline"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Agentes Habilitados</span>
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Podem receber transferências de bots</li>
              <li>• Podem transferir entre si</li>
              <li>• Aparecem na lista de agentes disponíveis</li>
              <li>• Recebem notificações de novas transferências</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Agentes Bloqueados</span>
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Não recebem transferências automáticas</li>
              <li>• Não podem transferir para outros agentes</li>
              <li>• Não aparecem na lista de disponíveis</li>
              <li>• Focam apenas em atendimento direto</li>
            </ul>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default TransferAgentsTab;

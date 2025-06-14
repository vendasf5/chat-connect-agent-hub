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

import TransferAgentStats from './TransferAgentStats';
import TransferAgentList from './TransferAgentList';
import TransferInfoCard from './TransferInfoCard';

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
      return data;
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

  const enabledAgents = agents.filter((agent: any) => agent.can_transfer !== false).length;
  const totalAgents = agents.length;

  return (
    <div className="space-y-6">
      <TransferAgentStats totalAgents={totalAgents} enabledAgents={enabledAgents} />
      <TransferAgentList
        agents={agents}
        isLoading={isLoading}
        onToggle={handleToggleTransfer}
        isPending={updateTransferPermissionMutation.isPending}
      />
      <TransferInfoCard />
    </div>
  );
};

export default TransferAgentsTab;

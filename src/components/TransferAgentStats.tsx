
import ModernCard from './ModernCard';
import { Users, UserCheck, XCircle, ArrowRightLeft } from 'lucide-react';

interface AgentStatsProps {
  totalAgents: number;
  enabledAgents: number;
}

const TransferAgentStats = ({ totalAgents, enabledAgents }: AgentStatsProps) => (
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
);

export default TransferAgentStats;

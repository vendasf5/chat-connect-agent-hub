
import ModernCard from './ModernCard';
import { Clock, CheckCircle, XCircle, ArrowRightLeft } from 'lucide-react';

const TransferInfoCard = () => (
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
);

export default TransferInfoCard;

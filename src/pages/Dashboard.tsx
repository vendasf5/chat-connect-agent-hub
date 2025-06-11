
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, UserCheck, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Agentes Ativos',
      value: '12',
      description: '+2 desde ontem',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Conversas Hoje',
      value: '256',
      description: '+18% desde ontem',
      icon: MessageSquare,
      trend: 'up'
    },
    {
      title: 'Transferências',
      value: '23',
      description: '8% do total',
      icon: UserCheck,
      trend: 'neutral'
    },
    {
      title: 'Taxa de Resposta',
      value: '94%',
      description: '+2% esta semana',
      icon: TrendingUp,
      trend: 'up'
    }
  ];

  const recentActivity = [
    { agent: 'Agente Vendas', action: 'Nova conversa iniciada', time: '2 min atrás' },
    { agent: 'Agente Suporte', action: 'Transferência para humano', time: '5 min atrás' },
    { agent: 'Agente Vendas', action: 'Conversa finalizada', time: '8 min atrás' },
    { agent: 'Agente Marketing', action: 'Lead qualificado', time: '12 min atrás' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema de agentes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agentes Online</CardTitle>
            <CardDescription>Status atual dos agentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Agente Vendas', 'Agente Suporte', 'Agente Marketing'].map((agent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{agent}</span>
                </div>
                <Badge variant="secondary">Online</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.agent}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

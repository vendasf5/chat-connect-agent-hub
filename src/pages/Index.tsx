
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, MessageSquare, Users, BarChart3, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Femar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Atende</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Plataforma completa de atendimento via WhatsApp com gestão inteligente de agentes e conversas
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="text-sm text-slate-600">Atendimento</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-center mb-2">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">Tempo Real</p>
                <p className="text-sm text-slate-600">Mensagens</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">Analytics</p>
                <p className="text-sm text-slate-600">Detalhados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Access Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white group">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Área do Agente</CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Acesse sua área de atendimento personalizada para responder mensagens, gerenciar conversas e transferir chamados
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Interface WhatsApp otimizada</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Transferência de conversas</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Status online/offline automático</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg" 
                onClick={() => navigate('/agent-login')}
                size="lg"
              >
                Entrar como Agente
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white group">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Área Administrativa</CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Gerencie agentes, configure integrações, monitore conversas e acesse relatórios detalhados do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Gestão completa de agentes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Relatórios e analytics</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Configurações avançadas</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 hover:text-purple-800" 
                onClick={() => navigate('/auth')}
                size="lg"
              >
                Entrar como Administrador
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Recursos Principais</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tudo que você precisa para oferecer um atendimento excepcional via WhatsApp
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Chat em Tempo Real</h3>
              <p className="text-slate-600">Interface intuitiva similar ao WhatsApp Web para atendimento natural</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Gestão de Agentes</h3>
              <p className="text-slate-600">Controle completo de status, departamentos e transferências</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics Avançado</h3>
              <p className="text-slate-600">Relatórios detalhados e métricas de performance em tempo real</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            © 2024 Femar Atende. Todos os direitos reservados. | Sistema de atendimento inteligente via WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Palette, 
  Navigation, 
  Bell, 
  ArrowRightLeft, 
  Building2,
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';
import ThemeSelector from '@/components/ThemeSelector';
import IntegrationsTab from '@/components/IntegrationsTab';
import TransferAgentsTab from '@/components/TransferAgentsTab';
import CompanyBrandingTab from '@/components/CompanyBrandingTab';
import NavigationSettings from '@/components/NavigationSettings';

const Settings = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
            <SettingsIcon className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Central de Configurações
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Personalize e configure seu sistema de atendimento para criar a experiência perfeita para sua equipe e clientes
        </p>
      </div>

      {/* Modern Tabs */}
      <Tabs defaultValue="themes" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-4xl grid-cols-5 h-16 p-1 bg-muted/50 rounded-2xl">
            <TabsTrigger 
              value="themes" 
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-background rounded-xl transition-all duration-200"
            >
              <Palette className="w-5 h-5" />
              <span className="text-xs font-medium">Temas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="branding" 
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-background rounded-xl transition-all duration-200"
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs font-medium">Marca</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-background rounded-xl transition-all duration-200"
            >
              <Database className="w-5 h-5" />
              <span className="text-xs font-medium">Integrações</span>
            </TabsTrigger>
            <TabsTrigger 
              value="navigation" 
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-background rounded-xl transition-all duration-200"
            >
              <Navigation className="w-5 h-5" />
              <span className="text-xs font-medium">Navegação</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transfers" 
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-background rounded-xl transition-all duration-200"
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span className="text-xs font-medium">Transferências</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="themes" className="space-y-6 mt-8">
          <ThemeSelector />
        </TabsContent>

        <TabsContent value="branding" className="space-y-6 mt-8">
          <CompanyBrandingTab />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 mt-8">
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Integrações e APIs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure conexões com bancos de dados, APIs e webhooks para expandir as funcionalidades do sistema
            </p>
          </div>
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6 mt-8">
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10">
                <Navigation className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Configurações de Navegação</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalize a interface e a experiência de navegação do sistema
            </p>
          </div>
          <NavigationSettings />
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6 mt-8">
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                <ArrowRightLeft className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Configurações de Transferência</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gerencie as permissões de transferência dos agentes e configure o comportamento do sistema
            </p>
          </div>
          <TransferAgentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

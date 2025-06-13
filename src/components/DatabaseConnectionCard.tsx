
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database, Zap, Copy, Check } from 'lucide-react';

interface DatabaseConfig {
  name: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  enabled: boolean;
}

interface DatabaseConnectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  config: DatabaseConfig;
  onSave: (config: DatabaseConfig) => void;
  onToggle: (enabled: boolean) => void;
  isConnected?: boolean;
}

const DatabaseConnectionCard = ({ 
  title, 
  description, 
  icon, 
  config, 
  onSave, 
  onToggle,
  isConnected = false 
}: DatabaseConnectionCardProps) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(localConfig);
    toast({
      title: 'Configuração salva',
      description: `Configurações do ${title} foram atualizadas com sucesso.`,
    });
  };

  const handleCopyConfig = () => {
    const configText = `
// Configuração ${title}
Host: ${localConfig.host}
Port: ${localConfig.port}
Database: ${localConfig.database}
Username: ${localConfig.username}
Password: ${localConfig.password}
    `.trim();

    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: 'Configuração copiada',
      description: 'Dados de conexão copiados para a área de transferência.',
    });
  };

  return (
    <Card className="border-2 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{title}</span>
                {isConnected && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Zap className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={localConfig.enabled}
              onCheckedChange={(checked) => {
                setLocalConfig({...localConfig, enabled: checked});
                onToggle(checked);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyConfig}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {localConfig.enabled && (
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${title}-host`}>Host/Servidor</Label>
              <Input
                id={`${title}-host`}
                value={localConfig.host}
                onChange={(e) => setLocalConfig({...localConfig, host: e.target.value})}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${title}-port`}>Porta</Label>
              <Input
                id={`${title}-port`}
                value={localConfig.port}
                onChange={(e) => setLocalConfig({...localConfig, port: e.target.value})}
                placeholder="5432"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${title}-database`}>Nome do Banco</Label>
            <Input
              id={`${title}-database`}
              value={localConfig.database}
              onChange={(e) => setLocalConfig({...localConfig, database: e.target.value})}
              placeholder="femar_atende"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${title}-username`}>Usuário</Label>
              <Input
                id={`${title}-username`}
                value={localConfig.username}
                onChange={(e) => setLocalConfig({...localConfig, username: e.target.value})}
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${title}-password`}>Senha</Label>
              <Input
                id={`${title}-password`}
                type={showPassword ? "text" : "password"}
                value={localConfig.password}
                onChange={(e) => setLocalConfig({...localConfig, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={showPassword}
              onCheckedChange={setShowPassword}
            />
            <Label>Mostrar senha</Label>
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default DatabaseConnectionCard;

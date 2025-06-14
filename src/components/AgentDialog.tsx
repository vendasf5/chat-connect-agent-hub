
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Agent } from '@/types';

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  onSave: (agent: Omit<Agent, 'id' | 'created_at'>) => void;
}

export const AgentDialog = ({ open, onOpenChange, agent, onSave }: AgentDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    extension: '',
    email: '',
    department: 'Atendimento',
    description: '',
    api_url: '',
    webhook_url: '',
    status: 'offline' as Agent['status'],
    skills: [] as string[],
    max_concurrent_chats: 5,
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        extension: agent.extension,
        email: agent.email || '',
        department: agent.department || 'Atendimento',
        description: agent.description,
        api_url: agent.api_url,
        webhook_url: agent.webhook_url || '',
        status: agent.status,
        skills: agent.skills || [],
        max_concurrent_chats: agent.max_concurrent_chats || 5,
      });
    } else {
      setFormData({
        name: '',
        extension: '',
        email: '',
        department: 'Atendimento',
        description: '',
        api_url: '',
        webhook_url: '',
        status: 'offline',
        skills: [],
        max_concurrent_chats: 5,
      });
    }
  }, [agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData({ ...formData, skills });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{agent ? 'Editar Agente' : 'Novo Agente'}</DialogTitle>
          <DialogDescription>
            Configure as informações do agente e suas credenciais de acesso.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="extension">Ramal *</Label>
              <Input
                id="extension"
                value={formData.extension}
                onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Atendimento">Atendimento</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Suporte">Suporte</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api_url">URL da API *</Label>
              <Input
                id="api_url"
                value={formData.api_url}
                onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
                placeholder="https://api.evolution.com/instance1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook_url">URL do Webhook</Label>
              <Input
                id="webhook_url"
                value={formData.webhook_url}
                onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                placeholder="https://hooks.n8n.io/webhook/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades (separadas por vírgula)</Label>
              <Input
                id="skills"
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="vendas, suporte, técnico"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxConcurrentChats">Máx. Conversas Simultâneas</Label>
              <Input
                id="maxConcurrentChats"
                type="number"
                min="1"
                max="20"
                value={formData.max_concurrent_chats}
                onChange={(e) => setFormData({ ...formData, max_concurrent_chats: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {agent ? 'Salvar Alterações' : 'Criar Agente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Agent } from '@/types';

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  onSave: (agent: Omit<Agent, 'id' | 'createdAt'>) => void;
}

export const AgentDialog = ({ open, onOpenChange, agent, onSave }: AgentDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    extension: '',
    status: 'offline' as Agent['status'],
    description: '',
    apiUrl: '',
    webhookUrl: ''
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        extension: agent.extension,
        status: agent.status,
        description: agent.description,
        apiUrl: agent.apiUrl,
        webhookUrl: agent.webhookUrl
      });
    } else {
      setFormData({
        name: '',
        extension: '',
        status: 'offline',
        description: '',
        apiUrl: '',
        webhookUrl: ''
      });
    }
  }, [agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {agent ? 'Editar Agente' : 'Novo Agente'}
          </DialogTitle>
          <DialogDescription>
            Configure as informações do agente para integração com Evolution API e N8N.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Agente</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Agente Vendas"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="extension">Ramal</Label>
              <Input
                id="extension"
                value={formData.extension}
                onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
                placeholder="Ex: 1001"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Agent['status']) => 
              setFormData({ ...formData, status: value })
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="busy">Ocupado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a função deste agente..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiUrl">URL da Evolution API</Label>
            <Input
              id="apiUrl"
              value={formData.apiUrl}
              onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
              placeholder="https://api.evolution.com/instance1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook N8N</Label>
            <Input
              id="webhookUrl"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://hooks.n8n.io/webhook/seu-webhook"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {agent ? 'Salvar' : 'Criar Agente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

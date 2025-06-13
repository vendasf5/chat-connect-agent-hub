
-- Adicionar campos de autenticação para agentes
ALTER TABLE public.agents 
ADD COLUMN email text UNIQUE,
ADD COLUMN password_hash text,
ADD COLUMN last_login timestamp with time zone,
ADD COLUMN is_active boolean DEFAULT true;

-- Criar tabela para sessões de agentes
CREATE TABLE public.agent_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES public.agents(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  is_active boolean DEFAULT true
);

-- Adicionar RLS para agent_sessions
ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;

-- Política para agentes verem apenas suas próprias sessões
CREATE POLICY "Agents can view their own sessions" 
  ON public.agent_sessions 
  FOR ALL 
  USING (agent_id IN (
    SELECT id FROM public.agents WHERE email = auth.jwt() ->> 'email'
  ));

-- Atualizar tabela de conversas para incluir mais campos
ALTER TABLE public.conversations 
ADD COLUMN assigned_at timestamp with time zone DEFAULT now(),
ADD COLUMN priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
ADD COLUMN tags text[],
ADD COLUMN notes text;

-- Criar tabela para mensagens das conversas
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('agent', 'customer', 'system')),
  sender_id text,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'document')),
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS para messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Política para agentes verem mensagens de suas conversas
CREATE POLICY "Agents can view messages from their conversations" 
  ON public.messages 
  FOR ALL 
  USING (conversation_id IN (
    SELECT c.id FROM public.conversations c 
    JOIN public.agents a ON c.agent_id = a.id 
    WHERE a.email = auth.jwt() ->> 'email'
  ));

-- Função para atualizar status do agente automaticamente
CREATE OR REPLACE FUNCTION public.update_agent_status()
RETURNS trigger AS $$
BEGIN
  -- Atualizar status para online quando faz login
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agents 
    SET status = 'online', last_login = now()
    WHERE id = NEW.agent_id;
    RETURN NEW;
  END IF;
  
  -- Atualizar status para offline quando sessão expira ou é removida
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.is_active = false) THEN
    UPDATE public.agents 
    SET status = 'offline'
    WHERE id = COALESCE(OLD.agent_id, NEW.agent_id);
    RETURN COALESCE(OLD, NEW);
  END IF;
  
  RETURN NULL;
END;
$$ language plpgsql;

-- Trigger para atualizar status automaticamente
CREATE TRIGGER agent_status_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.agent_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_agent_status();

-- Adicionar campos para área/departamento dos agentes
ALTER TABLE public.agents 
ADD COLUMN department text DEFAULT 'Atendimento',
ADD COLUMN skills text[] DEFAULT '{}',
ADD COLUMN max_concurrent_chats integer DEFAULT 5;

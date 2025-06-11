
-- Primeiro, vamos criar a tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para configurações de cores/tema
CREATE TABLE public.theme_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  primary_color TEXT NOT NULL DEFAULT '#222.2 47.4% 11.2%',
  secondary_color TEXT NOT NULL DEFAULT '#210 40% 96.1%',
  background_color TEXT NOT NULL DEFAULT '#0 0% 100%',
  foreground_color TEXT NOT NULL DEFAULT '#222.2 84% 4.9%',
  theme_name TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para agentes
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  extension TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
  description TEXT,
  api_url TEXT NOT NULL,
  webhook_url TEXT,
  evolution_instance_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para conversas
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'transferred', 'closed')),
  last_message TEXT,
  transfer_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para configurações de API
CREATE TABLE public.api_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  evolution_api_url TEXT NOT NULL DEFAULT 'https://api.evolution.com',
  evolution_api_key TEXT,
  n8n_webhook_url TEXT NOT NULL DEFAULT 'https://hooks.n8n.io/webhook',
  auto_transfer_timeout INTEGER NOT NULL DEFAULT 300,
  max_queue_size INTEGER NOT NULL DEFAULT 10,
  transfer_message TEXT NOT NULL DEFAULT 'Você será transferido para um atendente humano. Por favor, aguarde...',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para transferências
CREATE TABLE public.transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations NOT NULL,
  from_agent_id UUID REFERENCES public.agents,
  to_agent_id UUID REFERENCES public.agents,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para theme_settings
CREATE POLICY "Users can manage their theme settings" 
  ON public.theme_settings FOR ALL 
  USING (auth.uid() = user_id);

-- Políticas RLS para agents
CREATE POLICY "Users can manage their agents" 
  ON public.agents FOR ALL 
  USING (auth.uid() = user_id);

-- Políticas RLS para conversations
CREATE POLICY "Users can view conversations from their agents" 
  ON public.conversations FOR SELECT 
  USING (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage conversations from their agents" 
  ON public.conversations FOR ALL 
  USING (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid()));

-- Políticas RLS para api_configurations
CREATE POLICY "Users can manage their API configurations" 
  ON public.api_configurations FOR ALL 
  USING (auth.uid() = user_id);

-- Políticas RLS para transfers
CREATE POLICY "Users can view transfers involving their agents" 
  ON public.transfers FOR SELECT 
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage transfers involving their agents" 
  ON public.transfers FOR ALL 
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
    )
  );

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar timestamps automaticamente
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_theme_settings_updated_at BEFORE UPDATE ON public.theme_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_api_configurations_updated_at BEFORE UPDATE ON public.api_configurations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Criar função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  
  INSERT INTO public.theme_settings (user_id)
  VALUES (new.id);
  
  INSERT INTO public.api_configurations (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ language plpgsql security definer;

-- Criar trigger para executar a função quando novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Remover a tabela antiga se existir
DROP TABLE IF EXISTS public.Atende_Femar;

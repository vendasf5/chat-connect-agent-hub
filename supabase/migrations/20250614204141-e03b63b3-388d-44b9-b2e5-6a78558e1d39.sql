
-- Adicionar coluna para controle de transferências dos agentes
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS can_transfer boolean DEFAULT true;

-- Adicionar tabela para configurações de logo da empresa
CREATE TABLE IF NOT EXISTS public.company_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  logo_url text,
  company_name text DEFAULT 'Femar Atende',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS para company_settings
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para company_settings
CREATE POLICY "Users can view their own company settings" 
  ON public.company_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company settings" 
  ON public.company_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company settings" 
  ON public.company_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Adicionar tabela para APIs e Webhooks personalizados
CREATE TABLE IF NOT EXISTS public.custom_integrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL, -- 'api' ou 'webhook'
  url text NOT NULL,
  api_key text,
  headers jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS para custom_integrations
ALTER TABLE public.custom_integrations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para custom_integrations
CREATE POLICY "Users can manage their own integrations" 
  ON public.custom_integrations 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_custom_integrations_updated_at
  BEFORE UPDATE ON public.custom_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar configurações padrão da empresa
CREATE OR REPLACE FUNCTION public.create_default_company_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.company_settings (user_id, company_name)
  VALUES (NEW.id, 'Femar Atende')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger para criar configurações padrão ao criar usuário
DROP TRIGGER IF EXISTS on_auth_user_created_company_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_company_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_company_settings();

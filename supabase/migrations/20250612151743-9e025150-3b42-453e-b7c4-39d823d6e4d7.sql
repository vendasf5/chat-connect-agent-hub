
-- Corrigir a função handle_new_user para não falhar quando name for null
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Inserir perfil com nome padrão se não existir
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'), 
    new.email
  );
  
  -- Inserir configurações de tema padrão
  INSERT INTO public.theme_settings (user_id)
  VALUES (new.id);
  
  -- Inserir configurações de API padrão
  INSERT INTO public.api_configurations (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ language plpgsql security definer;

-- Limpar qualquer dado inconsistente
DELETE FROM public.profiles WHERE name IS NULL OR name = '';
DELETE FROM public.theme_settings WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.api_configurations WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Corrigir a constraint de nome para permitir valores padrão
ALTER TABLE public.profiles ALTER COLUMN name SET DEFAULT 'Usuário';

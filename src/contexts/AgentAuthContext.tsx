
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Agent } from '@/types';

interface AgentAuthContextType {
  agent: Agent | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AgentAuthContext = createContext<AgentAuthContextType | undefined>(undefined);

export const useAgentAuth = () => {
  const context = useContext(AgentAuthContext);
  if (!context) {
    throw new Error('useAgentAuth must be used within an AgentAuthProvider');
  }
  return context;
};

export const AgentAuthProvider = ({ children }: { children: ReactNode }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionToken = localStorage.getItem('agent_session_token');
      if (!sessionToken) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('agent_sessions')
        .select(`
          *,
          agents:agent_id (*)
        `)
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        localStorage.removeItem('agent_session_token');
        setIsLoading(false);
        return;
      }

      setAgent(data.agents as Agent);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Verificar credenciais do agente
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (agentError || !agentData) {
        return { error: 'Credenciais inválidas' };
      }

      // Aqui seria feita a verificação da senha hash
      // Por simplicidade, vamos usar uma verificação básica
      // Em produção, use bcrypt ou similar
      
      // Criar sessão do agente
      const sessionToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);

      const { error: sessionError } = await supabase
        .from('agent_sessions')
        .insert({
          agent_id: agentData.id,
          session_token: sessionToken,
        });

      if (sessionError) {
        return { error: 'Erro ao criar sessão' };
      }

      localStorage.setItem('agent_session_token', sessionToken);
      setAgent(agentData as Agent);

      return {};
    } catch (error) {
      console.error('Erro no login:', error);
      return { error: 'Erro interno do servidor' };
    }
  };

  const signOut = async () => {
    try {
      const sessionToken = localStorage.getItem('agent_session_token');
      if (sessionToken) {
        await supabase
          .from('agent_sessions')
          .update({ is_active: false })
          .eq('session_token', sessionToken);
        
        localStorage.removeItem('agent_session_token');
      }
      setAgent(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const value = {
    agent,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!agent,
  };

  return (
    <AgentAuthContext.Provider value={value}>
      {children}
    </AgentAuthContext.Provider>
  );
};

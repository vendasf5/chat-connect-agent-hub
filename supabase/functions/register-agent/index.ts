
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@2.0.0";
import bcrypt from "npm:bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const supabase = createClient(supabaseUrl, supabaseKey);

interface AgentPayload {
  name: string;
  extension: string;
  email: string;
  api_url: string;
  department?: string;
  description?: string;
  webhook_url?: string;
  skills?: string[];
  max_concurrent_chats?: number;
  password: string;
  mode: "create" | "update_password";
  agent_id?: string;
  trigger_webhook?: boolean;
  webhook_target?: string;
}

serve(async (req: Request) => {
  // Preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload: AgentPayload = await req.json();
    let agentId = payload.agent_id || undefined;
    let agentEmail = payload.email;

    // Hash password
    const password_hash = await bcrypt.hash(payload.password, 10);

    // CREATE AGENT
    if (payload.mode === "create") {
      // Check if email exists
      const { data: existing, error: existingErr } = await supabase
        .from("agents")
        .select("id")
        .eq("email", payload.email)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ error: "Agente já cadastrado." }),
          { status: 409, headers: corsHeaders }
        );
      }

      // Insert agent with all provided info
      const { data: newAgent, error: agentError } = await supabase
        .from("agents")
        .insert({
          name: payload.name,
          extension: payload.extension,
          email: payload.email,
          api_url: payload.api_url,
          department: payload.department || "Atendimento",
          description: payload.description || "",
          webhook_url: payload.webhook_url || "",
          skills: payload.skills || [],
          max_concurrent_chats: payload.max_concurrent_chats ?? 5,
          password_hash,
          is_active: true,
          status: "offline", // por padrão
          user_id: "system", // substitua se desejar associar a um usuário real
        })
        .select()
        .single();

      if (agentError) {
        return new Response(
          JSON.stringify({ error: "Erro inserindo agente: " + agentError.message }),
          { status: 500, headers: corsHeaders }
        );
      }

      agentId = newAgent.id;
    }

    // UPDATE PASSWORD
    if (payload.mode === "update_password" && agentId) {
      const { error: updateError } = await supabase
        .from("agents")
        .update({ password_hash })
        .eq("id", agentId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Erro ao atualizar senha: " + updateError.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // DISPARAR WEBHOOK PARA SYSTEMA EXTERNO SE INFORMADO
    if (payload.trigger_webhook && payload.webhook_target) {
      try {
        await fetch(payload.webhook_target, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: payload.mode,
            email: agentEmail,
            extension: payload.extension,
            name: payload.name,
            time: new Date().toISOString(),
          }),
        });
      } catch (err) {
        // Só log, não interrompe o fluxo principal
        console.error("Falha ao disparar webhook externo:", err);
      }
    }

    // ENVIAR EMAIL PARA AGENTE
    if (resend && agentEmail) {
      try {
        await resend.emails.send({
          from: "Femar Atende <no-reply@femaratende.com>",
          to: [agentEmail],
          subject: "Bem-vindo ao Femar Atende!",
          html: `
            <h2>Olá ${payload.name}!</h2>
            <p>Seu acesso ao sistema Femar Atende foi configurado.</p>
            <p><b>Login:</b> ${agentEmail}<br/><b>Ramal:</b> ${payload.extension}</p>
            <p>Faça login em: <a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}">${supabaseUrl.replace('supabase.co', 'lovable.app')}</a><br/>
            Caso necessário, utilize a opção "esqueceu a senha".</p>
            <hr>
            <small>Não responda este e-mail. Dúvidas: equipe Femar Atende.</small>
          `,
        });
      } catch (mailError) {
        console.error("Erro ao enviar email ao agente:", mailError);
      }
    }

    return new Response(JSON.stringify({ success: true, agent_id: agentId }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 400, headers: corsHeaders }
    );
  }
});

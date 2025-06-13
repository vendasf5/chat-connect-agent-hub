
export interface Agent {
  id: string;
  name: string;
  extension: string;
  status: 'online' | 'offline' | 'busy';
  description: string;
  apiUrl: string;
  webhookUrl: string;
  createdAt: string;
  email?: string;
  password_hash?: string;
  last_login?: string;
  is_active?: boolean;
  department?: string;
  skills?: string[];
  max_concurrent_chats?: number;
}

export interface Conversation {
  id: string;
  agentId: string;
  customerName: string;
  customerPhone: string;
  status: 'active' | 'pending' | 'transferred' | 'closed';
  lastMessage: string;
  timestamp: string;
  assigned_at?: string;
  priority?: 'low' | 'normal' | 'high';
  tags?: string[];
  notes?: string;
  transfer_reason?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'agent' | 'customer' | 'system';
  sender_id?: string;
  content: string;
  message_type?: 'text' | 'image' | 'audio' | 'document';
  metadata?: any;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent';
}

export interface ApiConfig {
  evolutionApiUrl: string;
  evolutionApiKey: string;
  n8nWebhookUrl: string;
}

export interface AgentSession {
  id: string;
  agent_id: string;
  session_token: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

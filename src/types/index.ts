
export interface Agent {
  id: string;
  name: string;
  extension: string;
  status: 'online' | 'offline' | 'busy';
  description: string;
  apiUrl: string;
  webhookUrl: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  customerName: string;
  customerPhone: string;
  status: 'active' | 'pending' | 'transferred' | 'closed';
  lastMessage: string;
  timestamp: string;
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

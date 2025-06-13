
import { useState, useEffect } from 'react';
import { useAgentAuth } from '@/contexts/AgentAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, LogOut, ArrowRight, Phone, Clock } from 'lucide-react';
import { Conversation, Message } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AgentDashboard = () => {
  const { agent, signOut } = useAgentAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (agent) {
      loadConversations();
    }
  }, [agent]);

  const loadConversations = async () => {
    if (!agent) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('agent_id', agent.id)
        .in('status', ['active', 'pending'])
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform database format to Conversation type
      const transformedConversations: Conversation[] = data.map((conv: any) => ({
        id: conv.id,
        agentId: conv.agent_id,
        customerName: conv.customer_name,
        customerPhone: conv.customer_phone,
        status: conv.status,
        lastMessage: conv.last_message,
        timestamp: conv.updated_at,
        assigned_at: conv.assigned_at,
        priority: conv.priority,
        tags: conv.tags,
        notes: conv.notes,
        transfer_reason: conv.transfer_reason,
      }));

      setConversations(transformedConversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform database format to Message type
      const transformedMessages: Message[] = data.map((msg: any) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_type: msg.sender_type as 'agent' | 'customer' | 'system',
        sender_id: msg.sender_id,
        content: msg.content,
        message_type: msg.message_type,
        metadata: msg.metadata,
        created_at: msg.created_at,
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !agent) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_type: 'agent',
          sender_id: agent.id,
          content: newMessage,
          message_type: 'text',
        });

      if (error) throw error;

      // Reload messages
      await loadMessages(selectedConversation.id);
      setNewMessage('');

      toast({
        title: 'Mensagem enviada',
        description: 'Sua mensagem foi enviada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar mensagem.',
        variant: 'destructive',
      });
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Femar Atende</h1>
              <p className="text-sm text-slate-600">Sistema de Atendimento</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {agent?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-slate-900">{agent?.name}</p>
                <p className="text-xs text-slate-600">{agent?.department}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Online
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Conversas Ativas</h2>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {conversations.length} conversas
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversations.map((conversation) => (
                <Card 
                  key={conversation.id}
                  className={`mb-2 cursor-pointer transition-all hover:bg-slate-50 ${
                    selectedConversation?.id === conversation.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-slate-200 text-slate-600">
                            {conversation.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{conversation.customerName}</p>
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Phone className="w-3 h-3" />
                            <span>{conversation.customerPhone}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={conversation.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 truncate mb-2">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(conversation.timestamp).toLocaleTimeString()}</span>
                      </div>
                      {conversation.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">Alta</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {selectedConversation.customerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900">{selectedConversation.customerName}</p>
                      <p className="text-sm text-slate-600">{selectedConversation.customerPhone}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Transferir
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === 'agent' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_type === 'agent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-900 border border-slate-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_type === 'agent' ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="bg-white border-t border-slate-200 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-xl font-medium text-slate-600 mb-2">Selecione uma conversa</p>
                <p className="text-slate-500">Escolha uma conversa da lista para começar o atendimento</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

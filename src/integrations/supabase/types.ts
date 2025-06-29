export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_sessions: {
        Row: {
          agent_id: string | null
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          session_token: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          session_token: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          api_url: string
          can_transfer: boolean | null
          created_at: string
          department: string | null
          description: string | null
          email: string | null
          evolution_instance_id: string | null
          extension: string
          id: string
          is_active: boolean | null
          last_login: string | null
          max_concurrent_chats: number | null
          name: string
          password_hash: string | null
          skills: string[] | null
          status: string
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_url: string
          can_transfer?: boolean | null
          created_at?: string
          department?: string | null
          description?: string | null
          email?: string | null
          evolution_instance_id?: string | null
          extension: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          max_concurrent_chats?: number | null
          name: string
          password_hash?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_url?: string
          can_transfer?: boolean | null
          created_at?: string
          department?: string | null
          description?: string | null
          email?: string | null
          evolution_instance_id?: string | null
          extension?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          max_concurrent_chats?: number | null
          name?: string
          password_hash?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      api_configurations: {
        Row: {
          auto_transfer_timeout: number
          created_at: string
          evolution_api_key: string | null
          evolution_api_url: string
          id: string
          max_queue_size: number
          n8n_webhook_url: string
          transfer_message: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_transfer_timeout?: number
          created_at?: string
          evolution_api_key?: string | null
          evolution_api_url?: string
          id?: string
          max_queue_size?: number
          n8n_webhook_url?: string
          transfer_message?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_transfer_timeout?: number
          created_at?: string
          evolution_api_key?: string | null
          evolution_api_url?: string
          id?: string
          max_queue_size?: number
          n8n_webhook_url?: string
          transfer_message?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Atende_Femar: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          logo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_id: string
          assigned_at: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          last_message: string | null
          notes: string | null
          priority: string | null
          status: string
          tags: string[] | null
          transfer_reason: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          assigned_at?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          last_message?: string | null
          notes?: string | null
          priority?: string | null
          status?: string
          tags?: string[] | null
          transfer_reason?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          assigned_at?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          last_message?: string | null
          notes?: string | null
          priority?: string | null
          status?: string
          tags?: string[] | null
          transfer_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_integrations: {
        Row: {
          api_key: string | null
          created_at: string
          headers: Json | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      theme_settings: {
        Row: {
          background_color: string
          created_at: string
          foreground_color: string
          id: string
          primary_color: string
          secondary_color: string
          theme_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          background_color?: string
          created_at?: string
          foreground_color?: string
          id?: string
          primary_color?: string
          secondary_color?: string
          theme_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          background_color?: string
          created_at?: string
          foreground_color?: string
          id?: string
          primary_color?: string
          secondary_color?: string
          theme_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transfers: {
        Row: {
          completed_at: string | null
          conversation_id: string
          created_at: string
          from_agent_id: string | null
          id: string
          reason: string | null
          status: string
          to_agent_id: string | null
        }
        Insert: {
          completed_at?: string | null
          conversation_id: string
          created_at?: string
          from_agent_id?: string | null
          id?: string
          reason?: string | null
          status?: string
          to_agent_id?: string | null
        }
        Update: {
          completed_at?: string | null
          conversation_id?: string
          created_at?: string
          from_agent_id?: string | null
          id?: string
          reason?: string | null
          status?: string
          to_agent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfers_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_agent_id_fkey"
            columns: ["from_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_agent_id_fkey"
            columns: ["to_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

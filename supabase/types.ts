// Arquivo: src/integrations/supabase/types.ts (versão manual específica)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      canais: {
        Row: {
          id: string
          nome_canal: string
          canal_ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_canal: string
          canal_ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_canal?: string
          canal_ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      entregas: {
        Row: {
          bateria: string
          canal: string | null
          cliente: string
          created_at: string
          data_entrega: string | null
          endereco: string
          entregador: string | null
          forma_pagamento: string
          horario_chegada: string | null
          horario_entrega: string | null
          horario_inicio: string | null
          horario_pedido: string
          id: string
          localizacao_entrega: string | null
          numero: string
          referencia: string | null
          status: "pendente" | "em_andamento" | "finalizada"
          telefone: string
          updated_at: string
          urgente: boolean
          valor: number | null
          veiculo: string | null
          vendedor: string | null
        }
        Insert: {
          bateria: string
          canal?: string | null
          cliente: string
          created_at?: string
          data_entrega?: string | null
          endereco: string
          entregador?: string | null
          forma_pagamento: string
          horario_chegada?: string | null
          horario_entrega?: string | null
          horario_inicio?: string | null
          horario_pedido?: string
          id?: string
          localizacao_entrega?: string | null
          numero: string
          referencia?: string | null
          status?: "pendente" | "em_andamento" | "finalizada"
          telefone: string
          updated_at?: string
          urgente?: boolean
          valor?: number | null
          veiculo?: string | null
          vendedor?: string | null
        }
        Update: {
          bateria?: string
          canal?: string | null
          cliente?: string
          created_at?: string
          data_entrega?: string | null
          endereco?: string
          entregador?: string | null
          forma_pagamento?: string
          horario_chegada?: string | null
          horario_entrega?: string | null
          horario_inicio?: string | null
          horario_pedido?: string
          id?: string
          localizacao_entrega?: string | null
          numero?: string
          referencia?: string | null
          status?: "pendente" | "em_andamento" | "finalizada"
          telefone?: string
          updated_at?: string
          urgente?: boolean
          valor?: number | null
          veiculo?: string | null
          vendedor?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          id: string
          nome: string
          tipo: "vendedora" | "entregador" | "admin"
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          tipo: "vendedora" | "entregador" | "admin"
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          tipo?: "vendedora" | "entregador" | "admin"
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_status: "pendente" | "em_andamento" | "finalizada"
      user_type: "vendedora" | "entregador" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
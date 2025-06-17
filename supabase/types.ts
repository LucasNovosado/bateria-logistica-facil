// Arquivo: src/integrations/supabase/types.ts (atualização)
// Adicione estas definições aos tipos existentes

export type Database = {
  public: {
    Tables: {
      // ... tabelas existentes ...
      
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
          // ... campos existentes ...
          canal: string | null // Nova coluna adicionada
        }
        Insert: {
          // ... campos existentes ...
          canal?: string | null
        }
        Update: {
          // ... campos existentes ...
          canal?: string | null
        }
        Relationships: []
      }
      
      // ... outras tabelas ...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      // ... enums existentes ...
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
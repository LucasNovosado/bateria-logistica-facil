
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Entrega = Database['public']['Tables']['entregas']['Row'];
type EntregaInsert = Database['public']['Tables']['entregas']['Insert'];
type EntregaUpdate = Database['public']['Tables']['entregas']['Update'];

export const useEntregas = () => {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar entregas
  const fetchEntregas = async () => {
    try {
      const { data, error } = await supabase
        .from('entregas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntregas(data || []);
    } catch (error) {
      console.error('Erro ao carregar entregas:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar as entregas.",
        variant: "destructive"
      });
    }
  };

  // Criar nova entrega
  const criarEntrega = async (dadosEntrega: EntregaInsert) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('entregas')
        .insert([dadosEntrega])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "✅ Entrega criada!",
        description: "A entrega foi cadastrada com sucesso.",
      });

      await fetchEntregas();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível criar a entrega.",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar entrega
  const atualizarEntrega = async (id: string, updates: EntregaUpdate) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('entregas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchEntregas();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar entrega:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar a entrega.",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Iniciar entrega
  const iniciarEntrega = async (id: string, entregador: string) => {
    return atualizarEntrega(id, {
      status: 'em_andamento',
      entregador,
      horario_inicio: new Date().toISOString()
    });
  };

  // Finalizar entrega
  const finalizarEntrega = async (id: string, localizacao?: string) => {
    return atualizarEntrega(id, {
      status: 'finalizada',
      horario_chegada: new Date().toISOString(),
      localizacao_entrega: localizacao
    });
  };

  useEffect(() => {
    fetchEntregas();

    // Configurar realtime subscription
    const channel = supabase
      .channel('entregas_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entregas'
        },
        () => {
          fetchEntregas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    entregas,
    loading,
    criarEntrega,
    atualizarEntrega,
    iniciarEntrega,
    finalizarEntrega,
    refetch: fetchEntregas
  };
};

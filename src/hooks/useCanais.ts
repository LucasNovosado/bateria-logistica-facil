// Arquivo: src/hooks/useCanais.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Canal = Database['public']['Tables']['canais']['Row'];
type CanalInsert = Database['public']['Tables']['canais']['Insert'];
type CanalUpdate = Database['public']['Tables']['canais']['Update'];

export const useCanais = () => {
  const [canais, setCanais] = useState<Canal[]>([]);
  const [canaisAtivos, setCanaisAtivos] = useState<Canal[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar todos os canais
  const fetchCanais = async () => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .order('nome_canal', { ascending: true });

      if (error) throw error;
      
      const canaisData = data || [];
      setCanais(canaisData);
      setCanaisAtivos(canaisData.filter(canal => canal.canal_ativo));
    } catch (error) {
      console.error('Erro ao carregar canais:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os canais.",
        variant: "destructive"
      });
    }
  };

  // Carregar apenas canais ativos
  const fetchCanaisAtivos = async () => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .eq('canal_ativo', true)
        .order('nome_canal', { ascending: true });

      if (error) throw error;
      setCanaisAtivos(data || []);
    } catch (error) {
      console.error('Erro ao carregar canais ativos:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os canais ativos.",
        variant: "destructive"
      });
    }
  };

  // Criar novo canal
  const criarCanal = async (dadosCanal: CanalInsert) => {
    setLoading(true);
    try {
      // Verificar se já existe um canal com o mesmo nome
      const { data: canalExistente } = await supabase
        .from('canais')
        .select('id')
        .ilike('nome_canal', dadosCanal.nome_canal)
        .single();

      if (canalExistente) {
        toast({
          title: "⚠️ Canal já existe",
          description: "Já existe um canal com esse nome.",
          variant: "destructive"
        });
        return { data: null, error: 'Canal já existe' };
      }

      const { data, error } = await supabase
        .from('canais')
        .insert([dadosCanal])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "✅ Canal criado!",
        description: `O canal "${dadosCanal.nome_canal}" foi criado com sucesso.`,
      });

      await fetchCanais();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar canal:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível criar o canal.",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar canal
  const atualizarCanal = async (id: string, updates: CanalUpdate) => {
    setLoading(true);
    try {
      // Se está atualizando o nome, verificar se já existe
      if (updates.nome_canal) {
        const { data: canalExistente } = await supabase
          .from('canais')
          .select('id')
          .ilike('nome_canal', updates.nome_canal)
          .neq('id', id)
          .single();

        if (canalExistente) {
          toast({
            title: "⚠️ Nome já existe",
            description: "Já existe um canal com esse nome.",
            variant: "destructive"
          });
          return { data: null, error: 'Nome já existe' };
        }
      }

      const { data, error } = await supabase
        .from('canais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const acao = updates.canal_ativo === false ? 'inativado' : 'atualizado';
      toast({
        title: "✅ Sucesso!",
        description: `Canal ${acao} com sucesso.`,
      });

      await fetchCanais();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar canal:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar o canal.",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Inativar canal (soft delete)
  const inativarCanal = async (id: string) => {
    return atualizarCanal(id, { canal_ativo: false });
  };

  // Ativar canal
  const ativarCanal = async (id: string) => {
    return atualizarCanal(id, { canal_ativo: true });
  };

  // Deletar canal permanentemente (usar com cuidado)
  const deletarCanal = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('canais')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "✅ Canal deletado!",
        description: "O canal foi removido permanentemente.",
      });

      await fetchCanais();
      return { error: null };
    } catch (error) {
      console.error('Erro ao deletar canal:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível deletar o canal.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Buscar canal por ID
  const buscarCanalPorId = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar canal:', error);
      return { data: null, error };
    }
  };

  // Buscar canal por nome
  const buscarCanalPorNome = async (nomeCanal: string) => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .ilike('nome_canal', nomeCanal)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar canal por nome:', error);
      return { data: null, error };
    }
  };

  // Carregar dados ao montar o hook
  useEffect(() => {
    fetchCanais();

    // Configurar realtime subscription
    const channel = supabase
      .channel('canais_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'canais'
        },
        () => {
          fetchCanais();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    // Estados
    canais,
    canaisAtivos,
    loading,

    // Funções principais
    criarCanal,
    atualizarCanal,
    inativarCanal,
    ativarCanal,
    deletarCanal,

    // Funções de busca
    buscarCanalPorId,
    buscarCanalPorNome,

    // Funções de atualização
    refetch: fetchCanais,
    refetchAtivos: fetchCanaisAtivos
  };
};
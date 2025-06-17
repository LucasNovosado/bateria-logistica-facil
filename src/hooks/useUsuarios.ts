
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Usuario = Database['public']['Tables']['usuarios']['Row'];

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome');

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntregadores = () => usuarios.filter(u => u.tipo === 'entregador');
  const getVendedoras = () => usuarios.filter(u => u.tipo === 'vendedora');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    entregadores: getEntregadores(),
    vendedoras: getVendedoras(),
    loading,
    refetch: fetchUsuarios
  };
};

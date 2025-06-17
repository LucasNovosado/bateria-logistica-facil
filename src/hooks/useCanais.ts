import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Canal {
  id: number
  created_at: string
  nomeCanal: string
  canalAtivo: boolean
}

export function useCanais() {
  const [canais, setCanais] = useState<Canal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os canais
  const fetchCanais = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCanais(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Buscar canais ativos
  const fetchCanaisAtivos = async () => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .eq('canalAtivo', true)
        .order('nomeCanal', { ascending: true })

      if (error) throw error
      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar canais ativos')
      return []
    }
  }

  // Criar novo canal
  const createCanal = async (nomeCanal: string, canalAtivo: boolean = true) => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .insert([{ nomeCanal, canalAtivo }])
        .select()

      if (error) throw error
      
      if (data && data.length > 0) {
        setCanais(prev => [data[0], ...prev])
      }
      
      return data?.[0] || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar canal')
      return null
    }
  }

  // Atualizar canal
  const updateCanal = async (id: number, updates: Partial<Omit<Canal, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        setCanais(prev => prev.map(canal => 
          canal.id === id ? { ...canal, ...data[0] } : canal
        ))
      }

      return data?.[0] || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar canal')
      return null
    }
  }

  // Deletar canal
  const deleteCanal = async (id: number) => {
    try {
      const { error } = await supabase
        .from('canais')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCanais(prev => prev.filter(canal => canal.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar canal')
      return false
    }
  }

  // Alternar status ativo/inativo do canal
  const toggleCanalAtivo = async (id: number) => {
    try {
      const canal = canais.find(c => c.id === id)
      if (!canal) throw new Error('Canal não encontrado')

      const { data, error } = await supabase
        .from('canais')
        .update({ canalAtivo: !canal.canalAtivo })
        .eq('id', id)
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        setCanais(prev => prev.map(c => 
          c.id === id ? { ...c, canalAtivo: !c.canalAtivo } : c
        ))
      }

      return data?.[0] || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status do canal')
      return null
    }
  }

  // Buscar canal por ID
  const getCanalById = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar canal')
      return null
    }
  }

  // Buscar canal por nome
  const getCanalByNome = async (nomeCanal: string) => {
    try {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .eq('nomeCanal', nomeCanal)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar canal por nome')
      return null
    }
  }

  useEffect(() => {
    fetchCanais()
  }, [])

  return {
    canais,
    loading,
    error,
    fetchCanais,
    fetchCanaisAtivos,
    createCanal,
    updateCanal,
    deleteCanal,
    toggleCanalAtivo,
    getCanalById,
    getCanalByNome,
    setError // Para limpar erros manualmente
  }
}

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
  const [canaisAtivos, setCanaisAtivos] = useState<Canal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os canais
  const fetchCanais = async () => {
    try {
      setLoading(true)
      console.log('Buscando canais...')
      
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro na query canais:', error)
        throw error
      }
      
      console.log('Dados brutos da query:', data)
      
      // Mapear os dados do banco para a interface
      const canaisData = (data || []).map(canal => ({
        id: canal.id,
        created_at: canal.created_at,
        nomeCanal: canal.nomeCanal || canal.nome_canal || `Canal ${canal.id}`,
        canalAtivo: canal.canalAtivo ?? canal.canal_ativo ?? true
      }))
      
      setCanais(canaisData)
      console.log('Canais processados:', canaisData)
    } catch (err) {
      console.error('Erro ao buscar canais:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Buscar canais ativos
  const fetchCanaisAtivos = async () => {
    try {
      console.log('Buscando canais ativos...')
      
      // Primeira tentativa com canalAtivo
      let { data, error } = await supabase
        .from('canais')
        .select('*')
        .eq('canalAtivo', true)
        .order('id', { ascending: true })

      // Se der erro, tentar com canal_ativo
      if (error) {
        console.log('Tentando com canal_ativo...')
        const result = await supabase
          .from('canais')
          .select('*')
          .eq('canal_ativo', true)
          .order('id', { ascending: true })
        
        data = result.data
        error = result.error
      }

      // Se ainda der erro, buscar todos e filtrar
      if (error || !data) {
        console.log('Buscando todos os canais e filtrando...')
        const result = await supabase
          .from('canais')
          .select('*')
          .order('id', { ascending: true })
        
        if (result.error) throw result.error
        
        // Filtrar apenas os ativos
        data = (result.data || []).filter(canal => 
          canal.canalAtivo === true || 
          canal.canal_ativo === true || 
          canal.canalAtivo !== false
        )
      }

      console.log('Dados brutos canais ativos:', data)
      
      const canaisAtivosData = (data || []).map(canal => ({
        id: canal.id,
        created_at: canal.created_at,
        nomeCanal: canal.nomeCanal || canal.nome_canal || `Canal ${canal.id}`,
        canalAtivo: canal.canalAtivo ?? canal.canal_ativo ?? true
      }))
      
      setCanaisAtivos(canaisAtivosData)
      console.log('Canais ativos processados:', canaisAtivosData)
      return canaisAtivosData
    } catch (err) {
      console.error('Erro ao buscar canais ativos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar canais ativos')
      return []
    }
  }

  // Criar novo canal (alias para createCanal)
  const criarCanal = async (nomeCanal: string, canalAtivo: boolean = true) => {
    return await createCanal(nomeCanal, canalAtivo)
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
        const novoCanal = {
          id: data[0].id,
          created_at: data[0].created_at,
          nomeCanal: data[0].nomeCanal || data[0].nome_canal || '',
          canalAtivo: data[0].canalAtivo ?? data[0].canal_ativo ?? true
        }
        
        setCanais(prev => [novoCanal, ...prev])
        if (novoCanal.canalAtivo) {
          setCanaisAtivos(prev => [...prev, novoCanal])
        }
      }
      
      return data?.[0] || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar canal')
      return null
    }
  }

  // Atualizar canal (alias para updateCanal)
  const atualizarCanal = async (id: number, updates: Partial<Omit<Canal, 'id' | 'created_at'>>) => {
    return await updateCanal(id, updates)
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
        
        // Update canaisAtivos if needed
        if (data[0].canalAtivo) {
          setCanaisAtivos(prev => {
            const exists = prev.some(c => c.id === id)
            if (!exists) {
              return [...prev, data[0]]
            }
            return prev.map(c => c.id === id ? data[0] : c)
          })
        } else {
          setCanaisAtivos(prev => prev.filter(c => c.id !== id))
        }
      }

      return data?.[0] || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar canal')
      return null
    }
  }

  // Deletar canal (alias para deleteCanal)
  const deletarCanal = async (id: number) => {
    return await deleteCanal(id)
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
      setCanaisAtivos(prev => prev.filter(canal => canal.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar canal')
      return false
    }
  }

  // Ativar canal
  const ativarCanal = async (id: number) => {
    return await updateCanal(id, { canalAtivo: true })
  }

  // Inativar canal
  const inativarCanal = async (id: number) => {
    return await updateCanal(id, { canalAtivo: false })
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
        
        if (!canal.canalAtivo) {
          setCanaisAtivos(prev => [...prev, data[0]])
        } else {
          setCanaisAtivos(prev => prev.filter(c => c.id !== id))
        }
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
    fetchCanaisAtivos()
  }, [])

  return {
    canais,
    canaisAtivos,
    loading,
    error,
    fetchCanais,
    fetchCanaisAtivos,
    createCanal,
    criarCanal,
    updateCanal,
    atualizarCanal,
    deleteCanal,
    deletarCanal,
    ativarCanal,
    inativarCanal,
    toggleCanalAtivo,
    getCanalById,
    getCanalByNome,
    setError
  }
}

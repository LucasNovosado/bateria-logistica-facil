
import React, { useState } from 'react';
import { useEntregas } from '@/hooks/useEntregas';
import { useToast } from '@/hooks/use-toast';
import EntregaCard from './EntregaCard';
import RankingEntregadores from './RankingEntregadores';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Plus, 
  RefreshCw,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';

const PainelVendedora = () => {
  const { entregas, loading, atualizarEntrega, refetch } = useEntregas();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Dados mock para o ranking - em produção, isso viria de uma API
  const rankingEntregadores = [
    { nome: 'Carlos Silva', tempoMedio: 45, totalEntregas: 156, posicao: 1 },
    { nome: 'Ana Costa', tempoMedio: 52, totalEntregas: 134, posicao: 2 },
    { nome: 'Pedro Santos', tempoMedio: 58, totalEntregas: 128, posicao: 3 },
    { nome: 'Maria Oliveira', tempoMedio: 61, totalEntregas: 98, posicao: 4 },
    { nome: 'João Ferreira', tempoMedio: 64, totalEntregas: 87, posicao: 5 },
  ];

  const handleEdit = (id: string) => {
    toast({
      title: "✏️ Editar Entrega",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      // Em uma implementação real, você teria uma função deleteEntrega
      // await deleteEntrega(id);
      toast({
        title: "🗑️ Entrega Excluída",
        description: "A entrega foi removida com sucesso.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível excluir a entrega.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const estatisticas = {
    total: entregas.length,
    pendentes: entregas.filter(e => e.status === 'pendente').length,
    emAndamento: entregas.filter(e => e.status === 'em_andamento').length,
    finalizadas: entregas.filter(e => e.status === 'finalizada').length,
  };

  return (
    <div className="space-y-8">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500/30 shadow-lg shadow-blue-500/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-blue-400">{estatisticas.total}</h3>
            <p className="text-sm text-gray-300">Total de Entregas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-500/30 shadow-lg shadow-yellow-500/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400">{estatisticas.pendentes}</h3>
            <p className="text-sm text-gray-300">Pendentes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30 shadow-lg shadow-purple-500/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-purple-400">{estatisticas.emAndamento}</h3>
            <p className="text-sm text-gray-300">Em Andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30 shadow-lg shadow-green-500/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-green-400">{estatisticas.finalizadas}</h3>
            <p className="text-sm text-gray-300">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Lista de Entregas */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-gray-800/50 border-gray-600/50 shadow-xl backdrop-blur-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3 text-xl text-white">
                  <Package className="h-6 w-6 text-cyan-400" />
                  <span>📦 Minhas Entregas</span>
                </CardTitle>
                <div className="flex space-x-3">
                  <Button
                    onClick={refetch}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Entrega
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-gray-400">Carregando entregas...</span>
                </div>
              ) : entregas.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Nenhuma entrega encontrada
                  </h3>
                  <p className="text-gray-500">
                    Crie sua primeira entrega para começar.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entregas.map((entrega) => (
                    <EntregaCard
                      key={entrega.id}
                      entrega={entrega}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ranking de Entregadores */}
        <div className="space-y-6">
          <RankingEntregadores entregadores={rankingEntregadores} />
        </div>
      </div>
    </div>
  );
};

export default PainelVendedora;

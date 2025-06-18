
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FormField, SelectInput } from '@/components/FormField';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEntregas } from '@/hooks/useEntregas';
import { useUsuarios } from '@/hooks/useUsuarios';
import { 
  UserCircle, 
  MapPin, 
  Phone, 
  Battery, 
  DollarSign, 
  Clock,
  AlertCircle,
  PlayCircle,
  CheckCircle,
  Truck
} from 'lucide-react';

const Entregador = () => {
  const { entregas, loading, iniciarEntrega, finalizarEntrega } = useEntregas();
  const { entregadores } = useUsuarios();
  const { toast } = useToast();
  const [selectedEntregador, setSelectedEntregador] = useState('');
  const [localizacaoEntrega, setLocalizacaoEntrega] = useState('');
  const [entregaParaFinalizar, setEntregaParaFinalizar] = useState<string | null>(null);

  const entregasPendentes = entregas.filter(e => e.status === 'pendente');
  const entregasEmAndamento = entregas.filter(e => e.status === 'em_andamento');

  const handleIniciarEntrega = async (entregaId: string) => {
    if (!selectedEntregador) {
      toast({
        title: "⚠️ Entregador necessário",
        description: "Selecione um entregador para iniciar a entrega.",
        variant: "destructive"
      });
      return;
    }

    const result = await iniciarEntrega(entregaId, selectedEntregador);
    if (result.data) {
      toast({
        title: "🚀 Entrega iniciada!",
        description: "A entrega foi iniciada com sucesso.",
      });
    }
  };

  const handleFinalizarEntrega = async (entregaId: string) => {
    const result = await finalizarEntrega(entregaId, localizacaoEntrega);
    if (result.data) {
      toast({
        title: "✅ Entrega finalizada!",
        description: "A entrega foi concluída com sucesso.",
      });
      setEntregaParaFinalizar(null);
      setLocalizacaoEntrega('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50 text-yellow-400';
      case 'em_andamento': return 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-400';
      case 'finalizada': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 text-green-400';
      default: return 'bg-gray-700/50 border-gray-600 text-gray-300';
    }
  };

  const getStatusIcon = (status: string, isUrgent?: boolean) => {
    if (isUrgent) return <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />;
    switch (status) {
      case 'pendente': return <Clock className="h-5 w-5" />;
      case 'em_andamento': return <PlayCircle className="h-5 w-5" />;
      case 'finalizada': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Truck className="h-16 w-16 text-cyan-400 animate-pulse mx-auto mb-4" />
            <p className="text-xl text-gray-300">Carregando entregas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              🚚 Painel do Entregador
            </h1>
            <p className="text-xl text-gray-300">Gerencie entregas pendentes e em andamento</p>
          </div>

          {/* Seletor de Entregador */}
          <Card className="mb-8 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 border-cyan-400/30 shadow-2xl backdrop-blur-lg">
            <div className="flex items-center gap-4 mb-4">
              <Truck className="h-6 w-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-white">Selecionar Entregador</h3>
            </div>
            <FormField label="Entregador">
              <SelectInput
                value={selectedEntregador}
                onChange={setSelectedEntregador}
                options={entregadores.map(e => ({ value: e.nome, label: e.nome }))}
                placeholder="Escolha o entregador"
              />
            </FormField>
          </Card>

          {/* Entregas Pendentes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock className="h-7 w-7 text-yellow-400" />
              Entregas Pendentes ({entregasPendentes.length})
            </h2>
            
            {entregasPendentes.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-700/50">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300">Nenhuma entrega pendente no momento!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entregasPendentes.map((entrega) => (
                  <Card key={entrega.id} className="p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 border-yellow-400/30 shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 hover:scale-105">
                    <div className="space-y-4">
                      {/* Status e Urgência */}
                      <div className="flex items-center justify-between">
                        <Badge className={`px-3 py-1 text-sm font-semibold ${getStatusColor(entrega.status)}`}>
                          {getStatusIcon(entrega.status, entrega.urgente)}
                          <span className="ml-2">{entrega.status.toUpperCase()}</span>
                        </Badge>
                        {entrega.urgente && (
                          <Badge className="bg-red-500/20 border-red-400 text-red-400 animate-pulse">
                            URGENTE
                          </Badge>
                        )}
                      </div>

                      {/* Informações do Cliente */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white">
                          <UserCircle className="h-5 w-5 text-cyan-400" />
                          <span className="font-semibold">{entrega.cliente}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="h-4 w-4 text-green-400" />
                          <span>{entrega.telefone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="h-4 w-4 text-red-400" />
                          <span className="text-sm">{entrega.endereco}, {entrega.numero}</span>
                        </div>
                      </div>

                      {/* Detalhes da Entrega */}
                      <div className="space-y-2 pt-2 border-t border-gray-700">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Battery className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm">{entrega.bateria}</span>
                        </div>
                        {entrega.valor && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-semibold">R$ {entrega.valor.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="text-xs">{new Date(entrega.horario_pedido).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <Button
                        onClick={() => handleIniciarEntrega(entrega.id)}
                        disabled={!selectedEntregador}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlayCircle className="h-5 w-5 mr-2" />
                        Iniciar Entrega
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Entregas em Andamento */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <PlayCircle className="h-7 w-7 text-cyan-400" />
              Entregas em Andamento ({entregasEmAndamento.length})
            </h2>
            
            {entregasEmAndamento.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-700/50">
                <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300">Nenhuma entrega em andamento</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entregasEmAndamento.map((entrega) => (
                  <Card key={entrega.id} className="p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 border-cyan-400/30 shadow-xl hover:shadow-cyan-400/20 transition-all duration-300 hover:scale-105">
                    <div className="space-y-4">
                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <Badge className={`px-3 py-1 text-sm font-semibold ${getStatusColor(entrega.status)}`}>
                          {getStatusIcon(entrega.status)}
                          <span className="ml-2">EM ANDAMENTO</span>
                        </Badge>
                        {entrega.urgente && (
                          <Badge className="bg-red-500/20 border-red-400 text-red-400 animate-pulse">
                            URGENTE
                          </Badge>
                        )}
                      </div>

                      {/* Informações */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white">
                          <UserCircle className="h-5 w-5 text-cyan-400" />
                          <span className="font-semibold">{entrega.cliente}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Truck className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm">{entrega.entregador}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="h-4 w-4 text-red-400" />
                          <span className="text-sm">{entrega.endereco}, {entrega.numero}</span>
                        </div>
                      </div>

                      {/* Campo de Localização */}
                      {entregaParaFinalizar === entrega.id && (
                        <div className="space-y-3 pt-3 border-t border-gray-700">
                          <FormField label="Localização da Entrega (Opcional)">
                            <input
                              type="text"
                              value={localizacaoEntrega}
                              onChange={(e) => setLocalizacaoEntrega(e.target.value)}
                              placeholder="Ex: Portão principal, apartamento 201..."
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            />
                          </FormField>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleFinalizarEntrega(entrega.id)}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-green-400/25 transition-all duration-300"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar
                            </Button>
                            <Button
                              onClick={() => setEntregaParaFinalizar(null)}
                              variant="outline"
                              className="px-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Botão de Finalizar */}
                      {entregaParaFinalizar !== entrega.id && (
                        <Button
                          onClick={() => setEntregaParaFinalizar(entrega.id)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-green-400/25 transition-all duration-300 transform hover:scale-105"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Finalizar Entrega
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Entregador;

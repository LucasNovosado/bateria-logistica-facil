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
  const { toast } = useToast();
  const { entregas, iniciarEntrega, finalizarEntrega, loading } = useEntregas();
  const { entregadores } = useUsuarios();
  const [entregadorSelecionado, setEntregadorSelecionado] = useState('');

  const entregadoresOptions = entregadores.map(e => ({
    value: e.nome,
    label: `👨‍💼 ${e.nome}`
  }));

  const handleIniciarEntrega = async (entregaId: string) => {
    if (!entregadorSelecionado) {
      toast({
        title: "⚠️ Selecione o entregador",
        description: "Por favor, selecione seu nome antes de iniciar a entrega.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await iniciarEntrega(entregaId, entregadorSelecionado);
    
    if (!error) {
      toast({
        title: "🚀 Entrega iniciada!",
        description: "A entrega foi marcada como 'Em Andamento'.",
      });
    }
  };

  const handleFinalizarEntrega = async (entregaId: string) => {
    try {
      // Solicitar geolocalização
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const localizacao = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            
            const { error } = await finalizarEntrega(entregaId, localizacao);
            
            if (!error) {
              const horarioEntrega = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              toast({
                title: "✅ Entrega finalizada!",
                description: `Entrega finalizada às ${horarioEntrega} com localização registrada.`,
              });
            }
          },
          async (error) => {
            console.error('Erro ao obter localização:', error);
            toast({
              title: "⚠️ Erro de localização",
              description: "Não foi possível obter sua localização. A entrega será finalizada sem coordenadas.",
              variant: "destructive"
            });
            
            // Finalizar sem localização
            const { error: dbError } = await finalizarEntrega(entregaId);
            if (!dbError) {
              const horarioEntrega = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              toast({
                title: "✅ Entrega finalizada!",
                description: `Entrega finalizada às ${horarioEntrega}.`,
              });
            }
          }
        );
      } else {
        toast({
          title: "⚠️ Geolocalização indisponível",
          description: "Seu navegador não suporta geolocalização.",
          variant: "destructive"
        });
        
        // Finalizar sem localização
        const { error } = await finalizarEntrega(entregaId);
        if (!error) {
          const horarioEntrega = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          toast({
            title: "✅ Entrega finalizada!",
            description: `Entrega finalizada às ${horarioEntrega}.`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Houve um problema ao finalizar a entrega.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string, urgente: boolean) => {
    switch (status) {
      case 'pendente':
        return (
          <Badge className={`rounded-2xl ${urgente ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white border-0 shadow-lg`}>
            {urgente ? '🚨 URGENTE' : '⏳ Pendente'}
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge className="rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-gray-900 border-0 shadow-lg">
            🚀 Em Andamento
          </Badge>
        );
      case 'finalizada':
        return (
          <Badge className="rounded-2xl bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg">
            ✅ Finalizada
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatarHorario = (timestamp: string | null) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const entregasPendentes = entregas.filter(e => e.status === 'pendente');
  const entregasAndamento = entregas.filter(e => e.status === 'em_andamento');
  const entregasFinalizadas = entregas.filter(e => e.status === 'finalizada');

  return (
    <Layout title="Painel do Entregador">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Seleção do Entregador */}
        <Card className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700">
          <FormField label="Selecione seu nome" icon={<UserCircle className="h-5 w-5" />} required>
            <SelectInput
              value={entregadorSelecionado}
              onChange={setEntregadorSelecionado}
              placeholder="Escolha seu nome"
              options={entregadoresOptions}
            />
          </FormField>
        </Card>

        {/* Entregas Pendentes */}
        {entregasPendentes.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-yellow-400" />
              Entregas Pendentes ({entregasPendentes.length})
            </h3>
            <div className="space-y-4">
              {entregasPendentes.map((entrega) => (
                <Card key={entrega.id} className="p-6 rounded-3xl shadow-2xl bg-gray-800/70 backdrop-blur-lg border-2 border-gray-700 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">{entrega.cliente}</h4>
                        <p className="text-gray-300">Pedido às {formatarHorario(entrega.horario_pedido)}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span className="text-gray-200">{entrega.endereco}, {entrega.numero}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-cyan-400" />
                        <span className="text-gray-200">{entrega.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Battery className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-200">{entrega.bateria}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-gray-200">R$ {entrega.valor?.toFixed(2) || '0,00'} ({entrega.forma_pagamento})</span>
                      </div>
                      {entrega.veiculo && (
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-yellow-400" />
                          <span className="text-gray-200">{entrega.veiculo}</span>
                        </div>
                      )}
                      {entrega.data_entrega && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="text-gray-200">{new Date(entrega.data_entrega).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    {entrega.referencia && (
                      <div className="bg-gray-900/70 p-3 rounded-2xl border border-gray-600">
                        <p className="text-sm text-gray-300">
                          📍 <strong className="text-cyan-400">Referência:</strong> {entrega.referencia}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => handleIniciarEntrega(entrega.id)}
                      disabled={loading || !entregadorSelecionado}
                      className="w-full h-12 text-lg font-semibold rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <PlayCircle className="h-5 w-5 mr-2" />
                      {loading ? 'Iniciando...' : 'Iniciar Entrega'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Entregas em Andamento */}
        {entregasAndamento.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <PlayCircle className="h-6 w-6 mr-2 text-cyan-400" />
              Em Andamento ({entregasAndamento.length})
            </h3>
            <div className="space-y-4">
              {entregasAndamento.map((entrega) => (
                <Card key={entrega.id} className="p-6 rounded-3xl shadow-2xl bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-lg border-2 border-cyan-400/50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">{entrega.cliente}</h4>
                        <p className="text-cyan-300">Iniciado às {formatarHorario(entrega.horario_inicio)}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="bg-gray-900/70 p-4 rounded-2xl border border-cyan-400/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span className="font-medium text-white">{entrega.endereco}, {entrega.numero}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-cyan-400" />
                        <span className="text-gray-300">{entrega.telefone}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFinalizarEntrega(entrega.id)}
                      disabled={loading}
                      className="w-full h-12 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-400 hover:to-yellow-400 text-gray-900 shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {loading ? 'Finalizando...' : 'Finalizar Entrega'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Entregas Finalizadas */}
        {entregasFinalizadas.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
              Finalizadas Hoje ({entregasFinalizadas.length})
            </h3>
            <div className="space-y-4">
              {entregasFinalizadas.slice(0, 5).map((entrega) => (
                <Card key={entrega.id} className="p-6 rounded-3xl shadow-2xl bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-lg border-2 border-green-400/50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">{entrega.cliente}</h4>
                        <p className="text-green-300">Finalizado às {formatarHorario(entrega.horario_chegada)}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span className="text-gray-200">{entrega.endereco}, {entrega.numero}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-gray-200">R$ {entrega.valor?.toFixed(2) || '0,00'}</span>
                      </div>
                    </div>

                    {entrega.localizacao_entrega && (
                      <div className="bg-gray-900/70 p-3 rounded-2xl border border-green-400/30">
                        <p className="text-sm text-gray-300">
                          📍 <strong className="text-green-400">Localização registrada:</strong> {entrega.localizacao_entrega}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {entregas.length === 0 && (
          <Card className="p-12 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700 text-center">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhuma entrega no momento
            </h3>
            <p className="text-gray-400">
              Aguarde novas entregas serem cadastradas.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Entregador;

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
  User, 
  MapPin, 
  Phone, 
  Battery, 
  DollarSign, 
  Clock,
  AlertTriangle,
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
          <Badge className={`rounded-2xl ${urgente ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
            {urgente ? '🚨 URGENTE' : '⏳ Pendente'}
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge className="rounded-2xl bg-blue-500 hover:bg-blue-600 text-white">
            🚀 Em Andamento
          </Badge>
        );
      case 'finalizada':
        return (
          <Badge className="rounded-2xl bg-green-500 hover:bg-green-600 text-white">
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
        <Card className="p-6 rounded-3xl shadow-lg bg-white">
          <FormField label="Selecione seu nome" icon={<User className="h-5 w-5" />} required>
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
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-yellow-500" />
              Entregas Pendentes ({entregasPendentes.length})
            </h3>
            <div className="space-y-4">
              {entregasPendentes.map((entrega) => (
                <Card key={entrega.id} className="p-6 rounded-3xl shadow-lg bg-white">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{entrega.cliente}</h4>
                        <p className="text-slate-600">Pedido às {formatarHorario(entrega.horario_pedido)}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span>{entrega.endereco}, {entrega.numero}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span>{entrega.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Battery className="h-4 w-4 text-slate-500" />
                        <span>{entrega.bateria}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-500" />
                        <span>R$ {entrega.valor?.toFixed(2) || '0,00'} ({entrega.forma_pagamento})</span>
                      </div>
                      {entrega.veiculo && (
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-slate-500" />
                          <span>{entrega.veiculo}</span>
                        </div>
                      )}
                      {entrega.data_entrega && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span>{new Date(entrega.data_entrega).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    {entrega.referencia && (
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-sm text-slate-600">
                          📍 <strong>Referência:</strong> {entrega.referencia}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => handleIniciarEntrega(entrega.id)}
                      disabled={loading || !entregadorSelecionado}
                      className="w-full h-12 text-lg font-semibold rounded-2xl bg-blue-500 hover:bg-blue-600 text-white"
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
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <PlayCircle className="h-6 w-6 mr-2 text-blue-500" />
              Em Andamento ({entregasAndamento.length})
            </h3>
            <div className="space-y-4">
              {entregasAndamento.map((entrega) => (
                <Card key={entrega.id} className="p-6 rounded-3xl shadow-lg bg-blue-50 border-2 border-blue-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{entrega.cliente}</h4>
                        <p className="text-slate-600">Iniciado às {formatarHorario(entrega.horario_inicio)}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="bg-white p-4 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{entrega.endereco}, {entrega.numero}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span>{entrega.telefone}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFinalizarEntrega(entrega.id)}
                      disabled={loading}
                      className="w-full h-12 text-lg font-semibold rounded-2xl bg-green-500 hover:bg-green-600 text-white"
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
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              Finalizadas Hoje ({entregasFinalizadas.length})
            </h3>
            <div className="space-y-4">
              {entregasFinalizadas.slice(0, 5).map((entrega) => (
                <Card key={entrega.id} className="p-6 rounded-3xl shadow-lg bg-green-50 border-2 border-green-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{entrega.cliente}</h4>
                        <p className="text-slate-600">Finalizado às {formatarHorario(entrega.horario_chegada)}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span>{entrega.endereco}, {entrega.numero}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-500" />
                        <span>R$ {entrega.valor?.toFixed(2) || '0,00'}</span>
                      </div>
                    </div>

                    {entrega.localizacao_entrega && (
                      <div className="bg-white p-3 rounded-2xl">
                        <p className="text-sm text-slate-600">
                          📍 <strong>Localização registrada:</strong> {entrega.localizacao_entrega}
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
          <Card className="p-12 rounded-3xl shadow-lg bg-white text-center">
            <Truck className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              Nenhuma entrega no momento
            </h3>
            <p className="text-slate-500">
              Aguarde novas entregas serem cadastradas.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Entregador;

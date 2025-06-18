import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEntregas } from '@/hooks/useEntregas';
import { 
  MapPin, 
  User, 
  Phone, 
  Battery, 
  DollarSign, 
  CreditCard, 
  Truck, 
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  Navigation,
  AlertTriangle,
  Package
} from 'lucide-react';

const Entregador = () => {
  const { toast } = useToast();
  const { entregas, atualizarEntrega, loading } = useEntregas();
  const [entregasDisponiveis, setEntregasDisponiveis] = useState<any[]>([]);
  const [entregaAtual, setEntregaAtual] = useState<any>(null);

  useEffect(() => {
    // Filtrar entregas disponíveis (pendentes e em andamento para este entregador)
    const disponiveis = entregas.filter(e => 
      e.status === 'pendente' || (e.status === 'em_andamento' && e.entregador === 'Entregador Atual')
    );
    setEntregasDisponiveis(disponiveis);
    
    // Verificar se há entrega em andamento
    const emAndamento = entregas.find(e => 
      e.status === 'em_andamento' && e.entregador === 'Entregador Atual'
    );
    setEntregaAtual(emAndamento || null);
  }, [entregas]);

  const iniciarEntrega = async (entrega: any) => {
    const { error } = await atualizarEntrega(entrega.id, {
      status: 'em_andamento',
      entregador: 'Entregador Atual',
      horario_inicio: new Date().toISOString()
    });

    if (!error) {
      setEntregaAtual(entrega);
      toast({
        title: "🚚 Entrega iniciada!",
        description: `Entrega para ${entrega.cliente} foi iniciada.`,
      });
    }
  };

  const finalizarEntrega = async () => {
    if (!entregaAtual) return;

    const { error } = await atualizarEntrega(entregaAtual.id, {
      status: 'entregue',
      horario_chegada: new Date().toISOString()
    });

    if (!error) {
      setEntregaAtual(null);
      toast({
        title: "✅ Entrega finalizada!",
        description: `Entrega para ${entregaAtual.cliente} foi concluída com sucesso.`,
      });
    }
  };

  if (entregaAtual) {
    return (
      <Layout title="Entrega em Andamento">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-orange-500 glow-orange">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-orange-400 flex items-center justify-center gap-3">
                <Truck className="h-8 w-8" />
                🚚 Entrega em Andamento
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-cyan-100">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Endereço</div>
                      <div className="text-sm">{entregaAtual.endereco}, {entregaAtual.numero}</div>
                      {entregaAtual.referencia && (
                        <div className="text-xs text-gray-400">{entregaAtual.referencia}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-cyan-100">
                    <User className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Cliente</div>
                      <div className="text-sm">{entregaAtual.cliente}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-cyan-100">
                    <Phone className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Telefone</div>
                      <div className="text-sm">{entregaAtual.telefone}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-cyan-100">
                    <Battery className="h-5 w-5 text-yellow-400" />
                    <div>
                      <div className="font-semibold">Produto</div>
                      <div className="text-sm">{entregaAtual.bateria}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-cyan-100">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="font-semibold">Valor</div>
                      <div className="text-sm">R$ {entregaAtual.valor || '0,00'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-cyan-100">
                    <CreditCard className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Pagamento</div>
                      <div className="text-sm">{entregaAtual.forma_pagamento}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(entregaAtual.endereco + ', ' + entregaAtual.numero)}`, '_blank')}
                  className="flex-1 h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-lg transition-all duration-300"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  🗺️ Ver no Mapa
                </Button>

                <Button
                  onClick={finalizarEntrega}
                  disabled={loading}
                  className="flex-1 h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg transition-all duration-300"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  ✅ Finalizar Entrega
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Painel do Entregador">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {entregasDisponiveis.length === 0 ? (
            <Card className="p-8 text-center rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700">
              <div className="space-y-4">
                <Package className="h-16 w-16 text-gray-400 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-300">Nenhuma entrega disponível</h3>
                <p className="text-gray-400">Não há entregas pendentes no momento.</p>
              </div>
            </Card>
          ) : (
            entregasDisponiveis.map((entrega) => (
              <Card key={entrega.id} className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700 hover:border-cyan-500 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm font-semibold text-cyan-400">Endereço</span>
                      </div>
                      <div className="text-white">
                        <div>{entrega.endereco}, {entrega.numero}</div>
                        {entrega.referencia && (
                          <div className="text-xs text-gray-400 mt-1">{entrega.referencia}</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm font-semibold text-cyan-400">Cliente</span>
                      </div>
                      <div className="text-white">{entrega.cliente}</div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{entrega.telefone}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-400">Produto</span>
                      </div>
                      <div className="text-white text-sm">{entrega.bateria}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={entrega.urgente ? "destructive" : "secondary"} className="text-xs">
                          {entrega.urgente ? "🚨 URGENTE" : "⏰ Normal"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col gap-3">
                    {entrega.data_entrega && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(entrega.data_entrega).toLocaleDateString('pt-BR')}</span>
                        {entrega.horario_entrega && (
                          <>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{entrega.horario_entrega}</span>
                          </>
                        )}
                      </div>
                    )}
                    
                    <Button
                      onClick={() => iniciarEntrega(entrega)}
                      disabled={loading}
                      className="h-12 px-6 text-sm font-bold rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      🚀 Iniciar Entrega
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Entregador;

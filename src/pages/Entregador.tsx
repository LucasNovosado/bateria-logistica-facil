
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FormField, SelectInput } from '@/components/FormField';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  const [entregadorSelecionado, setEntregadorSelecionado] = useState('');
  const [loading, setLoading] = useState(false);

  // Dados mockados das entregas pendentes
  const [entregas, setEntregas] = useState([
    {
      id: 1,
      cliente: 'João da Silva',
      endereco: 'Rua das Flores, 123',
      referencia: 'Ao lado da padaria',
      telefone: '(43) 99999-9999',
      bateria: '150ah Única Conv',
      valor: 'R$ 560,00',
      pagamento: 'Débito',
      veiculo: 'Caminhão 1113',
      dataHorario: '17/06 às 14:30',
      urgente: true,
      status: 'pendente',
      horarioPedido: '13:45'
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      endereco: 'Av. Brasil, 456',
      referencia: 'Próximo ao posto',
      telefone: '(43) 88888-8888',
      bateria: '100ah Comum',
      valor: 'R$ 380,00',
      pagamento: 'Pix',
      veiculo: 'Van',
      dataHorario: '17/06 às 16:00',
      urgente: false,
      status: 'pendente',
      horarioPedido: '14:20'
    }
  ]);

  const entregadores = [
    { value: 'carlos', label: '👨‍💼 Carlos Silva' },
    { value: 'antonio', label: '👨‍💼 Antônio Costa' },
    { value: 'jose', label: '👨‍💼 José Santos' },
    { value: 'pedro', label: '👨‍💼 Pedro Oliveira' }
  ];

  const iniciarEntrega = async (entregaId: number) => {
    if (!entregadorSelecionado) {
      toast({
        title: "⚠️ Selecione o entregador",
        description: "Por favor, selecione seu nome antes de iniciar a entrega.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simular início da entrega
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEntregas(prev => prev.map(entrega => 
        entrega.id === entregaId 
          ? { ...entrega, status: 'em-andamento', horarioInicio: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }
          : entrega
      ));

      toast({
        title: "🚀 Entrega iniciada!",
        description: "A entrega foi marcada como 'Em Andamento'.",
      });

    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Houve um problema ao iniciar a entrega.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const finalizarEntrega = async (entregaId: number) => {
    setLoading(true);
    
    try {
      // Solicitar geolocalização
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Simular finalização da entrega
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const horarioEntrega = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            setEntregas(prev => prev.map(entrega => 
              entrega.id === entregaId 
                ? { 
                    ...entrega, 
                    status: 'finalizada', 
                    horarioEntrega,
                    localizacao: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                  }
                : entrega
            ));

            toast({
              title: "✅ Entrega finalizada!",
              description: `Entrega finalizada às ${horarioEntrega} com localização registrada.`,
            });
            
            setLoading(false);
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            toast({
              title: "⚠️ Erro de localização",
              description: "Não foi possível obter sua localização. A entrega será finalizada sem coordenadas.",
              variant: "destructive"
            });
            
            // Finalizar sem localização
            const horarioEntrega = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            setEntregas(prev => prev.map(entrega => 
              entrega.id === entregaId 
                ? { ...entrega, status: 'finalizada', horarioEntrega }
                : entrega
            ));
            
            setLoading(false);
          }
        );
      } else {
        toast({
          title: "⚠️ Geolocalização indisponível",
          description: "Seu navegador não suporta geolocalização.",
          variant: "destructive"
        });
        setLoading(false);
      }

    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Houve um problema ao finalizar a entrega.",
        variant: "destructive"
      });
      setLoading(false);
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
      case 'em-andamento':
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

  const entregasPendentes = entregas.filter(e => e.status === 'pendente');
  const entregasAndamento = entregas.filter(e => e.status === 'em-andamento');
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
              options={entregadores}
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
                        <p className="text-slate-600">Pedido às {entrega.horarioPedido}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span>{entrega.endereco}</span>
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
                        <span>{entrega.valor} ({entrega.pagamento})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-slate-500" />
                        <span>{entrega.veiculo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>{entrega.dataHorario}</span>
                      </div>
                    </div>

                    {entrega.referencia && (
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-sm text-slate-600">
                          📍 <strong>Referência:</strong> {entrega.referencia}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => iniciarEntrega(entrega.id)}
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
                        <p className="text-slate-600">Iniciado às {entrega.horarioInicio}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="bg-white p-4 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{entrega.endereco}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span>{entrega.telefone}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => finalizarEntrega(entrega.id)}
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
              {entregasFinalizadas.map((entrega) => (
                <Card key={entrega.id} className="p-6 rounded-3xl shadow-lg bg-green-50 border-2 border-green-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{entrega.cliente}</h4>
                        <p className="text-slate-600">Finalizado às {entrega.horarioEntrega}</p>
                      </div>
                      {getStatusBadge(entrega.status, entrega.urgente)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span>{entrega.endereco}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-500" />
                        <span>{entrega.valor}</span>
                      </div>
                    </div>

                    {entrega.localizacao && (
                      <div className="bg-white p-3 rounded-2xl">
                        <p className="text-sm text-slate-600">
                          📍 <strong>Localização registrada:</strong> {entrega.localizacao}
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

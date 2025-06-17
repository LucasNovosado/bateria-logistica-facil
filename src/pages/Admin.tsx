
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FormField, SelectInput } from '@/components/FormField';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntregas } from '@/hooks/useEntregas';
import { useUsuarios } from '@/hooks/useUsuarios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  LayoutDashboard,
  UserCircle,
  Package,
  CurrencyDollar,
  MapPin
} from 'lucide-react';

const Admin = () => {
  const { entregas } = useEntregas();
  const { entregadores } = useUsuarios();
  const [filtroData, setFiltroData] = useState('hoje');
  const [filtroEntregador, setFiltroEntregador] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const filtrosData = [
    { value: 'hoje', label: '📅 Hoje' },
    { value: 'semana', label: '📅 Esta Semana' },
    { value: 'mes', label: '📅 Este Mês' }
  ];

  const filtrosEntregador = [
    { value: 'todos', label: '👥 Todos os Entregadores' },
    ...entregadores.map(e => ({ value: e.nome, label: `👨‍💼 ${e.nome}` }))
  ];

  const filtrosStatus = [
    { value: 'todos', label: '📋 Todos os Status' },
    { value: 'pendente', label: '⏳ Pendente' },
    { value: 'em_andamento', label: '🚀 Em Andamento' },
    { value: 'finalizada', label: '✅ Finalizada' }
  ];

  // Filtrar entregas
  const entregasFiltradas = entregas.filter(entrega => {
    const hoje = new Date();
    const dataEntrega = new Date(entrega.created_at);
    
    let passaFiltroData = true;
    if (filtroData === 'hoje') {
      passaFiltroData = dataEntrega.toDateString() === hoje.toDateString();
    } else if (filtroData === 'semana') {
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      passaFiltroData = dataEntrega >= inicioSemana;
    } else if (filtroData === 'mes') {
      passaFiltroData = dataEntrega.getMonth() === hoje.getMonth() && 
                      dataEntrega.getFullYear() === hoje.getFullYear();
    }

    const passaFiltroEntregador = filtroEntregador === 'todos' || 
                                 entrega.entregador === filtroEntregador;

    const passaFiltroStatus = filtroStatus === 'todos' || 
                             entrega.status === filtroStatus;

    return passaFiltroData && passaFiltroEntregador && passaFiltroStatus;
  });

  const entregasFinalizadas = entregasFiltradas.filter(e => e.status === 'finalizada');
  const entregasUrgentes = entregasFiltradas.filter(e => e.urgente).length;
  const faturamentoTotal = entregasFiltradas.reduce((acc, e) => acc + (e.valor || 0), 0);

  const temposEntrega = entregasFinalizadas
    .filter(e => e.horario_pedido && e.horario_chegada)
    .map(e => {
      const inicio = new Date(e.horario_pedido).getTime();
      const fim = new Date(e.horario_chegada!).getTime();
      return Math.round((fim - inicio) / (1000 * 60));
    });

  const tempoMedioGeral = temposEntrega.length > 0 
    ? Math.round(temposEntrega.reduce((acc, tempo) => acc + tempo, 0) / temposEntrega.length)
    : 0;

  const dadosTempoEntregador = entregadores.map(entregador => {
    const entregasDoEntregador = entregasFinalizadas.filter(e => e.entregador === entregador.nome);
    const temposDoEntregador = entregasDoEntregador
      .filter(e => e.horario_pedido && e.horario_chegada)
      .map(e => {
        const inicio = new Date(e.horario_pedido).getTime();
        const fim = new Date(e.horario_chegada!).getTime();
        return Math.round((fim - inicio) / (1000 * 60));
      });
    
    const tempoMedio = temposDoEntregador.length > 0 
      ? Math.round(temposDoEntregador.reduce((acc, tempo) => acc + tempo, 0) / temposDoEntregador.length)
      : 0;

    return {
      nome: entregador.nome.split(' ')[0],
      tempo: tempoMedio
    };
  }).filter(item => item.tempo > 0);

  const dadosStatus = [
    { 
      name: 'Finalizadas', 
      value: entregasFiltradas.filter(e => e.status === 'finalizada').length, 
      color: '#10B981' 
    },
    { 
      name: 'Em Andamento', 
      value: entregasFiltradas.filter(e => e.status === 'em_andamento').length, 
      color: '#00E0FF' 
    },
    { 
      name: 'Pendentes', 
      value: entregasFiltradas.filter(e => e.status === 'pendente').length, 
      color: '#FFE600' 
    }
  ];

  const getStatusBadge = (status: string, urgente: boolean) => {
    switch (status) {
      case 'pendente':
        return (
          <Badge className={`rounded-2xl ${urgente ? 'bg-red-500' : 'bg-yellow-500'} text-white border-0`}>
            {urgente ? '🚨 URGENTE' : '⏳ Pendente'}
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge className="rounded-2xl bg-cyan-400 text-gray-900 border-0">
            🚀 Em Andamento
          </Badge>
        );
      case 'finalizada':
        return (
          <Badge className="rounded-2xl bg-green-500 text-white border-0">
            ✅ Finalizada
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatarHorario = (timestamp: string | null) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout title="Painel Administrativo">
      <div className="space-y-8">
        {/* Filtros */}
        <Card className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Período">
              <SelectInput
                value={filtroData}
                onChange={setFiltroData}
                placeholder="Selecione o período"
                options={filtrosData}
              />
            </FormField>
            
            <FormField label="Entregador">
              <SelectInput
                value={filtroEntregador}
                onChange={setFiltroEntregador}
                placeholder="Selecione o entregador"
                options={filtrosEntregador}
              />
            </FormField>
            
            <FormField label="Status">
              <SelectInput
                value={filtroStatus}
                onChange={setFiltroStatus}
                placeholder="Selecione o status"
                options={filtrosStatus}
              />
            </FormField>
          </div>
        </Card>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-cyan-400/50 glow-cyan">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/50">
                <Package className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Total de Entregas</p>
                <p className="text-2xl font-bold text-white">{entregasFiltradas.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-400/50 glow-green">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/50">
                <Clock className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold text-white">{formatarTempo(tempoMedioGeral)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-400/50 glow-yellow">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-400/50">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Entregas Urgentes</p>
                <p className="text-2xl font-bold text-white">{entregasUrgentes}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-2 border-yellow-400/50 glow-yellow">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-yellow-500/20 border border-yellow-400/50">
                <CurrencyDollar className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Faturamento</p>
                <p className="text-2xl font-bold text-white">R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Tempo por Entregador */}
          <Card className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <LayoutDashboard className="h-5 w-5 mr-2 text-cyan-400" />
              Tempo Médio por Entregador
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosTempoEntregador}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="nome" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '1rem',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="tempo" fill="#00E0FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Status */}
          <Card className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Distribuição de Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '1rem',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tabela de Entregas */}
        <Card className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Package className="h-5 w-5 mr-2 text-yellow-400" />
            Entregas Filtradas ({entregasFiltradas.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Endereço</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Entregador</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Pedido</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Chegada</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Tempo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {entregasFiltradas.map((entrega) => {
                  const tempoTotal = entrega.horario_pedido && entrega.horario_chegada
                    ? Math.round((new Date(entrega.horario_chegada).getTime() - new Date(entrega.horario_pedido).getTime()) / (1000 * 60))
                    : null;

                  return (
                    <tr key={entrega.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{entrega.cliente}</p>
                          {entrega.urgente && (
                            <span className="text-xs text-red-400 font-medium">🚨 URGENTE</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{entrega.endereco}, {entrega.numero}</td>
                      <td className="py-4 px-4 text-gray-300">{entrega.entregador || '-'}</td>
                      <td className="py-4 px-4 text-gray-300">{formatarHorario(entrega.horario_pedido)}</td>
                      <td className="py-4 px-4 text-gray-300">{formatarHorario(entrega.horario_chegada)}</td>
                      <td className="py-4 px-4 text-gray-300">
                        {tempoTotal ? formatarTempo(tempoTotal) : '-'}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(entrega.status, entrega.urgente)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Resumo Estatístico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-400/50">
            <div className="text-center">
              <UserCircle className="h-12 w-12 text-orange-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Entregadores Ativos</h4>
              <p className="text-3xl font-bold text-orange-400">{entregadores.length}</p>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border-2 border-teal-400/50">
            <div className="text-center">
              <LayoutDashboard className="h-12 w-12 text-teal-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Taxa de Sucesso</h4>
              <p className="text-3xl font-bold text-teal-400">
                {entregasFiltradas.length > 0 
                  ? Math.round((entregasFinalizadas.length / entregasFiltradas.length) * 100)
                  : 0}%
              </p>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-2 border-indigo-400/50">
            <div className="text-center">
              <Clock className="h-12 w-12 text-indigo-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Melhor Tempo</h4>
              <p className="text-3xl font-bold text-indigo-400">
                {temposEntrega.length > 0 
                  ? formatarTempo(Math.min(...temposEntrega))
                  : '-'
                }
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

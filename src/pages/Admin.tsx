
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
  AlertTriangle, 
  TrendingUp,
  Users,
  Package,
  DollarSign,
  CalendarDays
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
    
    // Filtro por data
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

    // Filtro por entregador
    const passaFiltroEntregador = filtroEntregador === 'todos' || 
                                 entrega.entregador === filtroEntregador;

    // Filtro por status
    const passaFiltroStatus = filtroStatus === 'todos' || 
                             entrega.status === filtroStatus;

    return passaFiltroData && passaFiltroEntregador && passaFiltroStatus;
  });

  // Calcular métricas
  const entregasFinalizadas = entregasFiltradas.filter(e => e.status === 'finalizada');
  const entregasUrgentes = entregasFiltradas.filter(e => e.urgente).length;
  const faturamentoTotal = entregasFiltradas.reduce((acc, e) => acc + (e.valor || 0), 0);

  // Calcular tempo médio
  const temposEntrega = entregasFinalizadas
    .filter(e => e.horario_pedido && e.horario_chegada)
    .map(e => {
      const inicio = new Date(e.horario_pedido).getTime();
      const fim = new Date(e.horario_chegada!).getTime();
      return Math.round((fim - inicio) / (1000 * 60)); // em minutos
    });

  const tempoMedioGeral = temposEntrega.length > 0 
    ? Math.round(temposEntrega.reduce((acc, tempo) => acc + tempo, 0) / temposEntrega.length)
    : 0;

  // Dados para gráficos
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
      nome: entregador.nome.split(' ')[0], // Apenas primeiro nome
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
      color: '#3B82F6' 
    },
    { 
      name: 'Pendentes', 
      value: entregasFiltradas.filter(e => e.status === 'pendente').length, 
      color: '#F59E0B' 
    }
  ];

  const getStatusBadge = (status: string, urgente: boolean) => {
    switch (status) {
      case 'pendente':
        return (
          <Badge className={`rounded-2xl ${urgente ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
            {urgente ? '🚨 URGENTE' : '⏳ Pendente'}
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge className="rounded-2xl bg-blue-500 text-white">
            🚀 Em Andamento
          </Badge>
        );
      case 'finalizada':
        return (
          <Badge className="rounded-2xl bg-green-500 text-white">
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
        <Card className="p-6 rounded-3xl shadow-lg bg-white">
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
          <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-blue-500">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Total de Entregas</p>
                <p className="text-2xl font-bold text-slate-800">{entregasFiltradas.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-green-500">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold text-slate-800">{formatarTempo(tempoMedioGeral)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-red-50 to-red-100 border-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-red-500">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Entregas Urgentes</p>
                <p className="text-2xl font-bold text-slate-800">{entregasUrgentes}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-purple-500">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Faturamento</p>
                <p className="text-2xl font-bold text-slate-800">R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Tempo por Entregador */}
          <Card className="p-6 rounded-3xl shadow-lg bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Tempo Médio por Entregador
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosTempoEntregador}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nome" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '1rem'
                  }}
                />
                <Bar dataKey="tempo" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Status */}
          <Card className="p-6 rounded-3xl shadow-lg bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tabela de Entregas */}
        <Card className="p-6 rounded-3xl shadow-lg bg-white">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-purple-500" />
            Entregas Filtradas ({entregasFiltradas.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Endereço</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Entregador</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Pedido</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Chegada</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Tempo</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {entregasFiltradas.map((entrega) => {
                  const tempoTotal = entrega.horario_pedido && entrega.horario_chegada
                    ? Math.round((new Date(entrega.horario_chegada).getTime() - new Date(entrega.horario_pedido).getTime()) / (1000 * 60))
                    : null;

                  return (
                    <tr key={entrega.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-800">{entrega.cliente}</p>
                          {entrega.urgente && (
                            <span className="text-xs text-red-600 font-medium">🚨 URGENTE</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{entrega.endereco}, {entrega.numero}</td>
                      <td className="py-4 px-4 text-slate-600">{entrega.entregador || '-'}</td>
                      <td className="py-4 px-4 text-slate-600">{formatarHorario(entrega.horario_pedido)}</td>
                      <td className="py-4 px-4 text-slate-600">{formatarHorario(entrega.horario_chegada)}</td>
                      <td className="py-4 px-4 text-slate-600">
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
          <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 border-0">
            <div className="text-center">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Entregadores Ativos</h4>
              <p className="text-3xl font-bold text-orange-600">{entregadores.length}</p>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-teal-50 to-teal-100 border-0">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-teal-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Taxa de Sucesso</h4>
              <p className="text-3xl font-bold text-teal-600">
                {entregasFiltradas.length > 0 
                  ? Math.round((entregasFinalizadas.length / entregasFiltradas.length) * 100)
                  : 0}%
              </p>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 border-0">
            <div className="text-center">
              <Clock className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Melhor Tempo</h4>
              <p className="text-3xl font-bold text-indigo-600">
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

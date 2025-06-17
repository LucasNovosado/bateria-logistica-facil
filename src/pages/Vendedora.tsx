
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FormField, TextInput, SelectInput, CheckboxInput } from '@/components/FormField';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEntregas } from '@/hooks/useEntregas';
import { useUsuarios } from '@/hooks/useUsuarios';
import { 
  MapPin, 
  User, 
  Phone, 
  Battery, 
  DollarSign, 
  CreditCard, 
  Truck, 
  Calendar,
  AlertTriangle,
  Copy,
  CheckCircle
} from 'lucide-react';

const Vendedora = () => {
  const { toast } = useToast();
  const { criarEntrega, loading } = useEntregas();
  const { vendedoras } = useUsuarios();
  const [showComanda, setShowComanda] = useState(false);
  const [comandaData, setComandaData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    endereco: '',
    numero: '',
    referencia: '',
    cliente: '',
    telefone: '',
    bateria: '',
    valor: '',
    forma_pagamento: '',
    veiculo: '',
    data_entrega: '',
    horario_entrega: '',
    urgente: false,
    vendedor: ''
  });

  const formasPagamento = [
    { value: 'debito', label: '💳 Débito' },
    { value: 'credito', label: '💳 Crédito' },
    { value: 'pix', label: '📱 Pix' },
    { value: 'dinheiro', label: '💵 Dinheiro' }
  ];

  const veiculos = [
    { value: 'caminhao-1113', label: '🚛 Caminhão 1113' },
    { value: 'caminhao-608', label: '🚚 Caminhão 608' },
    { value: 'van', label: '🚐 Van' },
    { value: 'moto', label: '🏍️ Moto' }
  ];

  const vendedorasOptions = vendedoras.map(v => ({
    value: v.nome,
    label: `👩‍💼 ${v.nome}`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.endereco || !formData.cliente || !formData.telefone || !formData.bateria) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Preparar dados para inserção
    const entregaData = {
      endereco: formData.endereco,
      numero: formData.numero,
      referencia: formData.referencia || null,
      cliente: formData.cliente,
      telefone: formData.telefone,
      bateria: formData.bateria,
      valor: formData.valor ? parseFloat(formData.valor) : null,
      forma_pagamento: formData.forma_pagamento,
      veiculo: formData.veiculo || null,
      data_entrega: formData.data_entrega || null,
      horario_entrega: formData.horario_entrega || null,
      urgente: formData.urgente,
      vendedor: formData.vendedor || null,
      status: 'pendente' as const
    };

    const { data, error } = await criarEntrega(entregaData);
    
    if (!error && data) {
      setComandaData({ ...formData, ...data });
      setShowComanda(true);
    }
  };

  const gerarComanda = () => {
    if (!comandaData) return '';

    const formatarPagamento = (forma: string) => {
      const opcoes = {
        'debito': 'Débito',
        'credito': 'Crédito', 
        'pix': 'Pix',
        'dinheiro': 'Dinheiro'
      };
      return opcoes[forma as keyof typeof opcoes] || forma;
    };

    const formatarVeiculo = (veiculo: string) => {
      const opcoes = {
        'caminhao-1113': 'Caminhão 1113',
        'caminhao-608': 'Caminhão 608',
        'van': 'Van',
        'moto': 'Moto'
      };
      return opcoes[veiculo as keyof typeof opcoes] || veiculo;
    };

    const dataEntrega = comandaData.data_entrega && comandaData.horario_entrega 
      ? `${new Date(comandaData.data_entrega).toLocaleDateString('pt-BR')} às ${comandaData.horario_entrega}`
      : 'A definir';

    return `📦 Comanda de Entrega
📍 Endereço: ${comandaData.endereco}, nº ${comandaData.numero}${comandaData.referencia ? ` (${comandaData.referencia})` : ''}
👤 Cliente: ${comandaData.cliente}
📱 Telefone: ${comandaData.telefone}
⚡ Bateria: ${comandaData.bateria}
💰 Valor: R$ ${comandaData.valor || '0,00'}
💳 Pagamento: ${formatarPagamento(comandaData.forma_pagamento)}
🚗 Veículo: ${formatarVeiculo(comandaData.veiculo)}
📅 Entrega: ${dataEntrega}
⚠️ Urgente: ${comandaData.urgente ? 'Sim' : 'Não'}
👤 Vendedor: ${comandaData.vendedor || 'Não informado'}`;
  };

  const copiarComanda = async () => {
    try {
      await navigator.clipboard.writeText(gerarComanda());
      toast({
        title: "📋 Comanda copiada!",
        description: "O texto foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao copiar",
        description: "Não foi possível copiar a comanda.",
        variant: "destructive"
      });
    }
  };

  const novaEntrega = () => {
    setFormData({
      endereco: '',
      numero: '',
      referencia: '',
      cliente: '',
      telefone: '',
      bateria: '',
      valor: '',
      forma_pagamento: '',
      veiculo: '',
      data_entrega: '',
      horario_entrega: '',
      urgente: false,
      vendedor: ''
    });
    setShowComanda(false);
    setComandaData(null);
  };

  if (showComanda) {
    return (
      <Layout title="Comanda Gerada">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 rounded-3xl shadow-lg bg-white">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800">
                ✅ Pedido Confirmado!
              </h3>
              
              <div className="bg-slate-50 p-6 rounded-2xl">
                <pre className="text-left text-slate-700 whitespace-pre-wrap font-nunito">
                  {gerarComanda()}
                </pre>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={copiarComanda}
                  className="w-full h-14 text-lg font-semibold rounded-2xl bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Copy className="h-5 w-5 mr-3" />
                  Copiar Comanda
                </Button>
                
                <Button
                  onClick={novaEntrega}
                  variant="outline"
                  className="w-full h-14 text-lg font-semibold rounded-2xl border-slate-300 hover:bg-slate-50"
                >
                  Cadastrar Nova Entrega
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cadastro de Entrega">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 rounded-3xl shadow-lg bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendedor */}
            <FormField label="Vendedor" icon={<User className="h-5 w-5" />}>
              <SelectInput
                value={formData.vendedor}
                onChange={(value) => setFormData(prev => ({ ...prev, vendedor: value }))}
                placeholder="Selecione o vendedor"
                options={vendedorasOptions}
              />
            </FormField>

            {/* Endereço */}
            <FormField label="Endereço de Entrega" icon={<MapPin className="h-5 w-5" />} required>
              <TextInput
                value={formData.endereco}
                onChange={(value) => setFormData(prev => ({ ...prev, endereco: value }))}
                placeholder="Ex: Rua das Flores, 123"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Número" required>
                <TextInput
                  value={formData.numero}
                  onChange={(value) => setFormData(prev => ({ ...prev, numero: value }))}
                  placeholder="123"
                />
              </FormField>
              
              <FormField label="Referência">
                <TextInput
                  value={formData.referencia}
                  onChange={(value) => setFormData(prev => ({ ...prev, referencia: value }))}
                  placeholder="Ao lado da padaria"
                />
              </FormField>
            </div>

            {/* Cliente */}
            <FormField label="Nome do Cliente" icon={<User className="h-5 w-5" />} required>
              <TextInput
                value={formData.cliente}
                onChange={(value) => setFormData(prev => ({ ...prev, cliente: value }))}
                placeholder="João da Silva"
              />
            </FormField>

            <FormField label="Telefone" icon={<Phone className="h-5 w-5" />} required>
              <TextInput
                value={formData.telefone}
                onChange={(value) => setFormData(prev => ({ ...prev, telefone: value }))}
                placeholder="(43) 99999-9999"
                type="tel"
              />
            </FormField>

            {/* Produto */}
            <FormField label="Modelo da Bateria" icon={<Battery className="h-5 w-5" />} required>
              <TextInput
                value={formData.bateria}
                onChange={(value) => setFormData(prev => ({ ...prev, bateria: value }))}
                placeholder="150ah Única Conv base de troca"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Valor" icon={<DollarSign className="h-5 w-5" />}>
                <TextInput
                  value={formData.valor}
                  onChange={(value) => setFormData(prev => ({ ...prev, valor: value }))}
                  placeholder="560,00"
                  type="number"
                  step="0.01"
                />
              </FormField>

              <FormField label="Pagamento" icon={<CreditCard className="h-5 w-5" />}>
                <SelectInput
                  value={formData.forma_pagamento}
                  onChange={(value) => setFormData(prev => ({ ...prev, forma_pagamento: value }))}
                  placeholder="Selecione"
                  options={formasPagamento}
                />
              </FormField>
            </div>

            {/* Logística */}
            <FormField label="Veículo" icon={<Truck className="h-5 w-5" />}>
              <SelectInput
                value={formData.veiculo}
                onChange={(value) => setFormData(prev => ({ ...prev, veiculo: value }))}
                placeholder="Selecione o veículo"
                options={veiculos}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Data Desejada" icon={<Calendar className="h-5 w-5" />}>
                <TextInput
                  value={formData.data_entrega}
                  onChange={(value) => setFormData(prev => ({ ...prev, data_entrega: value }))}
                  type="date"
                />
              </FormField>

              <FormField label="Horário Desejado">
                <TextInput
                  value={formData.horario_entrega}
                  onChange={(value) => setFormData(prev => ({ ...prev, horario_entrega: value }))}
                  type="time"
                />
              </FormField>
            </div>

            {/* Urgente */}
            <FormField label="Configurações" icon={<AlertTriangle className="h-5 w-5" />}>
              <CheckboxInput
                checked={formData.urgente}
                onChange={(checked) => setFormData(prev => ({ ...prev, urgente: checked }))}
                label="🚨 Entrega Urgente"
              />
            </FormField>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 text-xl font-bold rounded-2xl bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? '⏳ Salvando...' : '✅ Confirmar Pedido'}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Vendedora;

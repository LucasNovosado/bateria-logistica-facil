import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FormField, TextInput, SelectInput, CheckboxInput } from '@/components/FormField';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEntregas } from '@/hooks/useEntregas';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useCanais } from '@/hooks/useCanais'; // Hook dos canais
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
  CheckCircle,
  Sparkles,
  Zap // Ícone para canal
} from 'lucide-react';

const Vendedora = () => {
  const { toast } = useToast();
  const { criarEntrega, loading } = useEntregas();
  const { vendedoras } = useUsuarios();
  const { canaisAtivos } = useCanais(); // Hook dos canais com canaisAtivos disponível
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
    vendedor: '',
    canal: '' // Campo para canal
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

  // Opções de canais dinâmicas - usando a propriedade correta
  const canaisOptions = canaisAtivos.map(canal => ({
    value: canal.nomeCanal,
    label: `📢 ${canal.nomeCanal}`
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
      canal: formData.canal || null,
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

    return `🔋 COMANDA DE ENTREGA ⚡
━━━━━━━━━━━━━━━━━━━━━━━━
📍 Endereço: ${comandaData.endereco}, nº ${comandaData.numero}${comandaData.referencia ? ` (${comandaData.referencia})` : ''}
👤 Cliente: ${comandaData.cliente}
📱 Telefone: ${comandaData.telefone}
⚡ Bateria: ${comandaData.bateria}
💰 Valor: R$ ${comandaData.valor || '0,00'}
💳 Pagamento: ${formatarPagamento(comandaData.forma_pagamento)}
🚗 Veículo: ${formatarVeiculo(comandaData.veiculo)}
📅 Entrega: ${dataEntrega}
📢 Canal: ${comandaData.canal || 'Não informado'}
${comandaData.urgente ? '🚨 URGENTE: SIM' : '⏰ Prioridade: Normal'}
👤 Vendedor: ${comandaData.vendedor || 'Não informado'}
━━━━━━━━━━━━━━━━━━━━━━━━`;
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
      vendedor: '',
      canal: ''
    });
    setShowComanda(false);
    setComandaData(null);
  };

  if (showComanda) {
    return (
      <Layout title="Comanda Gerada">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700 glow-green success-ping">
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-green-400 animate-bounce" />
                  <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                🎉 Pedido Confirmado!
              </h3>
              
              <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-600 backdrop-blur-sm">
                <pre className="text-left text-cyan-100 whitespace-pre-wrap font-mono text-sm">
                  {gerarComanda()}
                </pre>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={copiarComanda}
                  className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg glow-cyan transition-all duration-300 transform hover:scale-105"
                >
                  <Copy className="h-6 w-6 mr-3" />
                  📋 Copiar Comanda
                </Button>
                
                <Button
                  onClick={novaEntrega}
                  variant="outline"
                  className="w-full h-16 text-xl font-bold rounded-2xl border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  ✨ Nova Entrega
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
        <Card className="p-8 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700 neon-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendedor e Canal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Vendedor" icon={<User className="h-6 w-6 text-cyan-400" />}>
                <SelectInput
                  value={formData.vendedor}
                  onChange={(value) => setFormData(prev => ({ ...prev, vendedor: value }))}
                  placeholder="Selecione o vendedor"
                  options={vendedorasOptions}
                />
              </FormField>

              <FormField label="Canal de Venda" icon={<Zap className="h-6 w-6 text-yellow-400" />} required>
                <SelectInput
                  value={formData.canal}
                  onChange={(value) => setFormData(prev => ({ ...prev, canal: value }))}
                  placeholder="Selecione o canal"
                  options={canaisOptions}
                />
              </FormField>
            </div>

            {/* Endereço */}
            <FormField label="Endereço de Entrega" icon={<MapPin className="h-6 w-6 text-cyan-400" />} required>
              <TextInput
                value={formData.endereco}
                onChange={(value) => setFormData(prev => ({ ...prev, endereco: value }))}
                placeholder="Ex: Rua das Flores, 123"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-6">
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
            <FormField label="Nome do Cliente" icon={<User className="h-6 w-6 text-cyan-400" />} required>
              <TextInput
                value={formData.cliente}
                onChange={(value) => setFormData(prev => ({ ...prev, cliente: value }))}
                placeholder="João da Silva"
              />
            </FormField>

            <FormField label="Telefone" icon={<Phone className="h-6 w-6 text-cyan-400" />} required>
              <TextInput
                value={formData.telefone}
                onChange={(value) => setFormData(prev => ({ ...prev, telefone: value }))}
                placeholder="(43) 99999-9999"
                type="tel"
              />
            </FormField>

            {/* Produto */}
            <FormField label="Modelo da Bateria" icon={<Battery className="h-6 w-6 text-yellow-400" />} required>
              <TextInput
                value={formData.bateria}
                onChange={(value) => setFormData(prev => ({ ...prev, bateria: value }))}
                placeholder="150ah Única Conv base de troca"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-6">
              <FormField label="Valor" icon={<DollarSign className="h-6 w-6 text-green-400" />}>
                <TextInput
                  value={formData.valor}
                  onChange={(value) => setFormData(prev => ({ ...prev, valor: value }))}
                  placeholder="560,00"
                  type="number"
                />
              </FormField>

              <FormField label="Pagamento" icon={<CreditCard className="h-6 w-6 text-cyan-400" />}>
                <SelectInput
                  value={formData.forma_pagamento}
                  onChange={(value) => setFormData(prev => ({ ...prev, forma_pagamento: value }))}
                  placeholder="Selecione"
                  options={formasPagamento}
                />
              </FormField>
            </div>

            {/* Logística */}
            <FormField label="Veículo" icon={<Truck className="h-6 w-6 text-yellow-400" />}>
              <SelectInput
                value={formData.veiculo}
                onChange={(value) => setFormData(prev => ({ ...prev, veiculo: value }))}
                placeholder="Selecione o veículo"
                options={veiculos}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-6">
              <FormField label="Data Desejada" icon={<Calendar className="h-6 w-6 text-cyan-400" />}>
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
            <FormField label="Configurações" icon={<AlertTriangle className="h-6 w-6 text-red-400" />}>
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
              className="w-full h-18 text-2xl font-bold rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white shadow-2xl glow-green transition-all duration-300 transform hover:scale-105 pulse-glow"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  ⏳ Salvando...
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 mr-3" />
                  ✅ Confirmar Pedido
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Vendedora;

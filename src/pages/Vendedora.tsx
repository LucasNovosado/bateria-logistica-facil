
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FormField, TextInput, SelectInput, CheckboxInput, TextAreaInput } from '@/components/FormField';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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
  const [loading, setLoading] = useState(false);
  const [showComanda, setShowComanda] = useState(false);
  
  const [formData, setFormData] = useState({
    endereco: '',
    numero: '',
    referencia: '',
    nomeCliente: '',
    telefone: '',
    modeloBateria: '',
    valor: '',
    formaPagamento: '',
    veiculo: '',
    dataHorario: '',
    urgente: false
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!formData.endereco || !formData.nomeCliente || !formData.telefone || !formData.modeloBateria) {
        toast({
          title: "⚠️ Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Simular salvamento (aqui você integraria com Supabase)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowComanda(true);
      
      toast({
        title: "✅ Pedido confirmado!",
        description: "A entrega foi cadastrada com sucesso.",
      });

    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Houve um problema ao salvar o pedido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const gerarComanda = () => {
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

    return `📦 Comanda de Entrega
📍 Endereço: ${formData.endereco}, nº ${formData.numero}${formData.referencia ? ` (${formData.referencia})` : ''}
👤 Cliente: ${formData.nomeCliente}
📱 Telefone: ${formData.telefone}
⚡ Bateria: ${formData.modeloBateria}
💰 Valor: R$ ${formData.valor}
💳 Pagamento: ${formatarPagamento(formData.formaPagamento)}
🚗 Veículo: ${formatarVeiculo(formData.veiculo)}
📅 Entrega: ${formData.dataHorario}
⚠️ Urgente: ${formData.urgente ? 'Sim' : 'Não'}`;
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
      nomeCliente: '',
      telefone: '',
      modeloBateria: '',
      valor: '',
      formaPagamento: '',
      veiculo: '',
      dataHorario: '',
      urgente: false
    });
    setShowComanda(false);
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
                value={formData.nomeCliente}
                onChange={(value) => setFormData(prev => ({ ...prev, nomeCliente: value }))}
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
                value={formData.modeloBateria}
                onChange={(value) => setFormData(prev => ({ ...prev, modeloBateria: value }))}
                placeholder="150ah Única Conv base de troca"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Valor" icon={<DollarSign className="h-5 w-5" />}>
                <TextInput
                  value={formData.valor}
                  onChange={(value) => setFormData(prev => ({ ...prev, valor: value }))}
                  placeholder="560,00"
                />
              </FormField>

              <FormField label="Pagamento" icon={<CreditCard className="h-5 w-5" />}>
                <SelectInput
                  value={formData.formaPagamento}
                  onChange={(value) => setFormData(prev => ({ ...prev, formaPagamento: value }))}
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

            <FormField label="Data e Horário Desejado" icon={<Calendar className="h-5 w-5" />}>
              <TextInput
                value={formData.dataHorario}
                onChange={(value) => setFormData(prev => ({ ...prev, dataHorario: value }))}
                placeholder="17/06 às 14:30"
              />
            </FormField>

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

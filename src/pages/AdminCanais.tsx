// Arquivo: src/pages/AdminCanais.tsx

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FormField, TextInput, CheckboxInput } from '@/components/FormField';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCanais } from '@/hooks/useCanais';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  Zap,
  AlertCircle
} from 'lucide-react';

const AdminCanais = () => {
  const { toast } = useToast();
  const { canais, criarCanal, atualizarCanal, inativarCanal, ativarCanal, deletarCanal, loading } = useCanais();
  const [showForm, setShowForm] = useState(false);
  const [editingCanal, setEditingCanal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome_canal: '',
    canal_ativo: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome_canal.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "Por favor, informe o nome do canal.",
        variant: "destructive"
      });
      return;
    }

    if (editingCanal) {
      // Editando canal existente
      const { error } = await atualizarCanal(editingCanal, formData);
      if (!error) {
        setEditingCanal(null);
        setShowForm(false);
        resetForm();
      }
    } else {
      // Criando novo canal
      const { error } = await criarCanal(formData);
      if (!error) {
        setShowForm(false);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome_canal: '',
      canal_ativo: true
    });
  };

  const handleEdit = (canal: any) => {
    setFormData({
      nome_canal: canal.nome_canal,
      canal_ativo: canal.canal_ativo
    });
    setEditingCanal(canal.id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCanal(null);
    setShowForm(false);
    resetForm();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (currentStatus) {
      await inativarCanal(id);
    } else {
      await ativarCanal(id);
    }
  };

  const handleDelete = async (id: string, nomeCanal: string) => {
    if (window.confirm(`Tem certeza que deseja deletar permanentemente o canal "${nomeCanal}"?\n\nEsta ação não pode ser desfeita!`)) {
      await deletarCanal(id);
    }
  };

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? (
      <Badge className="bg-green-500 text-white rounded-2xl">
        ✅ Ativo
      </Badge>
    ) : (
      <Badge className="bg-red-500 text-white rounded-2xl">
        ❌ Inativo
      </Badge>
    );
  };

  return (
    <Layout title="Gerenciamento de Canais">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header com botão de adicionar */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Canais de Venda</h2>
            <p className="text-gray-400">Gerencie os canais disponíveis para as vendedoras</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl h-12 px-6 font-semibold transition-all duration-300 transform hover:scale-105"
            disabled={showForm}
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Canal
          </Button>
        </div>

        {/* Formulário de criação/edição */}
        {showForm && (
          <Card className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-cyan-400/50 glow-cyan">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  {editingCanal ? '✏️ Editar Canal' : '➕ Novo Canal'}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <FormField label="Nome do Canal" icon={<Zap className="h-5 w-5" />} required>
                <TextInput
                  value={formData.nome_canal}
                  onChange={(value) => setFormData(prev => ({ ...prev, nome_canal: value }))}
                  placeholder="Ex: Instagram, Facebook, WhatsApp..."
                />
              </FormField>

              <FormField label="Status" icon={<Eye className="h-5 w-5" />}>
                <CheckboxInput
                  checked={formData.canal_ativo}
                  onChange={(checked) => setFormData(prev => ({ ...prev, canal_ativo: checked }))}
                  label="Canal ativo (disponível para seleção)"
                />
              </FormField>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white rounded-2xl h-12 font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      {editingCanal ? 'Atualizar' : 'Criar Canal'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="px-6 rounded-2xl border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de canais */}
        <Card className="p-6 rounded-3xl shadow-2xl bg-gray-800/50 backdrop-blur-lg border-2 border-gray-700">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            Canais Cadastrados ({canais.length})
          </h3>

          {canais.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Nenhum canal cadastrado</h4>
              <p className="text-gray-400 mb-6">
                Adicione o primeiro canal de venda clicando no botão "Novo Canal" acima.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {canais.map((canal) => (
                <div
                  key={canal.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/50 border border-gray-600 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-400/50">
                      <Zap className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{canal.nome_canal}</h4>
                      <p className="text-sm text-gray-400">
                        Criado em {new Date(canal.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {getStatusBadge(canal.canal_ativo)}
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(canal)}
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                        disabled={loading}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleToggleStatus(canal.id, canal.canal_ativo)}
                        variant="ghost"
                        size="sm"
                        className={`${
                          canal.canal_ativo 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10' 
                            : 'text-green-400 hover:text-green-300 hover:bg-green-400/10'
                        }`}
                        disabled={loading}
                      >
                        {canal.canal_ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        onClick={() => handleDelete(canal.id, canal.nome_canal)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-400/50">
            <div className="text-center">
              <Eye className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Canais Ativos</h4>
              <p className="text-3xl font-bold text-green-400">
                {canais.filter(c => c.canal_ativo).length}
              </p>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-400/50">
            <div className="text-center">
              <EyeOff className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Canais Inativos</h4>
              <p className="text-3xl font-bold text-red-400">
                {canais.filter(c => !c.canal_ativo).length}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCanais;

import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Clock, 
  MapPin, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Truck,
  Package
} from 'lucide-react';

interface EntregaCardProps {
  entrega: {
    id: string;
    cliente: string;
    endereco: string;
    numero: string;
    horario_entrega?: string;
    data_entrega?: string;
    entregador?: string;
    status: 'pendente' | 'em_andamento' | 'finalizada';
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EntregaCard = ({ entrega, onEdit, onDelete }: EntregaCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'finalizada':
        return {
          label: '✅ Entregue',
          variant: 'success' as const,
          icon: <CheckCircle className="h-4 w-4" />,
          glow: 'shadow-green-500/30'
        };
      case 'em_andamento':
        return {
          label: '🚚 Em Andamento',
          variant: 'warning' as const,
          icon: <Truck className="h-4 w-4" />,
          glow: 'shadow-yellow-500/30'
        };
      default:
        return {
          label: '⏳ Pendente',
          variant: 'info' as const,
          icon: <Package className="h-4 w-4" />,
          glow: 'shadow-blue-500/30'
        };
    }
  };

  const statusConfig = getStatusConfig(entrega.status);
  const enderecoResumido = `${entrega.endereco}, ${entrega.numero}`.length > 40 
    ? `${entrega.endereco.substring(0, 30)}...` 
    : `${entrega.endereco}, ${entrega.numero}`;

  const horarioFormatado = entrega.horario_entrega && entrega.data_entrega
    ? `${new Date(entrega.data_entrega).toLocaleDateString('pt-BR')} às ${entrega.horario_entrega}`
    : 'Horário não definido';

  return (
    <Card className={`group relative overflow-hidden bg-gray-800/70 border-2 border-gray-600 hover:border-cyan-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl ${statusConfig.glow} hover:shadow-2xl backdrop-blur-lg`}>
      <CardContent className="p-6 space-y-4">
        {/* Header com Cliente e Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-cyan-500/20 border border-cyan-400/30">
              <User className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {entrega.cliente}
              </h3>
              <p className="text-sm text-gray-400">Cliente</p>
            </div>
          </div>
          
          <Badge 
            variant={statusConfig.variant}
            className="flex items-center space-x-1 px-3 py-1 font-semibold shadow-lg"
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </Badge>
        </div>

        {/* Informações da Entrega */}
        <div className="space-y-3">
          {/* Horário */}
          <div className="flex items-center space-x-3 text-gray-300">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">{horarioFormatado}</span>
          </div>

          {/* Endereço */}
          <div className="flex items-center space-x-3 text-gray-300">
            <MapPin className="h-4 w-4 text-green-400" />
            <span className="text-sm" title={`${entrega.endereco}, ${entrega.numero}`}>
              {enderecoResumido}
            </span>
          </div>

          {/* Entregador */}
          <div className="flex items-center space-x-3 text-gray-300">
            <Truck className="h-4 w-4 text-purple-400" />
            <span className="text-sm">
              {entrega.entregador || 'Entregador não atribuído'}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex space-x-3 pt-4 border-t border-gray-600/50">
          <Button
            onClick={() => onEdit(entrega.id)}
            variant="outline"
            size="sm"
            className="flex-1 bg-blue-500/10 border-blue-400/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300 group/btn"
          >
            <Edit3 className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
            Editar
          </Button>
          
          <Button
            onClick={() => onDelete(entrega.id)}
            variant="outline"
            size="sm"
            className="flex-1 bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300 group/btn"
          >
            <Trash2 className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
            Excluir
          </Button>
        </div>

        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </CardContent>
    </Card>
  );
};

export default EntregaCard;

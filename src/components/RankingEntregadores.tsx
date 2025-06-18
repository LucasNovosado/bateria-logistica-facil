
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Medal, 
  Award, 
  Timer, 
  Crown,
  Zap,
  Target
} from 'lucide-react';

interface EntregadorRanking {
  nome: string;
  tempoMedio: number; // em minutos
  totalEntregas: number;
  posicao: number;
}

interface RankingEntregadoresProps {
  entregadores: EntregadorRanking[];
}

const RankingEntregadores = ({ entregadores }: RankingEntregadoresProps) => {
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getIconePosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCorPosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'from-yellow-400/20 to-amber-500/20 border-yellow-400/50 shadow-yellow-400/30';
      case 2:
        return 'from-gray-300/20 to-gray-400/20 border-gray-300/50 shadow-gray-300/20';
      case 3:
        return 'from-amber-600/20 to-orange-500/20 border-amber-600/50 shadow-amber-600/20';
      default:
        return 'from-gray-600/20 to-gray-700/20 border-gray-500/30 shadow-gray-500/10';
    }
  };

  const getBadgeVariant = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'default';
      case 2:
        return 'secondary';
      case 3:
        return 'warning';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-purple-500/30">
        <CardTitle className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          <div className="p-2 rounded-full bg-purple-500/20 border border-purple-400/30">
            <Trophy className="h-6 w-6 text-purple-400" />
          </div>
          <span>🏆 Ranking de Entregadores</span>
          <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {entregadores.slice(0, 5).map((entregador, index) => (
            <div
              key={entregador.nome}
              className={`relative p-4 rounded-2xl bg-gradient-to-r ${getCorPosicao(entregador.posicao)} border-2 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] group ${
                entregador.posicao === 1 ? 'animate-pulse shadow-2xl' : 'hover:shadow-xl'
              }`}
            >
              {/* Efeito especial para o 1º lugar */}
              {entregador.posicao === 1 && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-amber-400/20 to-yellow-400/10 rounded-2xl animate-pulse" />
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Posição e Ícone */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      entregador.posicao === 1 ? 'bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400/50' :
                      entregador.posicao === 2 ? 'bg-gray-300/20 text-gray-300 border-2 border-gray-300/50' :
                      entregador.posicao === 3 ? 'bg-amber-600/20 text-amber-600 border-2 border-amber-600/50' :
                      'bg-gray-500/20 text-gray-400 border-2 border-gray-500/30'
                    }`}>
                      {entregador.posicao}
                    </div>
                    {getIconePosicao(entregador.posicao)}
                  </div>

                  {/* Nome e Entregas */}
                  <div>
                    <h3 className={`font-bold text-lg ${
                      entregador.posicao === 1 ? 'text-yellow-400' :
                      entregador.posicao === 2 ? 'text-gray-300' :
                      entregador.posicao === 3 ? 'text-amber-600' :
                      'text-white'
                    }`}>
                      {entregador.nome}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {entregador.totalEntregas} entregas realizadas
                    </p>
                  </div>
                </div>

                {/* Tempo e Badge */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <Timer className="h-4 w-4" />
                      <span className="font-bold text-lg">
                        {formatarTempo(entregador.tempoMedio)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">tempo médio</p>
                  </div>

                  <Badge 
                    variant={getBadgeVariant(entregador.posicao)}
                    className={`px-3 py-1 font-bold ${
                      entregador.posicao === 1 ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50 shadow-lg shadow-yellow-400/30' :
                      entregador.posicao === 2 ? 'bg-gray-300/20 text-gray-300 border-gray-300/50' :
                      entregador.posicao === 3 ? 'bg-amber-600/20 text-amber-600 border-amber-600/50' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    #{entregador.posicao}
                  </Badge>
                </div>
              </div>

              {/* Barra de progresso (visual) */}
              <div className="mt-3 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    entregador.posicao === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                    entregador.posicao === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                    entregador.posicao === 3 ? 'bg-gradient-to-r from-amber-600 to-orange-500' :
                    'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}
                  style={{ 
                    width: `${Math.max(20, 100 - (entregador.posicao - 1) * 20)}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer com estatísticas */}
        <div className="mt-6 pt-4 border-t border-gray-600/50 text-center">
          <p className="text-sm text-gray-400">
            🏃‍♂️ Desempenho baseado no tempo médio de entrega
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingEntregadores;

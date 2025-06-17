
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { UserCircle, Truck, ShieldCheck } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const panels = [
    {
      title: 'Vendedora',
      description: 'Cadastrar novas entregas',
      icon: UserCircle,
      path: '/vendedora',
      color: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500',
      bgColor: 'bg-gradient-to-br from-pink-900/30 to-purple-900/30',
      borderColor: 'border-pink-400/50',
      iconColor: 'text-pink-400'
    },
    {
      title: 'Entregador',
      description: 'Gerenciar entregas pendentes',
      icon: Truck,
      path: '/entregador',
      color: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500',
      bgColor: 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30',
      borderColor: 'border-cyan-400/50',
      iconColor: 'text-cyan-400'
    },
    {
      title: 'Administrador',
      description: 'Relatórios e controle geral',
      icon: ShieldCheck,
      path: '/admin',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30',
      borderColor: 'border-yellow-400/50',
      iconColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            🔋 Controle de Entregas
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Sistema de gerenciamento de entregas de baterias
          </p>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {panels.map((panel, index) => {
            const Icon = panel.icon;
            return (
              <Card 
                key={index} 
                className={`p-8 rounded-3xl border-2 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:scale-105 ${panel.bgColor} ${panel.borderColor} hover:shadow-cyan-400/20`}
              >
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-gray-800/50 shadow-lg border border-gray-700">
                      <Icon className={`h-12 w-12 ${panel.iconColor}`} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {panel.title}
                    </h3>
                    <p className="text-gray-300 text-lg">
                      {panel.description}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => navigate(panel.path)}
                    className={`w-full h-14 text-lg font-semibold rounded-2xl ${panel.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 glow-cyan`}
                  >
                    Acessar Painel
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg">
            Sistema desenvolvido para facilitar o controle logístico
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

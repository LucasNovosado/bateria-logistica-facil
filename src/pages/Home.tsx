
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { User, Truck, Shield } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const panels = [
    {
      title: 'Vendedora',
      description: 'Cadastrar novas entregas',
      icon: User,
      path: '/vendedora',
      color: 'bg-pink-500 hover:bg-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500'
    },
    {
      title: 'Entregador',
      description: 'Gerenciar entregas pendentes',
      icon: Truck,
      path: '/entregador',
      color: 'bg-green-500 hover:bg-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      title: 'Administrador',
      description: 'Relatórios e controle geral',
      icon: Shield,
      path: '/admin',
      color: 'bg-purple-500 hover:bg-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🔋 Controle de Entregas
          </h1>
          <p className="text-xl text-slate-600 font-medium">
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
                className={`p-8 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${panel.bgColor} hover:scale-105`}
              >
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-white shadow-md">
                      <Icon className={`h-12 w-12 ${panel.iconColor}`} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      {panel.title}
                    </h3>
                    <p className="text-slate-600 text-lg">
                      {panel.description}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => navigate(panel.path)}
                    className={`w-full h-14 text-lg font-semibold rounded-2xl ${panel.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
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
          <p className="text-slate-500 text-lg">
            Sistema desenvolvido para facilitar o controle logístico
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

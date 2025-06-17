
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowDown, User, Truck, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentRole = () => {
    if (location.pathname.includes('vendedora')) return 'vendedora';
    if (location.pathname.includes('entregador')) return 'entregador';
    if (location.pathname.includes('admin')) return 'admin';
    return '';
  };

  const currentRole = getCurrentRole();

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'vendedora':
        return { icon: User, color: 'bg-pink-500', label: 'Vendedora' };
      case 'entregador':
        return { icon: Truck, color: 'bg-green-500', label: 'Entregador' };
      case 'admin':
        return { icon: Shield, color: 'bg-purple-500', label: 'Admin' };
      default:
        return { icon: User, color: 'bg-blue-500', label: '' };
    }
  };

  const roleConfig = getRoleConfig(currentRole);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-slate-800">🔋 Controle de Entregas</h1>
              {currentRole && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-2xl ${roleConfig.color} text-white`}>
                  <RoleIcon size={16} />
                  <span className="text-sm font-medium">{roleConfig.label}</span>
                </div>
              )}
            </div>
            
            {currentRole && (
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-slate-800 rounded-2xl"
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                Voltar ao Menu
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;

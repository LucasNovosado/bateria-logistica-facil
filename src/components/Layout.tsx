
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
        return { icon: User, color: 'bg-gradient-to-r from-cyan-400 to-blue-500', label: '👩‍💼 Vendedora' };
      case 'entregador':
        return { icon: Truck, color: 'bg-gradient-to-r from-yellow-400 to-orange-500', label: '🚚 Entregador' };
      case 'admin':
        return { icon: Shield, color: 'bg-gradient-to-r from-purple-400 to-pink-500', label: '🛡️ Admin' };
      default:
        return { icon: User, color: 'bg-gradient-to-r from-cyan-400 to-blue-500', label: '' };
    }
  };

  const roleConfig = getRoleConfig(currentRole);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-lg shadow-2xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                ⚡ Bateria Logística
              </h1>
              {currentRole && (
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-2xl ${roleConfig.color} shadow-lg glow-cyan`}>
                  <RoleIcon size={20} className="text-gray-900" />
                  <span className="text-sm font-semibold text-gray-900">{roleConfig.label}</span>
                </div>
              )}
            </div>
            
            {currentRole && (
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-cyan-400 hover:text-yellow-400 hover:bg-gray-700/50 rounded-2xl border border-gray-600 hover:border-cyan-400 transition-all duration-300"
              >
                <ArrowDown className="h-5 w-5 mr-2" />
                Menu Principal
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-yellow-400 rounded-full"></div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;

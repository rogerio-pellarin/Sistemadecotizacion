import React from 'react';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Building,
  Settings,
  History,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout?: () => void;
  currentUser?: { name: string; email: string } | null;
}

export function Sidebar({ currentView, onNavigate, onLogout, currentUser }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotations', label: 'Cotizaciones', icon: FileText },
    { id: 'clients', label: 'Clientes', icon: Building2 },
    { id: 'companies', label: 'Empresas', icon: Building },
    { id: 'resources', label: 'Recursos', icon: Users },
    { id: 'parameters', label: 'Parámetros', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="text-xl font-bold text-gray-900 mb-8">
          Cotización SaaS
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* User info and logout */}
      {currentUser && (
        <div className="p-6 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
          </div>
          {onLogout && (
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Cerrar Sesión
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

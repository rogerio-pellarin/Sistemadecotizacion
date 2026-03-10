import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, TrendingUp, FileText, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/calculations';

interface DashboardProps {
  onNewQuotation: () => void;
  quotations: any[];
}

const mockChartData = [
  { mes: 'Ago', cotizaciones: 12 },
  { mes: 'Sep', cotizaciones: 19 },
  { mes: 'Oct', cotizaciones: 15 },
  { mes: 'Nov', cotizaciones: 22 },
  { mes: 'Dic', cotizaciones: 18 },
  { mes: 'Ene', cotizaciones: 25 },
  { mes: 'Feb', cotizaciones: 28 },
];

export function Dashboard({ onNewQuotation, quotations }: DashboardProps) {
  const totalQuotations = quotations.length;
  const totalUSD = quotations.reduce((sum, q) => {
    const total = q.activityGroups.reduce((s, g) => s + g.activities.reduce((a, act) => a + act.salePrice, 0), 0);
    if (q.currency === 'USD') return sum + total;
    return sum + total / q.trm;
  }, 0);
  const totalCOP = quotations.reduce((sum, q) => {
    const total = q.activityGroups.reduce((s, g) => s + g.activities.reduce((a, act) => a + act.salePrice, 0), 0);
    if (q.currency === 'COP') return sum + total;
    return sum + total * q.trm;
  }, 0);
  const avgTicket = totalQuotations > 0 ? totalCOP / totalQuotations : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sistema de Cotización</h1>
            <p className="text-sm text-gray-500">Mi Empresa SAS</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              JP
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* CTA Button */}
        <div className="mb-8">
          <Button
            onClick={onNewQuotation}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Cotización
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Cotizaciones
              </CardTitle>
              <FileText className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalQuotations}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total USD
              </CardTitle>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(totalUSD, 'USD')}
              </div>
              <p className="text-xs text-gray-500 mt-1">Acumulado 2026</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total COP
              </CardTitle>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(totalCOP, 'COP')}
              </div>
              <p className="text-xs text-gray-500 mt-1">Moneda local</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ticket Medio
              </CardTitle>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(avgTicket, 'COP')}
              </div>
              <p className="text-xs text-gray-500 mt-1">Por cotización</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual de Cotizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cotizaciones"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

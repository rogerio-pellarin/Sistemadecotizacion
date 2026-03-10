import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Plus, Edit, Eye, Copy, Trash2, Search } from 'lucide-react';
import { Quotation } from '../types';
import { formatCurrency } from '../utils/calculations';

interface QuotationListProps {
  quotations: Quotation[];
  onNewQuotation: () => void;
  onEditQuotation: (id: string) => void;
  onViewQuotation: (id: string) => void;
  onDuplicateQuotation: (id: string) => void;
  onDeleteQuotation: (id: string) => void;
}

const statusLabels = {
  draft: 'Borrador',
  sent: 'Enviada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export function QuotationList({
  quotations,
  onNewQuotation,
  onEditQuotation,
  onViewQuotation,
  onDuplicateQuotation,
  onDeleteQuotation,
}: QuotationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrency = filterCurrency === 'all' || q.currency === filterCurrency;
    const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
    return matchesSearch && matchesCurrency && matchesStatus;
  });

  const calculateTotal = (q: Quotation) => {
    const subtotal = q.activityGroups.reduce(
      (sum, g) => sum + g.activities.reduce((s, a) => s + a.salePrice, 0),
      0
    );
    return subtotal;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Cotizaciones</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente, proyecto o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las monedas</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="COP">COP</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="approved">Aprobada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={onNewQuotation} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cotización
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Moneda</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{quotation.code}</TableCell>
                  <TableCell>{quotation.client}</TableCell>
                  <TableCell>{quotation.project}</TableCell>
                  <TableCell>{new Date(quotation.createdAt).toLocaleDateString('es-CO')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{quotation.currency}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(calculateTotal(quotation), quotation.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[quotation.status]}>
                      {statusLabels[quotation.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditQuotation(quotation.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewQuotation(quotation.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateQuotation(quotation.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteQuotation(quotation.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredQuotations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No se encontraron cotizaciones
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { InfoDialog } from './ui/info-dialog';
import { ArrowLeft, Download, Mail, FileSpreadsheet } from 'lucide-react';
import { Quotation } from '../types';
import { formatCurrency, calculateQuotationSummary, estimateDays, calculateGroupSubtotal } from '../utils/calculations';

interface ProposalViewerProps {
  quotation: Quotation;
  onBack: () => void;
}

export function ProposalViewer({ quotation, onBack }: ProposalViewerProps) {
  const [infoDialog, setInfoDialog] = useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: '',
    description: '',
  });

  const summary = calculateQuotationSummary(quotation);
  const totalHours = quotation.activityGroups.reduce(
    (sum, group) => sum + group.activities.reduce((s, a) => s + a.estimatedHours, 0),
    0
  );
  const totalDays = estimateDays(totalHours);

  const handleExportPDF = () => {
    setInfoDialog({
      open: true,
      title: 'Funcionalidad en Desarrollo',
      description: 'La funcionalidad de exportar a PDF estará disponible próximamente.',
    });
  };

  const handleSendEmail = () => {
    setInfoDialog({
      open: true,
      title: 'Funcionalidad en Desarrollo',
      description: 'La funcionalidad de enviar por email estará disponible próximamente.',
    });
  };

  const handleExportExcel = () => {
    setInfoDialog({
      open: true,
      title: 'Funcionalidad en Desarrollo',
      description: 'La funcionalidad de descargar Excel estará disponible próximamente.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Propuesta Final</h1>
              <p className="text-sm text-gray-500 mt-1">{quotation.code}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" onClick={handleSendEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Descargar Excel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <Card className="shadow-lg">
          {/* Document Header */}
          <CardHeader className="border-b bg-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  Sistema de Cotización
                </div>
                <div className="text-sm text-gray-600">
                  <div>Mi Empresa SAS</div>
                  <div>NIT: 900.123.456-7</div>
                  <div>contacto@miempresa.com</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-blue-600 mb-2">
                  {quotation.code}
                </div>
                <div className="text-sm text-gray-600">
                  <div>
                    Fecha: {new Date(quotation.createdAt).toLocaleDateString('es-CO')}
                  </div>
                  <div>Versión: {quotation.version}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Cliente
                  </div>
                  <div className="font-medium text-gray-900">
                    {quotation.clientSnapshot?.name || quotation.client}
                  </div>
                  {quotation.clientSnapshot?.legalName && (
                    <div className="text-xs text-gray-500 mt-1">
                      {quotation.clientSnapshot.legalName}
                    </div>
                  )}
                  {quotation.clientSnapshot?.taxId && (
                    <div className="text-xs text-gray-500">
                      NIT: {quotation.clientSnapshot.taxId}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Proyecto
                  </div>
                  <div className="font-medium text-gray-900">{quotation.project}</div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Activity Groups */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detalle de Actividades
              </h2>

              {quotation.activityGroups.map((group, groupIndex) => {
                const groupSubtotal = calculateGroupSubtotal(group.activities);
                const groupHours = group.activities.reduce((sum, a) => sum + a.estimatedHours, 0);
                const groupDays = estimateDays(groupHours);

                return (
                  <div key={group.id} className="mb-6">
                    {/* Group Header */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 px-4 py-3 mb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{group.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {group.activities.length} actividades · {groupDays} días estimados
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Subtotal del Grupo</div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(groupSubtotal, quotation.currency)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Group Activities */}
                    <table className="w-full mb-4">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[100px]">
                            Código
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Descripción
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-[120px]">
                            Días Est.
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-[150px]">
                            Precio
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.activities.map((activity) => (
                          <tr key={activity.id} className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm font-medium">{activity.code}</td>
                            <td className="px-4 py-3 text-sm">{activity.description}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {estimateDays(activity.estimatedHours)} días
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              {formatCurrency(activity.salePrice, quotation.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal de Actividades</span>
                <span className="font-medium">
                  {formatCurrency(summary.subtotalBase, quotation.currency)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Testing y QA ({quotation.testingFactor}%)</span>
                <span>{formatCurrency(summary.testing, quotation.currency)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Project Management ({quotation.pmFactor}%)
                </span>
                <span>{formatCurrency(summary.pm, quotation.currency)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Margen de Seguridad ({quotation.securityMargin}%)
                </span>
                <span>{formatCurrency(summary.securityMargin, quotation.currency)}</span>
              </div>

              {summary.discount > 0 && (
                <>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(summary.beforeDiscount, quotation.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Descuento Aplicado</span>
                    <span>-{formatCurrency(summary.discount, quotation.currency)}</span>
                  </div>
                </>
              )}

              <div className="border-t-2 border-gray-900 pt-4 mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-semibold text-gray-900">TOTAL</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(summary.totalFinal, quotation.currency)}
                    </div>
                    {quotation.currency === 'COP' && (
                      <div className="text-sm text-gray-500 mt-1">
                        Equivalente: {formatCurrency(summary.totalUSD, 'USD')} (TRM:{' '}
                        {quotation.trm})
                      </div>
                    )}
                    {quotation.currency === 'USD' && (
                      <div className="text-sm text-gray-500 mt-1">
                        Equivalente: {formatCurrency(summary.totalLocal, 'COP')} (TRM:{' '}
                        {quotation.trm})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="mt-8 pt-8 border-t">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Total de grupos:</span>
                  <span className="ml-2 font-medium">{quotation.activityGroups.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total de actividades:</span>
                  <span className="ml-2 font-medium">
                    {quotation.activityGroups.reduce((sum, g) => sum + g.activities.length, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo estimado:</span>
                  <span className="ml-2 font-medium">{totalDays} días hábiles</span>
                </div>
                <div>
                  <span className="text-gray-600">Idioma:</span>
                  <span className="ml-2 font-medium">
                    {quotation.language === 'ES' ? 'Español' : 'English'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Válida hasta:</span>
                  <span className="ml-2 font-medium">
                    {new Date(
                      new Date(quotation.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString('es-CO')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="mt-8 pt-8 border-t text-xs text-gray-500 space-y-2">
              <p>
                <strong>Notas:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Esta cotización es válida por 30 días desde la fecha de emisión.</li>
                <li>
                  Los tiempos estimados son aproximados y pueden variar según la complejidad del
                  proyecto.
                </li>
                <li>
                  El precio incluye todos los factores de testing, project management y margen de
                  seguridad.
                </li>
                <li>Condiciones de pago: 50% al inicio, 50% a la entrega.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Dialog */}
      <InfoDialog
        open={infoDialog.open}
        onOpenChange={(open) => setInfoDialog({ ...infoDialog, open })}
        title={infoDialog.title}
        description={infoDialog.description}
      />
    </div>
  );
}

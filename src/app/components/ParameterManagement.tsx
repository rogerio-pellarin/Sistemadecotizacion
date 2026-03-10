import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Parameters } from '../types';

interface ParameterManagementProps {
  parameters: Parameters;
  onBack: () => void;
  onUpdate: (parameters: Parameters) => void;
}

export function ParameterManagement({
  parameters: initialParameters,
  onBack,
  onUpdate,
}: ParameterManagementProps) {
  const [parameters, setParameters] = useState<Parameters>(initialParameters);

  const handleSave = () => {
    onUpdate(parameters);
  };

  const updateParameter = (field: keyof Parameters, value: number) => {
    setParameters((prev) => ({ ...prev, [field]: value }));
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
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Parámetros</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configura los parámetros globales del sistema
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hours Per Month */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Horas por Mes</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Horas laborales mensuales para calcular el costo por hora de cada rol.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                value={parameters.hoursPerMonth}
                onChange={(e) =>
                  updateParameter('hoursPerMonth', parseFloat(e.target.value) || 0)
                }
              />
              <p className="text-xs text-gray-500 mt-2">Típicamente 160 horas/mes</p>
            </CardContent>
          </Card>

          {/* Benefits Ley 50 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Prestaciones Ley 50 (%)</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Porcentaje de prestaciones sociales para empleados bajo Ley 50 en Colombia.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                max="100"
                value={parameters.benefits50}
                onChange={(e) =>
                  updateParameter('benefits50', parseFloat(e.target.value) || 0)
                }
              />
              <p className="text-xs text-gray-500 mt-2">~50% del salario base</p>
            </CardContent>
          </Card>

          {/* Benefits Integral */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Prestaciones Integral (%)</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Porcentaje de prestaciones para salarios integrales en Colombia.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                max="100"
                value={parameters.benefitsIntegral}
                onChange={(e) =>
                  updateParameter('benefitsIntegral', parseFloat(e.target.value) || 0)
                }
              />
              <p className="text-xs text-gray-500 mt-2">~30% del salario base</p>
            </CardContent>
          </Card>

          {/* Default Security Margin */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Margen Seguridad Default (%)</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Margen de seguridad aplicado por defecto en nuevas cotizaciones para mitigar riesgos.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                max="100"
                value={parameters.defaultSecurityMargin}
                onChange={(e) =>
                  updateParameter('defaultSecurityMargin', parseFloat(e.target.value) || 0)
                }
              />
              <p className="text-xs text-gray-500 mt-2">Porcentaje sobre el subtotal</p>
            </CardContent>
          </Card>

          {/* Default Testing Factor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Factor Testing Default (%)</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Porcentaje de horas dedicadas a testing y QA sobre el total del proyecto.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                max="100"
                value={parameters.defaultTestingFactor}
                onChange={(e) =>
                  updateParameter('defaultTestingFactor', parseFloat(e.target.value) || 0)
                }
              />
              <p className="text-xs text-gray-500 mt-2">Para actividades de QA</p>
            </CardContent>
          </Card>

          {/* Default PM Factor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Factor PM Default (%)</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Porcentaje de horas dedicadas a Project Management sobre el total del proyecto.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                max="100"
                value={parameters.defaultPMFactor}
                onChange={(e) =>
                  updateParameter('defaultPMFactor', parseFloat(e.target.value) || 0)
                }
              />
              <p className="text-xs text-gray-500 mt-2">Gestión del proyecto</p>
            </CardContent>
          </Card>

          {/* Max Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Máximo de Actividades</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Número máximo de actividades permitidas por cotización.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="1"
                value={parameters.maxItems}
                onChange={(e) =>
                  updateParameter('maxItems', parseFloat(e.target.value) || 1)
                }
              />
              <p className="text-xs text-gray-500 mt-2">Límite por cotización</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Guardar Parámetros
          </Button>
        </div>
      </div>
    </div>
  );
}

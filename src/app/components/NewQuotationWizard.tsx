import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClientSelector } from './ClientSelector';
import { ArrowLeft } from 'lucide-react';
import { Currency, Language, DiscountType, Client, IssuingCompany, User } from '../types';

interface NewQuotationWizardProps {
  clients: Client[];
  issuingCompanies: IssuingCompany[];
  currentUser: User;
  onBack: () => void;
  onCreate: (data: QuotationWizardData) => void;
  onCreateClient?: (client: Client) => void;
}

export interface QuotationWizardData {
  issuingCompanyId: string;
  clientId: string;
  client: string; // Legacy field
  project: string;
  language: Language;
  currency: Currency;
  trm: number;
  securityMargin: number;
  testingFactor: number;
  pmFactor: number;
  discountType: DiscountType;
  discountValue: number;
}

export function NewQuotationWizard({ clients, issuingCompanies, currentUser, onBack, onCreate, onCreateClient }: NewQuotationWizardProps) {
  // Auto-select if only one company
  const defaultCompany = issuingCompanies.length === 1 ? issuingCompanies[0].id : '';
  
  const [formData, setFormData] = useState<QuotationWizardData>({
    issuingCompanyId: defaultCompany,
    clientId: '',
    client: '',
    project: '',
    language: issuingCompanies.length === 1 ? issuingCompanies[0].defaultLanguage : 'ES',
    currency: issuingCompanies.length === 1 ? issuingCompanies[0].defaultCurrency : 'COP',
    trm: 4200,
    securityMargin: 15,
    testingFactor: 20,
    pmFactor: 15,
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.issuingCompanyId) {
      alert('Por favor selecciona una empresa emisora');
      return;
    }
    if (!formData.clientId) {
      alert('Por favor selecciona un cliente');
      return;
    }
    onCreate(formData);
  };

  const updateField = (field: keyof QuotationWizardData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectIssuingCompany = (companyId: string) => {
    const company = issuingCompanies.find((ic) => ic.id === companyId);
    if (company) {
      setFormData((prev) => ({
        ...prev,
        issuingCompanyId: companyId,
        language: company.defaultLanguage,
        currency: company.defaultCurrency,
      }));
    }
  };

  const handleSelectClient = (client: Client) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client.id,
      client: client.name,
      language: client.defaultLanguage,
      currency: client.defaultCurrency,
    }));
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
          <h1 className="text-2xl font-semibold text-gray-900">Nueva Cotización</h1>
          <p className="text-sm text-gray-500 mt-1">Paso 1: Información General</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Después podrás crear grupos de actividades y organizarlas con drag-and-drop
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 0: Issuing Company (if multiple) */}
              {issuingCompanies.length > 1 && (
                <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Label htmlFor="issuingCompany">
                    Empresa Emisora <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.issuingCompanyId}
                    onValueChange={handleSelectIssuingCompany}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la empresa que emite la cotización" />
                    </SelectTrigger>
                    <SelectContent>
                      {issuingCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    Esta información aparecerá en la propuesta final
                  </p>
                </div>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ClientSelector
                  clients={clients}
                  selectedClientId={formData.clientId}
                  onSelectClient={handleSelectClient}
                  onCreateClient={onCreateClient}
                />

                <div className="space-y-2">
                  <Label htmlFor="project">Proyecto *</Label>
                  <Input
                    id="project"
                    placeholder="Nombre del proyecto"
                    value={formData.project}
                    onChange={(e) => updateField('project', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value: Language) => updateField('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ES">Español</SelectItem>
                      <SelectItem value="EN">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda de Cotización</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value: Currency) => updateField('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3 - TRM */}
              {formData.currency === 'USD' && (
                <div className="space-y-2">
                  <Label htmlFor="trm">TRM (Tasa de Cambio)</Label>
                  <Input
                    id="trm"
                    type="number"
                    placeholder="4200"
                    value={formData.trm}
                    onChange={(e) => updateField('trm', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">
                    Tasa de conversión de USD a COP
                  </p>
                </div>
              )}

              {/* Row 4 - Factors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="securityMargin">Margen de Seguridad (%)</Label>
                  <Input
                    id="securityMargin"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.securityMargin}
                    onChange={(e) => updateField('securityMargin', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">Margen adicional de riesgo</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testingFactor">Factor Testing (%)</Label>
                  <Input
                    id="testingFactor"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.testingFactor}
                    onChange={(e) => updateField('testingFactor', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">Porcentaje para QA</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pmFactor">Factor PM (%)</Label>
                  <Input
                    id="pmFactor"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.pmFactor}
                    onChange={(e) => updateField('pmFactor', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">Gestión del proyecto</p>
                </div>
              </div>

              {/* Row 5 - Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Tipo de Descuento</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: DiscountType) => updateField('discountType', value)}
                  >
                    <SelectTrigger id="discountType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="fixed">Valor Fijo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">Valor Descuento</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    placeholder={formData.discountType === 'percentage' ? '0 - 100' : '0'}
                    value={formData.discountValue}
                    onChange={(e) => updateField('discountValue', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">
                    {formData.discountType === 'percentage' ? 'Porcentaje de descuento' : 'Monto fijo en COP'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Continuar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

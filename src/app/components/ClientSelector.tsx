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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { Client, Language, Currency } from '../types';
import { toast } from 'sonner';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId?: string;
  onSelectClient: (client: Client) => void;
  onCreateClient?: (client: Client) => void;
}

const countries = [
  { code: 'CO', name: 'Colombia' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'BR', name: 'Brasil' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'EC', name: 'Ecuador' },
];

export function ClientSelector({
  clients,
  selectedClientId,
  onSelectClient,
  onCreateClient,
}: ClientSelectorProps) {
  const [newClientDialog, setNewClientDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    legalName: '',
    taxId: '',
    countryCode: 'CO',
    city: '',
    defaultLanguage: 'ES',
    defaultCurrency: 'COP',
    notes: '',
    isActive: true,
  });

  const activeClients = clients.filter((c) => c.isActive);

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      onSelectClient(client);
    }
  };

  const handleCreateNew = () => {
    if (!formData.name?.trim()) {
      toast.error('El nombre del cliente es obligatorio');
      return;
    }

    const newClient: Client = {
      id: `c${Date.now()}`,
      name: formData.name!,
      legalName: formData.legalName,
      taxId: formData.taxId,
      countryCode: formData.countryCode,
      city: formData.city,
      defaultLanguage: formData.defaultLanguage as Language,
      defaultCurrency: formData.defaultCurrency as Currency,
      notes: formData.notes,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (onCreateClient) {
      onCreateClient(newClient);
    }
    onSelectClient(newClient);
    toast.success('Cliente creado exitosamente');
    setNewClientDialog(false);
    setFormData({
      name: '',
      legalName: '',
      taxId: '',
      countryCode: 'CO',
      city: '',
      defaultLanguage: 'ES',
      defaultCurrency: 'COP',
      notes: '',
      isActive: true,
    });
  };

  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="client">
          Cliente <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={selectedClientId} onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {activeClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                    {client.city && ` - ${client.city}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setNewClientDialog(true)}
            className="flex-shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* New Client Dialog */}
      <Dialog open={newClientDialog} onOpenChange={setNewClientDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Completa los datos del nuevo cliente. Podrás agregar contactos más tarde.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Cliente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre comercial"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalName">Razón Social</Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  placeholder="Razón social completa"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">NIT / Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="900123456-7"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryCode">País</Label>
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Medellín, Bogotá, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Idioma por Defecto</Label>
                <Select
                  value={formData.defaultLanguage}
                  onValueChange={(value) =>
                    setFormData({ ...formData, defaultLanguage: value as Language })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ES">Español</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Moneda por Defecto</Label>
                <Select
                  value={formData.defaultCurrency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, defaultCurrency: value as Currency })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                    <SelectItem value="USD">USD - Dólar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionales sobre el cliente..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewClientDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
              Crear Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

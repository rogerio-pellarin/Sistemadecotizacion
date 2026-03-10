import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ConfirmDialog } from './ui/confirm-dialog';
import { Building2, Plus, Pencil, Trash2, Search, Users, Mail, Phone, User, Star } from 'lucide-react';
import { Client, ClientContact, Language, Currency } from '../types';
import { toast } from 'sonner';

interface ClientManagementProps {
  clients: Client[];
  contacts: ClientContact[];
  onUpdateClients: (clients: Client[]) => void;
  onUpdateContacts: (contacts: ClientContact[]) => void;
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

export function ClientManagement({
  clients,
  contacts,
  onUpdateClients,
  onUpdateContacts,
}: ClientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialog, setEditDialog] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null,
  });
  const [contactDialog, setContactDialog] = useState<{
    open: boolean;
    contact: ClientContact | null;
    clientId: string | null;
  }>({
    open: false,
    contact: null,
    clientId: null,
  });
  const [contactsListDialog, setContactsListDialog] = useState<{ open: boolean; clientId: string | null }>({
    open: false,
    clientId: null,
  });
  const [deleteClientDialog, setDeleteClientDialog] = useState<{ open: boolean; clientId: string | null }>({
    open: false,
    clientId: null,
  });
  const [deleteContactDialog, setDeleteContactDialog] = useState<{
    open: boolean;
    contactId: string | null;
  }>({
    open: false,
    contactId: null,
  });

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

  const [contactFormData, setContactFormData] = useState<Partial<ClientContact>>({
    name: '',
    email: '',
    phone: '',
    isPrimary: false,
    isActive: true,
  });

  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.legalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNew = () => {
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
    setEditingClientId(null);
    setEditDialog({ open: true, client: null });
  };

  const handleOpenEdit = (client: Client) => {
    setFormData(client);
    setEditingClientId(client.id);
    setEditDialog({ open: true, client });
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast.error('El nombre del cliente es obligatorio');
      return;
    }

    if (editDialog.client) {
      // Update existing
      const updated = clients.map((c) =>
        c.id === editDialog.client!.id
          ? {
              ...editDialog.client!,
              ...formData,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : c
      );
      onUpdateClients(updated);
      toast.success('Cliente actualizado exitosamente');
    } else {
      // Create new
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
        isActive: formData.isActive!,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateClients([...clients, newClient]);
      setEditingClientId(newClient.id);
      toast.success('Cliente creado exitosamente');
    }

    setEditDialog({ open: false, client: null });
  };

  const handleDeleteClient = (clientId: string) => {
    setDeleteClientDialog({ open: true, clientId });
  };

  const confirmDeleteClient = () => {
    if (deleteClientDialog.clientId) {
      const updated = clients.map((c) =>
        c.id === deleteClientDialog.clientId ? { ...c, isActive: false } : c
      );
      onUpdateClients(updated);
      toast.success('Cliente desactivado');
    }
  };

  // Contact Management
  const getClientContacts = (clientId: string) => {
    return contacts.filter((c) => c.clientId === clientId && c.isActive);
  };

  const handleOpenNewContact = (clientId: string) => {
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      isPrimary: false,
      isActive: true,
    });
    setContactDialog({ open: true, contact: null, clientId });
  };

  const handleOpenEditContact = (contact: ClientContact) => {
    setContactFormData(contact);
    setContactDialog({ open: true, contact, clientId: contact.clientId });
  };

  const handleSaveContact = () => {
    if (!contactFormData.name?.trim()) {
      toast.error('El nombre del contacto es obligatorio');
      return;
    }

    if (!contactDialog.clientId) {
      toast.error('Cliente no seleccionado');
      return;
    }

    if (contactDialog.contact) {
      // Update existing
      const updated = contacts.map((c) =>
        c.id === contactDialog.contact!.id
          ? {
              ...contactDialog.contact!,
              ...contactFormData,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : c
      );
      onUpdateContacts(updated);
      toast.success('Contacto actualizado exitosamente');
    } else {
      // Create new
      const newContact: ClientContact = {
        id: `cc${Date.now()}`,
        clientId: contactDialog.clientId,
        name: contactFormData.name!,
        email: contactFormData.email,
        phone: contactFormData.phone,
        isPrimary: contactFormData.isPrimary!,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateContacts([...contacts, newContact]);
      toast.success('Contacto creado exitosamente');
    }

    setContactDialog({ open: false, contact: null, clientId: null });
  };

  const handleDeleteContact = (contactId: string) => {
    setDeleteContactDialog({ open: true, contactId });
  };

  const confirmDeleteContact = () => {
    if (deleteContactDialog.contactId) {
      const updated = contacts.map((c) =>
        c.id === deleteContactDialog.contactId ? { ...c, isActive: false } : c
      );
      onUpdateContacts(updated);
      toast.success('Contacto eliminado');
    }
  };

  const handleSetPrimaryContact = (contactId: string, clientId: string) => {
    const updated = contacts.map((c) => {
      if (c.clientId === clientId) {
        return { ...c, isPrimary: c.id === contactId };
      }
      return c;
    });
    onUpdateContacts(updated);
    toast.success('Contacto principal actualizado');
  };

  const getCountryName = (code?: string) => {
    return countries.find((c) => c.code === code)?.name || code;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Gestión de Clientes</h1>
              <p className="text-gray-500 mt-1">
                Administra la información de tus clientes y contactos
              </p>
            </div>
            <Button onClick={handleOpenNew} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar clientes por nombre, razón social o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Clientes</p>
                  <p className="text-2xl font-semibold">{clients.filter((c) => c.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Contactos</p>
                  <p className="text-2xl font-semibold">{contacts.filter((c) => c.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Clientes Activos</p>
                  <p className="text-2xl font-semibold">
                    {clients.filter((c) => c.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Razón Social
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      NIT/Tax ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ubicación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contactos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Defaults
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.filter((c) => c.isActive).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No se encontraron clientes
                      </td>
                    </tr>
                  ) : (
                    filteredClients
                      .filter((c) => c.isActive)
                      .map((client) => {
                        const clientContacts = getClientContacts(client.id);
                        return (
                          <tr key={client.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-gray-900">{client.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {client.legalName || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {client.taxId || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {client.city && client.countryCode ? (
                                <>
                                  {client.city}, {getCountryName(client.countryCode)}
                                </>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setContactsListDialog({ open: true, clientId: client.id })}
                              >
                                {clientContacts.length} contacto{clientContacts.length !== 1 ? 's' : ''}
                              </Button>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <div className="flex gap-2">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {client.defaultLanguage}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {client.defaultCurrency}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEdit(client)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClient(client.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit/Create Client Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, client: null })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editDialog.client ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
            <DialogDescription>
              {editDialog.client
                ? 'Actualiza la información del cliente y sus contactos'
                : 'Completa los datos del nuevo cliente. Podrás agregar contactos después de guardar.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Client Data Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Información del Cliente</h3>
              <div className="grid gap-4">
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
            </div>

            {/* Contacts Section */}
            {editingClientId && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Contactos</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenNewContact(editingClientId)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Contacto
                  </Button>
                </div>

                <div className="space-y-2">
                  {getClientContacts(editingClientId).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No hay contactos registrados para este cliente
                      </p>
                    </div>
                  ) : (
                    getClientContacts(editingClientId).map((contact) => (
                      <Card key={contact.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <p className="font-medium text-gray-900">{contact.name}</p>
                                {contact.isPrimary && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Principal
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                {contact.email && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-3 h-3" />
                                    {contact.email}
                                  </div>
                                )}
                                {contact.phone && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-3 h-3" />
                                    {contact.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!contact.isPrimary && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSetPrimaryContact(contact.id, editingClientId)}
                                  title="Marcar como principal"
                                >
                                  <Star className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditContact(contact)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialog({ open: false, client: null });
                setEditingClientId(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {editDialog.client ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={contactDialog.open}
        onOpenChange={(open) => setContactDialog({ open, contact: null, clientId: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {contactDialog.contact ? 'Editar Contacto' : 'Nuevo Contacto'}
            </DialogTitle>
            <DialogDescription>
              {contactDialog.contact
                ? 'Actualiza la información del contacto'
                : 'Completa los datos del nuevo contacto'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactName"
                value={contactFormData.name}
                onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactFormData.email}
                onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                placeholder="contacto@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono</Label>
              <Input
                id="contactPhone"
                value={contactFormData.phone}
                onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={contactFormData.isPrimary}
                onChange={(e) =>
                  setContactFormData({ ...contactFormData, isPrimary: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPrimary" className="text-sm font-normal cursor-pointer">
                Marcar como contacto principal
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setContactDialog({ open: false, contact: null, clientId: null })}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveContact} className="bg-blue-600 hover:bg-blue-700">
              {contactDialog.contact ? 'Actualizar' : 'Crear Contacto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contacts List Dialog (View Only from Table) */}
      <Dialog
        open={contactsListDialog.open}
        onOpenChange={(open) => setContactsListDialog({ open, clientId: null })}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Contactos del Cliente</DialogTitle>
            <DialogDescription>
              Lista de contactos asociados a este cliente
            </DialogDescription>
          </DialogHeader>

          {contactsListDialog.clientId && (
            <div className="py-4">
              <div className="mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleOpenNewContact(contactsListDialog.clientId!);
                    setContactsListDialog({ open: false, clientId: null });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Contacto
                </Button>
              </div>

              {getClientContacts(contactsListDialog.clientId).length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay contactos registrados para este cliente
                </p>
              ) : (
                <div className="space-y-3">
                  {getClientContacts(contactsListDialog.clientId).map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{contact.name}</p>
                              {contact.isPrimary && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-current" />
                                  Principal
                                </span>
                              )}
                            </div>
                            <div className="mt-1 space-y-1">
                              {contact.email && (
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <Mail className="w-3 h-3" /> {contact.email}
                                </p>
                              )}
                              {contact.phone && (
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <Phone className="w-3 h-3" /> {contact.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleOpenEditContact(contact);
                                setContactsListDialog({ open: false, clientId: null });
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setContactsListDialog({ open: false, clientId: null })}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirmation */}
      <ConfirmDialog
        open={deleteClientDialog.open}
        onOpenChange={(open) => setDeleteClientDialog({ open, clientId: null })}
        title="Desactivar Cliente"
        description="¿Estás seguro de que deseas desactivar este cliente? Podrás reactivarlo más tarde."
        confirmText="Desactivar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteClient}
        variant="destructive"
      />

      {/* Delete Contact Confirmation */}
      <ConfirmDialog
        open={deleteContactDialog.open}
        onOpenChange={(open) => setDeleteContactDialog({ open, contactId: null })}
        title="Eliminar Contacto"
        description="¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteContact}
        variant="destructive"
      />
    </div>
  );
}

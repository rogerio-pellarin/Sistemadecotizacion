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
import { Checkbox } from './ui/checkbox';
import { ConfirmDialog } from './ui/confirm-dialog';
import { Building2, Plus, Pencil, Trash2, Search, Globe, Mail, Phone, MapPin, Users, User, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { IssuingCompany, Language, Currency, User as UserType, IssuingCompanyUser, UserRole } from '../types';
import { toast } from 'sonner';

interface IssuingCompanyManagementProps {
  companies: IssuingCompany[];
  users: UserType[];
  companyUsers: IssuingCompanyUser[];
  onUpdateCompanies: (companies: IssuingCompany[]) => void;
  onUpdateUsers: (users: UserType[]) => void;
  onUpdateCompanyUsers: (companyUsers: IssuingCompanyUser[]) => void;
}

const countries = [
  { code: 'CO', name: 'Colombia' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'BR', name: 'Brasil' },
  { code: 'MX', name: 'México' },
];

export function IssuingCompanyManagement({
  companies,
  users,
  companyUsers,
  onUpdateCompanies,
  onUpdateUsers,
  onUpdateCompanyUsers,
}: IssuingCompanyManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialog, setEditDialog] = useState<{ open: boolean; company: IssuingCompany | null }>({
    open: false,
    company: null,
  });
  const [userDialog, setUserDialog] = useState<{
    open: boolean;
    user: UserType | null;
    companyId: string | null;
  }>({
    open: false,
    user: null,
    companyId: null,
  });
  const [deleteCompanyDialog, setDeleteCompanyDialog] = useState<{ open: boolean; companyId: string | null }>({
    open: false,
    companyId: null,
  });
  const [deleteUserDialog, setDeleteUserDialog] = useState<{
    open: boolean;
    userId: string | null;
  }>({
    open: false,
    userId: null,
  });

  const [formData, setFormData] = useState<Partial<IssuingCompany>>({
    name: '',
    legalName: '',
    taxId: '',
    email: '',
    phone: '',
    website: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    countryCode: 'CO',
    postalCode: '',
    defaultLanguage: 'ES',
    defaultCurrency: 'COP',
    logoUrl: '',
    isActive: true,
  });

  const [userFormData, setUserFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    canQuote: boolean;
  }>({
    name: '',
    email: '',
    role: 'SALES',
    canQuote: true,
  });

  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.legalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNew = () => {
    setFormData({
      name: '',
      legalName: '',
      taxId: '',
      email: '',
      phone: '',
      website: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      countryCode: 'CO',
      postalCode: '',
      defaultLanguage: 'ES',
      defaultCurrency: 'COP',
      logoUrl: '',
      isActive: true,
    });
    setEditingCompanyId(null);
    setEditDialog({ open: true, company: null });
  };

  const handleOpenEdit = (company: IssuingCompany) => {
    setFormData(company);
    setEditingCompanyId(company.id);
    setEditDialog({ open: true, company });
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast.error('El nombre de la empresa es obligatorio');
      return;
    }

    if (editDialog.company) {
      const updated = companies.map((c) =>
        c.id === editDialog.company!.id
          ? {
              ...editDialog.company!,
              ...formData,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : c
      );
      onUpdateCompanies(updated);
      toast.success('Empresa actualizada exitosamente');
    } else {
      const newCompany: IssuingCompany = {
        id: `ic${Date.now()}`,
        tenantId: 't1',
        name: formData.name!,
        legalName: formData.legalName,
        taxId: formData.taxId,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        countryCode: formData.countryCode,
        postalCode: formData.postalCode,
        defaultLanguage: formData.defaultLanguage as Language,
        defaultCurrency: formData.defaultCurrency as Currency,
        logoUrl: formData.logoUrl,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateCompanies([...companies, newCompany]);
      setEditingCompanyId(newCompany.id);
      toast.success('Empresa creada exitosamente');
    }

    setEditDialog({ open: false, company: null });
  };

  const handleDeleteCompany = (companyId: string) => {
    setDeleteCompanyDialog({ open: true, companyId });
  };

  const confirmDeleteCompany = () => {
    if (deleteCompanyDialog.companyId) {
      const updated = companies.map((c) =>
        c.id === deleteCompanyDialog.companyId ? { ...c, isActive: false } : c
      );
      onUpdateCompanies(updated);
      toast.success('Empresa desactivada');
    }
  };

  // User Management
  const getCompanyUsers = (companyId: string) => {
    return companyUsers
      .filter((cu) => cu.issuingCompanyId === companyId && cu.isActive)
      .map((cu) => {
        const user = users.find((u) => u.id === cu.userId);
        return { companyUser: cu, user };
      })
      .filter((item) => item.user);
  };

  const handleOpenNewUser = (companyId: string) => {
    setUserFormData({
      name: '',
      email: '',
      role: 'SALES',
      canQuote: true,
    });
    setUserDialog({ open: true, user: null, companyId });
  };

  const handleOpenEditUser = (user: UserType, companyId: string) => {
    const companyUser = companyUsers.find(
      (cu) => cu.userId === user.id && cu.issuingCompanyId === companyId
    );
    setUserFormData({
      name: user.name,
      email: user.email,
      role: companyUser?.role || 'SALES',
      canQuote: companyUser?.canQuote || false,
    });
    setUserDialog({ open: true, user, companyId });
  };

  const handleSaveUser = () => {
    if (!userFormData.name?.trim()) {
      toast.error('El nombre del usuario es obligatorio');
      return;
    }

    if (!userFormData.email?.trim()) {
      toast.error('El email del usuario es obligatorio');
      return;
    }

    if (!userDialog.companyId) {
      toast.error('Empresa no seleccionada');
      return;
    }

    if (userDialog.user) {
      // Update existing user
      const updatedUsers = users.map((u) =>
        u.id === userDialog.user!.id
          ? {
              ...u,
              name: userFormData.name,
              email: userFormData.email,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : u
      );
      onUpdateUsers(updatedUsers);

      // Update company user relationship
      const updatedCompanyUsers = companyUsers.map((cu) =>
        cu.userId === userDialog.user!.id && cu.issuingCompanyId === userDialog.companyId
          ? {
              ...cu,
              role: userFormData.role,
              canQuote: userFormData.canQuote,
            }
          : cu
      );
      onUpdateCompanyUsers(updatedCompanyUsers);
      toast.success('Usuario actualizado exitosamente');
    } else {
      // Create new user
      const newUser: UserType = {
        id: `u${Date.now()}`,
        tenantId: 't1',
        email: userFormData.email,
        name: userFormData.name,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateUsers([...users, newUser]);

      // Create company user relationship
      const newCompanyUser: IssuingCompanyUser = {
        id: `icu${Date.now()}`,
        tenantId: 't1',
        issuingCompanyId: userDialog.companyId,
        userId: newUser.id,
        role: userFormData.role,
        canQuote: userFormData.canQuote,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onUpdateCompanyUsers([...companyUsers, newCompanyUser]);
      toast.success('Usuario creado exitosamente');
    }

    setUserDialog({ open: false, user: null, companyId: null });
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteUserDialog({ open: true, userId });
  };

  const confirmDeleteUser = () => {
    if (deleteUserDialog.userId) {
      const updatedUsers = users.map((u) =>
        u.id === deleteUserDialog.userId ? { ...u, isActive: false } : u
      );
      onUpdateUsers(updatedUsers);

      const updatedCompanyUsers = companyUsers.map((cu) =>
        cu.userId === deleteUserDialog.userId ? { ...cu, isActive: false } : cu
      );
      onUpdateCompanyUsers(updatedCompanyUsers);
      toast.success('Usuario desactivado');
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      ADMIN: 'Administrador',
      SALES: 'Ventas',
      VIEWER: 'Visualizador',
    };
    return labels[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ADMIN: 'bg-purple-100 text-purple-700',
      SALES: 'bg-blue-100 text-blue-700',
      VIEWER: 'bg-gray-100 text-gray-700',
    };
    return colors[role];
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
              <h1 className="text-3xl font-semibold text-gray-900">Empresas Emisoras</h1>
              <p className="text-gray-500 mt-1">
                Gestiona las empresas que emiten cotizaciones y sus usuarios
              </p>
            </div>
            <Button onClick={handleOpenNew} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Nueva Empresa
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
                placeholder="Buscar empresas..."
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
                  <p className="text-sm text-gray-500">Total Empresas</p>
                  <p className="text-2xl font-semibold">{companies.filter((c) => c.isActive).length}</p>
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
                  <p className="text-sm text-gray-500">Total Usuarios</p>
                  <p className="text-2xl font-semibold">{users.filter((u) => u.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Usuarios Autorizados</p>
                  <p className="text-2xl font-semibold">
                    {companyUsers.filter((cu) => cu.canQuote && cu.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompanies
            .filter((c) => c.isActive)
            .map((company) => {
              const companyUsersList = getCompanyUsers(company.id);
              return (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          {company.legalName && (
                            <p className="text-sm text-gray-500 mt-1">{company.legalName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(company)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCompany(company.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {company.taxId && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">NIT:</span>
                          {company.taxId}
                        </div>
                      )}
                      {company.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {company.email}
                        </div>
                      )}
                      {company.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {company.phone}
                        </div>
                      )}
                      {(company.city || company.state) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {company.city}
                          {company.state && `, ${company.state}`}
                          {company.countryCode && ` - ${getCountryName(company.countryCode)}`}
                        </div>
                      )}

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {company.defaultLanguage}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {company.defaultCurrency}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {companyUsersList.length} usuario{companyUsersList.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {filteredCompanies.filter((c) => c.isActive).length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron empresas
                </h3>
                <p className="text-gray-500">
                  Comienza creando tu primera empresa emisora
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Company Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => {
        setEditDialog({ open, company: null });
        setEditingCompanyId(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editDialog.company ? 'Editar Empresa' : 'Nueva Empresa Emisora'}
            </DialogTitle>
            <DialogDescription>
              {editDialog.company
                ? 'Actualiza la información de la empresa y gestiona sus usuarios'
                : 'Completa los datos de la empresa. Podrás agregar usuarios después de guardar.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Company Data Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Información de la Empresa</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nombre de la Empresa <span className="text-red-500">*</span>
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+57 (4) 123 4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.empresa.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Dirección Línea 1</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    placeholder="Calle 123 #45-67"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Dirección Línea 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    placeholder="Edificio, piso, oficina"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Medellín"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado/Departamento</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Antioquia"
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
              </div>
            </div>

            {/* Users Section */}
            {editingCompanyId && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Usuarios Autorizados</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenNewUser(editingCompanyId)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Usuario
                  </Button>
                </div>

                <div className="space-y-2">
                  {getCompanyUsers(editingCompanyId).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No hay usuarios registrados para esta empresa
                      </p>
                    </div>
                  ) : (
                    getCompanyUsers(editingCompanyId).map(({ companyUser, user }) => (
                      <Card key={companyUser.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <p className="font-medium text-gray-900">{user!.name}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Mail className="w-3 h-3" />
                                {user!.email}
                              </div>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(companyUser.role)}`}>
                                  {getRoleLabel(companyUser.role)}
                                </span>
                                {companyUser.canQuote ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Puede Cotar
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
                                    <XCircle className="w-3 h-3" />
                                    Sin Acceso
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditUser(user!, editingCompanyId)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user!.id)}
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
                setEditDialog({ open: false, company: null });
                setEditingCompanyId(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {editDialog.company ? 'Actualizar Empresa' : 'Crear Empresa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={userDialog.open}
        onOpenChange={(open) => setUserDialog({ open, user: null, companyId: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {userDialog.user ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              {userDialog.user
                ? 'Actualiza la información del usuario'
                : 'Completa los datos del nuevo usuario'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userName"
                value={userFormData.name}
                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                placeholder="usuario@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Rol</Label>
              <Select
                value={userFormData.role}
                onValueChange={(value) =>
                  setUserFormData({ ...userFormData, role: value as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SALES">Ventas</SelectItem>
                  <SelectItem value="VIEWER">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Los administradores tienen acceso completo, ventas pueden crear y editar cotizaciones,
                y los visualizadores solo pueden ver.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="canQuote"
                checked={userFormData.canQuote}
                onCheckedChange={(checked) =>
                  setUserFormData({ ...userFormData, canQuote: checked as boolean })
                }
              />
              <Label htmlFor="canQuote" className="text-sm font-normal cursor-pointer">
                Autorizar a crear cotizaciones
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserDialog({ open: false, user: null, companyId: null })}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">
              {userDialog.user ? 'Actualizar' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Confirmation */}
      <ConfirmDialog
        open={deleteCompanyDialog.open}
        onOpenChange={(open) => setDeleteCompanyDialog({ open, companyId: null })}
        title="Desactivar Empresa"
        description="¿Estás seguro de que deseas desactivar esta empresa? Las cotizaciones existentes no se verán afectadas."
        confirmText="Desactivar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteCompany}
        variant="destructive"
      />

      {/* Delete User Confirmation */}
      <ConfirmDialog
        open={deleteUserDialog.open}
        onOpenChange={(open) => setDeleteUserDialog({ open, userId: null })}
        title="Desactivar Usuario"
        description="¿Estás seguro de que deseas desactivar este usuario? No podrá acceder más al sistema."
        confirmText="Desactivar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteUser}
        variant="destructive"
      />
    </div>
  );
}
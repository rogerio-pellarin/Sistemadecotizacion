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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Plus, Edit } from 'lucide-react';
import { Role, RoleType } from '../types';
import { formatCurrency, calculateRoleTotalCost } from '../utils/calculations';

interface ResourceManagementProps {
  roles: Role[];
  onBack: () => void;
  onUpdateRoles: (roles: Role[]) => void;
}

export function ResourceManagement({ roles: initialRoles, onBack, onUpdateRoles }: ResourceManagementProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'staff' as RoleType,
    baseCost: 0,
    benefits: 50,
  });

  const openNewRoleDialog = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      type: 'staff',
      baseCost: 0,
      benefits: 50,
    });
    setIsDialogOpen(true);
  };

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      type: role.type,
      baseCost: role.baseCost,
      benefits: role.benefits,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalCost = calculateRoleTotalCost({
      ...formData,
      id: '',
      totalCost: 0,
      active: true,
    });

    if (editingRole) {
      // Update existing role
      const updatedRoles = roles.map((role) =>
        role.id === editingRole.id
          ? { ...role, ...formData, totalCost }
          : role
      );
      setRoles(updatedRoles);
      onUpdateRoles(updatedRoles);
    } else {
      // Create new role
      const newRole: Role = {
        id: `r${Date.now()}`,
        ...formData,
        totalCost,
        active: true,
      };
      const updatedRoles = [...roles, newRole];
      setRoles(updatedRoles);
      onUpdateRoles(updatedRoles);
    }

    setIsDialogOpen(false);
  };

  const toggleRoleActive = (id: string) => {
    const updatedRoles = roles.map((role) =>
      role.id === id ? { ...role, active: !role.active } : role
    );
    setRoles(updatedRoles);
    onUpdateRoles(updatedRoles);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Recursos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configura los roles y costos de tu equipo
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Roles del Equipo</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewRoleDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Rol
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Rol *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      placeholder="Ej: Desarrollador Senior"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: RoleType) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="external">Externo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseCost">Costo Base (COP) *</Label>
                    <Input
                      id="baseCost"
                      type="number"
                      min="0"
                      value={formData.baseCost}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          baseCost: parseFloat(e.target.value) || 0,
                        }))
                      }
                      required
                      placeholder="Ej: 6000000"
                    />
                    <p className="text-xs text-gray-500">Salario mensual o tarifa base</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Prestaciones (%)</Label>
                    <Input
                      id="benefits"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.benefits}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          benefits: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="50"
                    />
                    <p className="text-xs text-gray-500">
                      Aplica solo para staff. Ley 50: ~50%, Integral: ~30%
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Costo Total Calculado:
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        formData.baseCost * (1 + formData.benefits / 100),
                        'COP'
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingRole ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Rol</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Costo Base</TableHead>
                  <TableHead className="text-right">Prestaciones</TableHead>
                  <TableHead className="text-right">Costo Total</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} className={!role.active ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {role.type === 'staff' ? 'Staff' : 'Externo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(role.baseCost, 'COP')}
                    </TableCell>
                    <TableCell className="text-right">{role.benefits}%</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(role.totalCost, 'COP')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={role.active}
                        onCheckedChange={() => toggleRoleActive(role.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditRoleDialog(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {roles.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay roles configurados. Crea el primer rol.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

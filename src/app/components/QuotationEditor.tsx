import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ConfirmDialog } from './ui/confirm-dialog';
import { ArrowLeft, Plus, Copy, Trash2, FileText, GripVertical, FolderPlus } from 'lucide-react';
import { Quotation, Activity, Role, ActivityGroup } from '../types';
import { formatCurrency, calculateActivityCost, calculateQuotationSummary, calculateGroupSubtotal } from '../utils/calculations';

interface QuotationEditorProps {
  quotation: Quotation;
  roles: Role[];
  hoursPerMonth: number;
  onBack: () => void;
  onSave: (quotation: Quotation) => void;
  onViewProposal: (quotation: Quotation) => void;
}

const DragTypes = {
  GROUP: 'group',
  ACTIVITY: 'activity',
};

interface DragItem {
  type: string;
  id: string;
  groupId?: string;
  sourceIndex?: number;
}

// Activity Row Component with Drag
function ActivityRow({
  activity,
  groupId,
  index,
  roles,
  currency,
  onUpdate,
  onDuplicate,
  onDelete,
  moveActivity,
}: any) {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.ACTIVITY,
    item: () => ({ type: DragTypes.ACTIVITY, id: activity.id, groupId, sourceIndex: index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: DragTypes.ACTIVITY,
    hover(item: DragItem, monitor) {
      if (!ref.current) return;
      
      const dragGroupId = item.groupId;
      const hoverGroupId = groupId;
      const dragIndex = item.sourceIndex!;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragGroupId === hoverGroupId && dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      moveActivity(dragGroupId!, item.id, hoverGroupId, hoverIndex);

      // Note: we're mutating the item here!
      item.groupId = hoverGroupId;
      item.sourceIndex = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <tr
      ref={ref}
      className={`${isDragging ? 'opacity-30' : ''} ${isOver ? 'bg-blue-50' : ''} transition-colors`}
      style={{ cursor: 'move' }}
    >
      <td className="px-4 py-3 border-b">
        <div className="flex items-center">
          <GripVertical className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <span className="font-medium text-sm">{activity.code}</span>
        </div>
      </td>
      <td className="px-4 py-3 border-b">
        <Input
          value={activity.description}
          onChange={(e) => onUpdate(activity.id, 'description', e.target.value)}
          placeholder="Descripción de la actividad"
          className="w-full"
        />
      </td>
      <td className="px-4 py-3 border-b">
        <Select
          value={activity.roleId}
          onValueChange={(value) => onUpdate(activity.id, 'roleId', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles
              .filter((r: Role) => r.active)
              .map((role: Role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-3 border-b">
        <Input
          type="number"
          min="0"
          value={activity.estimatedHours}
          onChange={(e) => onUpdate(activity.id, 'estimatedHours', parseFloat(e.target.value) || 0)}
          className="w-[100px]"
        />
      </td>
      <td className="px-4 py-3 border-b bg-gray-50 text-right text-sm">
        {formatCurrency(activity.unitCost, currency)}
      </td>
      <td className="px-4 py-3 border-b bg-gray-50 text-right text-sm">
        {formatCurrency(activity.totalCost, currency)}
      </td>
      <td className="px-4 py-3 border-b bg-gray-50 text-right text-sm font-medium">
        {formatCurrency(activity.salePrice, currency)}
      </td>
      <td className="px-4 py-3 border-b text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(activity)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(activity.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// Activity Group Component with Drag
function ActivityGroupCard({
  group,
  index,
  roles,
  currency,
  hoursPerMonth,
  onUpdateGroupName,
  onAddActivity,
  onUpdateActivity,
  onDuplicateActivity,
  onDeleteActivity,
  onDeleteGroup,
  moveGroup,
  moveActivity,
}: any) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.GROUP,
    item: () => ({ type: DragTypes.GROUP, id: group.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: DragTypes.GROUP,
    hover(item: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index!;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      moveGroup(dragIndex, hoverIndex);

      // Note: we're mutating the item here!
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const groupSubtotal = calculateGroupSubtotal(group.activities);

  return (
    <div
      ref={ref}
      className={`mb-6 ${isDragging ? 'opacity-30' : ''} ${isOver ? 'ring-2 ring-blue-400' : ''} transition-all`}
      style={{ cursor: 'move' }}
    >
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 gap-3">
              <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Input
                value={group.name}
                onChange={(e) => onUpdateGroupName(group.id, e.target.value)}
                className="font-semibold text-base max-w-md"
                placeholder="Nombre del grupo"
              />
              <span className="text-sm text-gray-500">
                ({group.activities.length} actividades)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <div className="text-xs text-gray-500">Subtotal del Grupo</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(groupSubtotal, currency)}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddActivity(group.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Actividad
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteGroup(group.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {group.activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[100px]">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[250px]">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[200px]">
                      Rol
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[120px]">
                      Horas Est.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-[130px]">
                      Costo Unit.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-[130px]">
                      Costo Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-[130px]">
                      Precio Venta
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-[100px]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.activities.map((activity: Activity, idx: number) => (
                    <ActivityRow
                      key={activity.id}
                      activity={activity}
                      groupId={group.id}
                      index={idx}
                      roles={roles}
                      currency={currency}
                      onUpdate={(activityId: string, field: string, value: any) =>
                        onUpdateActivity(group.id, activityId, field, value)
                      }
                      onDuplicate={(activity: Activity) =>
                        onDuplicateActivity(group.id, activity)
                      }
                      onDelete={(activityId: string) =>
                        onDeleteActivity(group.id, activityId)
                      }
                      moveActivity={moveActivity}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay actividades en este grupo
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function QuotationEditor({
  quotation: initialQuotation,
  roles,
  hoursPerMonth,
  onBack,
  onSave,
  onViewProposal,
}: QuotationEditorProps) {
  const [quotation, setQuotation] = useState<Quotation>(initialQuotation);
  const [deleteGroupDialog, setDeleteGroupDialog] = useState<{ open: boolean; groupId: string | null }>({
    open: false,
    groupId: null,
  });
  const [deleteActivityDialog, setDeleteActivityDialog] = useState<{
    open: boolean;
    groupId: string | null;
    activityId: string | null;
  }>({
    open: false,
    groupId: null,
    activityId: null,
  });

  const addGroup = () => {
    const newGroup: ActivityGroup = {
      id: `g${Date.now()}`,
      name: `Grupo ${quotation.activityGroups.length + 1}`,
      activities: [],
      order: quotation.activityGroups.length,
    };
    setQuotation((prev) => ({
      ...prev,
      activityGroups: [...prev.activityGroups, newGroup],
    }));
  };

  const updateGroupName = (groupId: string, name: string) => {
    setQuotation((prev) => ({
      ...prev,
      activityGroups: prev.activityGroups.map((g) =>
        g.id === groupId ? { ...g, name } : g
      ),
    }));
  };

  const deleteGroup = (groupId: string) => {
    setDeleteGroupDialog({ open: true, groupId });
  };

  const confirmDeleteGroup = () => {
    if (deleteGroupDialog.groupId) {
      setQuotation((prev) => ({
        ...prev,
        activityGroups: prev.activityGroups.filter((g) => g.id !== deleteGroupDialog.groupId),
      }));
    }
  };

  const addActivity = (groupId: string) => {
    const group = quotation.activityGroups.find((g) => g.id === groupId);
    if (!group) return;

    // Generate activity code based on total activities across all groups
    const totalActivities = quotation.activityGroups.reduce(
      (sum, g) => sum + g.activities.length,
      0
    );

    const newActivity: Activity = {
      id: `a${Date.now()}`,
      code: `A${String(totalActivities + 1).padStart(2, '0')}`,
      description: '',
      roleId: roles[0]?.id || '',
      estimatedHours: 0,
      unitCost: 0,
      totalCost: 0,
      salePrice: 0,
    };

    setQuotation((prev) => ({
      ...prev,
      activityGroups: prev.activityGroups.map((g) =>
        g.id === groupId
          ? { ...g, activities: [...g.activities, newActivity] }
          : g
      ),
    }));
  };

  const duplicateActivity = (groupId: string, activity: Activity) => {
    const totalActivities = quotation.activityGroups.reduce(
      (sum, g) => sum + g.activities.length,
      0
    );

    const newActivity: Activity = {
      ...activity,
      id: `a${Date.now()}`,
      code: `A${String(totalActivities + 1).padStart(2, '0')}`,
    };

    setQuotation((prev) => ({
      ...prev,
      activityGroups: prev.activityGroups.map((g) =>
        g.id === groupId
          ? { ...g, activities: [...g.activities, newActivity] }
          : g
      ),
    }));
  };

  const deleteActivity = (groupId: string, activityId: string) => {
    setDeleteActivityDialog({ open: true, groupId, activityId });
  };

  const confirmDeleteActivity = () => {
    if (deleteActivityDialog.groupId && deleteActivityDialog.activityId) {
      setQuotation((prev) => ({
        ...prev,
        activityGroups: prev.activityGroups.map((g) =>
          g.id === deleteActivityDialog.groupId
            ? { ...g, activities: g.activities.filter((a) => a.id !== deleteActivityDialog.activityId) }
            : g
        ),
      }));
    }
  };

  const updateActivity = (groupId: string, activityId: string, field: keyof Activity, value: any) => {
    setQuotation((prev) => ({
      ...prev,
      activityGroups: prev.activityGroups.map((group) => {
        if (group.id !== groupId) return group;

        const activities = group.activities.map((activity) => {
          if (activity.id !== activityId) return activity;

          const updated = { ...activity, [field]: value };

          // Recalculate costs when role or hours change
          if (field === 'roleId' || field === 'estimatedHours') {
            const role = roles.find((r) => r.id === updated.roleId);
            if (role && updated.estimatedHours > 0) {
              const costs = calculateActivityCost(updated, role, hoursPerMonth);
              updated.unitCost = costs.unitCost;
              updated.totalCost = costs.totalCost;
              updated.salePrice = costs.salePrice;
            }
          }

          return updated;
        });

        return { ...group, activities };
      }),
    }));
  };

  const moveGroup = useCallback((fromIndex: number, toIndex: number) => {
    setQuotation((prev) => {
      const groups = [...prev.activityGroups];
      const [movedGroup] = groups.splice(fromIndex, 1);
      groups.splice(toIndex, 0, movedGroup);
      return {
        ...prev,
        activityGroups: groups.map((g, idx) => ({ ...g, order: idx })),
      };
    });
  }, []);

  const moveActivity = useCallback((fromGroupId: string, activityId: string, toGroupId: string, toIndex: number) => {
    setQuotation((prev) => {
      const groups = [...prev.activityGroups];
      
      // Find source and target groups
      const fromGroup = groups.find((g) => g.id === fromGroupId);
      const toGroup = groups.find((g) => g.id === toGroupId);
      
      if (!fromGroup || !toGroup) return prev;

      // Find and remove activity from source
      const activityIndex = fromGroup.activities.findIndex((a) => a.id === activityId);
      if (activityIndex === -1) return prev;
      
      const [activity] = fromGroup.activities.splice(activityIndex, 1);
      
      // Add to target at specific index
      toGroup.activities.splice(toIndex, 0, activity);

      return { ...prev, activityGroups: groups };
    });
  }, []);

  const summary = calculateQuotationSummary(quotation);

  const handleSave = () => {
    onSave(quotation);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-[1600px] mx-auto px-8 py-4">
            <Button variant="ghost" onClick={onBack} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{quotation.code}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {quotation.client} - {quotation.project}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSave}>
                  Guardar
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => onViewProposal(quotation)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Propuesta Final
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="flex gap-8">
            {/* Left Column - Activity Groups */}
            <div className="flex-1">
              {quotation.activityGroups.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      No hay grupos de actividades. Comienza creando tu primer grupo.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                quotation.activityGroups.map((group, index) => (
                  <ActivityGroupCard
                    key={group.id}
                    group={group}
                    index={index}
                    roles={roles}
                    currency={quotation.currency}
                    hoursPerMonth={hoursPerMonth}
                    onUpdateGroupName={updateGroupName}
                    onAddActivity={addActivity}
                    onUpdateActivity={updateActivity}
                    onDuplicateActivity={duplicateActivity}
                    onDeleteActivity={deleteActivity}
                    onDeleteGroup={deleteGroup}
                    moveGroup={moveGroup}
                    moveActivity={moveActivity}
                  />
                ))
              )}

              {/* Add Group Button - Always at bottom */}
              <div className="mt-6">
                <Button onClick={addGroup} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <FolderPlus className="w-5 h-5 mr-2" />
                  Agregar Grupo de Actividades
                </Button>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="w-[380px]">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumen Dinámico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal Base</span>
                      <span className="font-medium">
                        {formatCurrency(summary.subtotalBase, quotation.currency)}
                      </span>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Testing ({quotation.testingFactor}%)</span>
                        <span>{formatCurrency(summary.testing, quotation.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">PM ({quotation.pmFactor}%)</span>
                        <span>{formatCurrency(summary.pm, quotation.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Margen Seguridad ({quotation.securityMargin}%)
                        </span>
                        <span>{formatCurrency(summary.securityMargin, quotation.currency)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio Antes Descuento</span>
                        <span className="font-medium">
                          {formatCurrency(summary.beforeDiscount, quotation.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-red-600">
                        <span>
                          Descuento (
                          {quotation.discountType === 'percentage'
                            ? `${quotation.discountValue}%`
                            : formatCurrency(quotation.discountValue, 'COP')}
                          )
                        </span>
                        <span>-{formatCurrency(summary.discount, quotation.currency)}</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-900 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">TOTAL FINAL</span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(summary.totalFinal, quotation.currency)}
                        </span>
                      </div>
                    </div>

                    {quotation.currency === 'COP' && (
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Equivalente USD</span>
                          <span className="font-medium">{formatCurrency(summary.totalUSD, 'USD')}</span>
                        </div>
                        <div className="text-xs text-gray-500">TRM: {quotation.trm}</div>
                      </div>
                    )}

                    {quotation.currency === 'USD' && (
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Equivalente COP</span>
                          <span className="font-medium">{formatCurrency(summary.totalLocal, 'COP')}</span>
                        </div>
                        <div className="text-xs text-gray-500">TRM: {quotation.trm}</div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Grupos: {quotation.activityGroups.length}</div>
                      <div>
                        Actividades:{' '}
                        {quotation.activityGroups.reduce((sum, g) => sum + g.activities.length, 0)}
                      </div>
                      <div>
                        Horas totales:{' '}
                        {quotation.activityGroups.reduce(
                          (sum, g) =>
                            sum + g.activities.reduce((s, a) => s + a.estimatedHours, 0),
                          0
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={deleteGroupDialog.open}
        onOpenChange={(open) => setDeleteGroupDialog({ open, groupId: null })}
        title="Eliminar Grupo"
        description="¿Estás seguro de que deseas eliminar este grupo y todas sus actividades? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteGroup}
        variant="destructive"
      />

      <ConfirmDialog
        open={deleteActivityDialog.open}
        onOpenChange={(open) =>
          setDeleteActivityDialog({ open, groupId: null, activityId: null })
        }
        title="Eliminar Actividad"
        description="¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteActivity}
        variant="destructive"
      />
    </DndProvider>
  );
}

# 📋 Documentación Técnica - Sistema de Cotización SaaS B2B

## 🎯 Visión General del Proyecto

Sistema completo de gestión de cotizaciones B2B desarrollado como una aplicación SaaS multi-tenant en español/inglés. La plataforma permite que empresas emisoras creen, gestionen y den seguimiento a cotizaciones para sus clientes, con cálculos automáticos, conversión de monedas, control de usuarios y permisos granulares.

### Características Principales
- **Multi-idioma**: Soporte completo para ES (Español) e EN (English)
- **Multi-moneda**: COP (Peso Colombiano) y USD (Dólar) con tasas de cambio configurables
- **Multi-tenant**: Arquitectura preparada para múltiples tenants (aislamiento por `tenantId`)
- **Soft Delete**: Todos los registros usan flag `isActive` en lugar de eliminación física
- **Design System**: Interfaz moderna inspirada en Linear/Stripe/Notion

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- **React 18** con TypeScript
- **React Router** (data mode) para enrutamiento
- **Tailwind CSS v4** para estilos
- **Radix UI** para componentes accesibles (vía shadcn/ui)
- **Lucide React** para iconos
- **Sonner** para notificaciones toast
- **React DnD** para drag-and-drop de grupos

**Bibliotecas Adicionales:**
- `date-fns` para manipulación de fechas
- `react-to-print` para impresión de cotizaciones

**Estado:**
- Estado local con React Hooks (useState)
- Sin gestor global (Redux/Zustand) - estado gestionado en App.tsx

---

## 📊 Modelo de Datos

### Entidades Principales

#### 1️⃣ **Tenant**
```typescript
{
  id: string;
  name: string;
  domain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```
- Representa la organización/empresa que usa el sistema
- Aislamiento multi-tenant

#### 2️⃣ **Issuing Company (Empresa Emisora)**
```typescript
{
  id: string;
  tenantId: string;
  name: string;              // Nombre comercial
  legalName?: string;        // Razón social
  taxId?: string;            // NIT/CNPJ
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode?: string;      // CO, US, BR, MX
  postalCode?: string;
  defaultLanguage: Language; // ES o EN
  defaultCurrency: Currency; // COP o USD
  logoUrl?: string;
  isActive: boolean;
}
```
- Empresas que emiten cotizaciones
- Define idioma y moneda por defecto

#### 3️⃣ **User (Usuario)**
```typescript
{
  id: string;
  tenantId: string;
  email: string;
  name: string;
  passwordHash?: string;     // Preparado para autenticación futura
  isActive: boolean;
}
```
- Usuarios del sistema
- Pueden pertenecer a múltiples empresas

#### 4️⃣ **Issuing Company User (Relación N:N)**
```typescript
{
  id: string;
  tenantId: string;
  issuingCompanyId: string;
  userId: string;
  role: UserRole;            // ADMIN, SALES, VIEWER
  canQuote: boolean;         // Permiso para crear cotizaciones
  isActive: boolean;
}
```
- Vincula usuarios a empresas emisoras
- Define roles y permisos por empresa

#### 5️⃣ **Client (Cliente)**
```typescript
{
  id: string;
  tenantId: string;
  name: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  // Dirección completa
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
  notes?: string;
  isActive: boolean;
}
```
- Clientes que reciben cotizaciones
- Pueden tener múltiples contactos

#### 6️⃣ **Client Contact (Contacto del Cliente)**
```typescript
{
  id: string;
  tenantId: string;
  clientId: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;             // Cargo/función
  isPrimary: boolean;        // Contacto principal
  isActive: boolean;
}
```
- Personas de contacto dentro de cada cliente
- Un cliente puede tener múltiples contactos

#### 7️⃣ **Quote (Cotización)**
```typescript
{
  id: string;
  tenantId: string;
  quoteNumber: string;       // Auto-incrementado (Q-0001)
  issuingCompanyId: string;
  clientId: string;
  contactId?: string;
  userId: string;            // Creador de la cotización
  language: Language;
  currency: Currency;
  status: QuoteStatus;       // DRAFT, SENT, APPROVED, REJECTED
  validUntil?: string;
  
  // Totalizadores
  subtotal: number;
  taxRate: number;           // Porcentual
  taxAmount: number;
  discountRate: number;      // Porcentual
  discountAmount: number;
  total: number;
  
  notes?: string;
  termsAndConditions?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  approvedAt?: string;
}
```
- Cotización principal
- Contiene grupos de actividades

#### 8️⃣ **Activity Group (Grupo de Actividades)**
```typescript
{
  id: string;
  tenantId: string;
  quoteId: string;
  name: string;              // Ej: "Desarrollo Frontend"
  description?: string;
  sortOrder: number;         // Para drag-and-drop
  
  // Totalizadores del grupo
  subtotal: number;
  margin: number;            // Porcentual
  marginAmount: number;
  discount: number;          // Porcentual
  discountAmount: number;
  total: number;
}
```
- Agrupa actividades relacionadas
- Puede reordenarse vía drag-and-drop

#### 9️⃣ **Activity (Actividad/Ítem)**
```typescript
{
  id: string;
  tenantId: string;
  activityGroupId: string;
  description: string;
  quantity: number;
  unit: string;              // Ej: "horas", "unidades"
  unitCost: number;          // Costo base
  markup: number;            // Porcentual de margen
  unitPrice: number;         // Precio con margen
  discount: number;          // Porcentual de descuento
  finalPrice: number;        // Precio final después del descuento
  totalCost: number;         // quantity * unitCost
  totalPrice: number;        // quantity * finalPrice
  sortOrder: number;
}
```
- Ítems individuales de una cotización
- Cálculos automáticos en cascada

#### 🔟 **Exchange Rate (Tasa de Cambio)**
```typescript
{
  id: string;
  tenantId: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  effectiveDate: string;
  isActive: boolean;
}
```
- Tasas de conversión entre monedas
- Permite múltiples tasas con fechas diferentes

---

## 🎨 Estructura de Componentes

### Componentes Principales (Pages)

#### **Dashboard** (`/`)
- Visión general con KPIs y estadísticas
- Cards con totales de cotizaciones por estado
- Gráfico de evolución mensual
- Lista de cotizaciones recientes
- Filtros y búsqueda

#### **Quote Wizard** (`/quotes/new`)
Wizard de 3 pasos para crear cotización:
1. **Paso 1**: Selección de empresa emisora, cliente y contacto
2. **Paso 2**: Configuración (idioma, moneda, validez, impuestos)
3. **Paso 3**: Revisión final antes de crear

#### **Quote Editor** (`/quotes/:id`)
Editor completo con:
- Header con información básica (estado, valores)
- Grupos de actividades (drag-and-drop para reordenar)
- Actividades dentro de cada grupo
- Panel lateral con resumen financiero
- Botones de acción (Guardar, Enviar, Imprimir, Duplicar)
- Modal de visualización de impresión

#### **Quote List** (`/quotes`)
- Tabla con todas las cotizaciones
- Filtros por estado, cliente, fecha
- Búsqueda por número o cliente
- Badges coloridos por estado
- Acciones rápidas (ver, editar, duplicar, imprimir)

#### **Client Management** (`/clients`)
- Grid de cards de clientes
- Modal de creación/edición
- Sección de contactos dentro del modal
- CRUD completo de contactos (crear, editar, eliminar)
- Búsqueda y filtros
- Estadísticas (total clientes, total contactos)

#### **Issuing Company Management** (`/companies`)
- Grid de empresas emisoras
- Modal de creación/edición
- Sección de usuarios dentro del modal
- CRUD completo de usuarios (crear, editar, eliminar)
- Roles y permisos por usuario
- Búsqueda y estadísticas

#### **Reports** (`/reports`)
- Selección de cliente
- Tabla con todas las cotizaciones del cliente
- Filtros por estado y fecha
- Totalizadores
- Exportación para impresión

#### **Exchange Rates** (`/exchange-rates`)
- Gestión de tasas de cambio
- Historial de tasas
- CRUD completo

#### **Authentication**
- `/login` - Pantalla de login
- `/forgot-password` - Recuperación de contraseña
- `/reset-password` - Redefinición de contraseña

### Componentes UI Reutilizables

Localizados en `/src/app/components/ui/`:
- `button.tsx` - Botones con variantes
- `input.tsx` - Campos de texto
- `card.tsx` - Cards
- `dialog.tsx` - Modales
- `select.tsx` - Dropdowns
- `label.tsx` - Labels
- `textarea.tsx` - Campos de texto multilínea
- `checkbox.tsx` - Checkboxes
- `confirm-dialog.tsx` - Diálogo de confirmación personalizado
- `badge.tsx` - Badges de estado
- `utils.ts` - Utilidad `cn()` para merge de clases

---

## 🔄 Flujos Principales

### Flujo de Creación de Cotización

1. **Dashboard** → Botón "Nueva Cotización"
2. **Wizard - Paso 1**: Selección de empresa, cliente y contacto
3. **Wizard - Paso 2**: Configuración de idioma, moneda, impuestos
4. **Wizard - Paso 3**: Revisión y confirmación
5. **Quote Editor**: Agregar grupos y actividades
6. **Cálculos Automáticos**: 
   - Actividad: `totalCost = quantity × unitCost`
   - Actividad: `unitPrice = unitCost × (1 + markup/100)`
   - Actividad: `finalPrice = unitPrice × (1 - discount/100)`
   - Actividad: `totalPrice = quantity × finalPrice`
   - Grupo: `subtotal = ∑ activities.totalPrice`
   - Grupo: `marginAmount = subtotal × (margin/100)`
   - Grupo: `discountAmount = (subtotal + marginAmount) × (discount/100)`
   - Grupo: `total = subtotal + marginAmount - discountAmount`
   - Quote: `subtotal = ∑ groups.total`
   - Quote: `taxAmount = subtotal × (taxRate/100)`
   - Quote: `discountAmount = (subtotal + taxAmount) × (discountRate/100)`
   - Quote: `total = subtotal + taxAmount - discountAmount`

### Flujo de Autenticación

1. **Login**: Email + Contraseña
2. **Validación**: Verifica usuario activo
3. **Sesión**: Almacena `currentUser` en el estado
4. **Sidebar**: Muestra nombre y email del usuario
5. **Logout**: Limpia sesión y redirige a login

### Flujo de Gestión de Clientes

1. **Client List**: Visualizar todos los clientes
2. **Crear/Editar Cliente**: Modal con datos básicos
3. **Después de Guardar**: Modal permanece abierto con ID
4. **Sección de Contactos**: Aparece después del primer guardado
5. **CRUD de Contactos**: Crear, editar y eliminar contactos inline
6. **Contacto Principal**: Flag `isPrimary` marca el contacto por defecto

---

## 🎨 Design System

### Paleta de Colores

**Estados de Cotizaciones:**
- 🔵 DRAFT (Borrador): `bg-gray-100 text-gray-700`
- 🟡 SENT (Enviada): `bg-blue-100 text-blue-700`
- 🟢 APPROVED (Aprobada): `bg-green-100 text-green-700`
- 🔴 REJECTED (Rechazada): `bg-red-100 text-red-700`

**Roles de Usuarios:**
- 🟣 ADMIN: `bg-purple-100 text-purple-700`
- 🔵 SALES: `bg-blue-100 text-blue-700`
- ⚫ VIEWER: `bg-gray-100 text-gray-700`

### Componentes Visuales

- **Cards**: Sombra sutil, hover effect, bordes redondeados
- **Botones**: Primary (azul), secondary (gris), destructive (rojo)
- **Inputs**: Border focus, estados de error, placeholders claros
- **Modales**: Overlay oscuro, max-width controlado, scroll interno
- **Toasts**: Esquina superior derecha, auto-dismiss 3s

---

## 🔐 Control de Acceso

### Roles Definidos

1. **ADMIN**: 
   - Acceso total
   - Gestionar empresas, usuarios, clientes
   - Crear, editar, eliminar cotizaciones
   - Ver reportes

2. **SALES**: 
   - Crear y editar cotizaciones (si `canQuote = true`)
   - Ver clientes y cotizaciones
   - Generar reportes

3. **VIEWER**: 
   - Solo visualización
   - Sin permisos de creación/edición

### Permiso `canQuote`

- Flag adicional además del rol
- Control granular por usuario/empresa
- Necesario para crear cotizaciones incluso siendo SALES

---

## 📁 Estructura de Archivos

```
/src
├── /app
│   ├── App.tsx                          # Componente principal con estado global
│   ├── routes.ts                        # Configuración del React Router
│   │
│   ├── /components
│   │   ├── Dashboard.tsx
│   │   ├── QuoteWizard.tsx             # Wizard 3 pasos
│   │   ├── QuoteEditor.tsx             # Editor completo
│   │   ├── QuoteList.tsx
│   │   ├── ClientManagement.tsx        # Con CRUD de contactos
│   │   ├── IssuingCompanyManagement.tsx # Con CRUD de usuarios
│   │   ├── ReportsManagement.tsx
│   │   ├── ExchangeRateManagement.tsx
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── Sidebar.tsx                 # Menú lateral
│   │   ├── QuotePrintView.tsx          # Visualización para impresión
│   │   │
│   │   └── /ui                         # Componentes base (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── select.tsx
│   │       ├── label.tsx
│   │       ├── textarea.tsx
│   │       ├── checkbox.tsx
│   │       ├── confirm-dialog.tsx
│   │       └── utils.ts
│   │
│   ├── types.ts                        # Todas las interfaces TypeScript
│   └── mockData.ts                     # Datos de ejemplo
│
├── /styles
│   ├── theme.css                       # CSS variables y tema
│   └── fonts.css                       # Import de fuentes
│
└── main.tsx                            # Entry point
```

---

## 🧮 Lógica de Cálculos

### Jerarquía de Cálculo

```
Activity (Ítem)
├── totalCost = quantity × unitCost
├── unitPrice = unitCost × (1 + markup/100)
├── finalPrice = unitPrice × (1 - discount/100)
└── totalPrice = quantity × finalPrice
       ↓
Activity Group (Grupo)
├── subtotal = Σ(activities.totalPrice)
├── marginAmount = subtotal × (margin/100)
├── discountAmount = (subtotal + marginAmount) × (discount/100)
└── total = subtotal + marginAmount - discountAmount
       ↓
Quote (Cotización)
├── subtotal = Σ(groups.total)
├── taxAmount = subtotal × (taxRate/100)
├── discountAmount = (subtotal + taxAmount) × (discountRate/100)
└── total = subtotal + taxAmount - discountAmount
```

### Conversión de Monedas

```typescript
const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: ExchangeRate[]
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const rate = rates.find(
    r => r.fromCurrency === fromCurrency && 
         r.toCurrency === toCurrency && 
         r.isActive
  );
  
  return rate ? amount * rate.rate : amount;
};
```

---

## 🚀 Funcionalidades Especiales

### 1. Drag & Drop de Grupos
- Usa `react-dnd`
- Reordena grupos visualmente
- Actualiza `sortOrder` automáticamente

### 2. Impresión de Cotizaciones
- Componente separado `QuotePrintView`
- Usa `react-to-print`
- Layout optimizado para papel A4
- Logo de la empresa emisora
- Información completa del cliente
- Tabla de actividades por grupo
- Totalizadores y observaciones

### 3. Duplicación de Cotizaciones
- Crea copia completa
- Nuevo número generado automáticamente
- Estado vuelve a DRAFT
- Mantiene toda la estructura de grupos y actividades

### 4. Reportes por Cliente
- Filtra todas las cotizaciones de un cliente
- Agrupa por estado
- Calcula totales
- Exporta para impresión

### 5. Soft Delete
- Ningún registro se elimina físicamente
- Flag `isActive: false` marca como inactivo
- Filtros aplican `.filter(x => x.isActive)`
- Permite "deshacer" en el futuro

---

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`QuoteEditor.tsx`)
- **Funciones**: camelCase (`handleSaveQuote`)
- **Constantes**: UPPER_SNAKE_CASE (`DEFAULT_CURRENCY`)
- **Interfaces**: PascalCase con prefijo I opcional (`Quote`, `IQuote`)
- **Tipos**: PascalCase (`UserRole`, `QuoteStatus`)

### Estructura de Componentes

```typescript
// Imports
import React, { useState } from 'react';
import { Button } from './ui/button';

// Interface de Props
interface MyComponentProps {
  data: SomeType;
  onUpdate: (data: SomeType) => void;
}

// Componente
export function MyComponent({ data, onUpdate }: MyComponentProps) {
  // Estado
  const [localState, setLocalState] = useState(initialValue);
  
  // Handlers
  const handleAction = () => {
    // lógica
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Estado Global (App.tsx)

Todo el estado se gestiona en `App.tsx`:
- Arrays de datos (quotes, clients, users, etc.)
- Funciones de CRUD (`handleUpdateQuotes`, `handleUpdateClients`, etc.)
- Props drilling para componentes hijos
- Sin context API o Redux (simplicidad para MVP)

---

## 🔮 Próximos Pasos / Roadmap

### Backend (Supabase o API Personalizada)
- [ ] Autenticación real (JWT, OAuth)
- [ ] Persistencia de datos en base de datos
- [ ] APIs RESTful
- [ ] Carga de logos/archivos
- [ ] Envío de cotizaciones por email

### Características
- [ ] Comentarios en cotizaciones
- [ ] Historial de cambios (audit log)
- [ ] Plantillas de cotizaciones
- [ ] Biblioteca de actividades predefinidas
- [ ] Firma electrónica
- [ ] Exportación a PDF nativo
- [ ] Dashboard con gráficos avanzados
- [ ] Notificaciones en tiempo real

### Mejoras Técnicas
- [ ] Tests unitarios (Jest, React Testing Library)
- [ ] Tests E2E (Playwright, Cypress)
- [ ] Optimización de rendimiento (React.memo, useMemo)
- [ ] Lazy loading de rutas
- [ ] Service workers / PWA
- [ ] Internacionalización completa (i18n)
- [ ] Temas dark/light mode

---

## 🛠️ Cómo Iniciar el Desarrollo

### Prerrequisitos
- Node.js 18+
- npm o pnpm

### Instalación
```bash
# Clonar repositorio
git clone [repo-url]

# Instalar dependencias
npm install

# Iniciar dev server
npm run dev
```

### Scripts Disponibles
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

### Datos de Prueba

Usuarios mockeados en `mockData.ts`:
- **Admin**: admin@acme.com / password
- **Sales**: sales@acme.com / password
- **Viewer**: viewer@acme.com / password

---

## 📚 Recursos Útiles

### Documentación
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [React Router](https://reactrouter.com/)

### Design System
- [shadcn/ui](https://ui.shadcn.com/) - Componentes base
- [Lucide Icons](https://lucide.dev/) - Iconos

---

## 👥 Contribuyendo

### Workflow
1. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
2. Commitear cambios (`git commit -m 'Agrega nueva funcionalidad'`)
3. Push a branch (`git push origin feature/nueva-funcionalidad`)
4. Abrir Pull Request

### Code Review
- Probar funcionalidad localmente
- Verificar tipos TypeScript
- Validar responsividad
- Verificar accesibilidad básica

---

## 📞 Soporte

Para dudas técnicas, consulte:
- Documentación inline (comentarios en el código)
- Types en `types.ts` (fuente única de verdad)
- Mock data en `mockData.ts` (ejemplos de uso)

---

**Última actualización**: Marzo 2026  
**Versión**: 1.0.0  
**Licencia**: Propietario

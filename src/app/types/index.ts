export type Currency = 'USD' | 'COP';
export type Language = 'ES' | 'EN';
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected';
export type RoleType = 'staff' | 'external';
export type DiscountType = 'percentage' | 'fixed';
export type UserRole = 'ADMIN' | 'SALES' | 'VIEWER';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IssuingCompany {
  id: string;
  tenantId: string;
  name: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
  defaultLanguage: Language;
  defaultCurrency: Currency;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IssuingCompanyUser {
  id: string;
  tenantId: string;
  issuingCompanyId: string;
  userId: string;
  role: UserRole;
  canQuote: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface IssuingCompanySnapshot {
  issuingCompanyId: string;
  name: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
  logoUrl?: string;
}

export interface UserSnapshot {
  userId: string;
  name: string;
  email: string;
}

export interface Client {
  id: string;
  name: string; // Nome fantasia
  legalName?: string; // Razão social
  taxId?: string; // NIT/CNPJ
  countryCode?: string; // ISO code (CO, BR, US)
  city?: string;
  defaultLanguage: Language;
  defaultCurrency: Currency;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientSnapshot {
  clientId: string;
  name: string;
  legalName?: string;
  taxId?: string;
  countryCode?: string;
  city?: string;
}

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  baseCost: number;
  benefits: number; // percentage
  totalCost: number; // calculated
  active: boolean;
}

export interface Activity {
  id: string;
  code: string;
  description: string;
  roleId: string;
  complexity?: string;
  estimatedHours: number;
  unitCost: number; // auto
  totalCost: number; // auto
  salePrice: number; // auto
}

export interface ActivityGroup {
  id: string;
  name: string;
  activities: Activity[];
  order: number;
}

export interface Quotation {
  id: string;
  code: string;
  issuingCompanyId: string; // Reference to issuing company
  clientId: string; // Reference to client
  client: string; // Legacy field - kept for compatibility
  clientSnapshot?: ClientSnapshot; // Frozen client data when published
  issuingCompanySnapshot?: IssuingCompanySnapshot; // Frozen issuing company data when published
  createdBy: string; // User ID
  updatedBy?: string; // User ID
  createdBySnapshot?: UserSnapshot; // Frozen user data when published
  project: string;
  language: Language;
  currency: Currency;
  trm: number; // exchange rate
  securityMargin: number; // percentage
  testingFactor: number; // percentage
  pmFactor: number; // percentage
  discountType: DiscountType;
  discountValue: number;
  activityGroups: ActivityGroup[];
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Parameters {
  hoursPerMonth: number;
  benefits50: number; // percentage
  benefitsIntegral: number; // percentage
  defaultSecurityMargin: number;
  defaultTestingFactor: number;
  defaultPMFactor: number;
  maxItems: number;
}

export interface QuotationSummary {
  subtotalBase: number;
  testing: number;
  pm: number;
  securityMargin: number;
  beforeDiscount: number;
  discount: number;
  totalFinal: number;
  totalUSD: number;
  totalLocal: number;
}

export interface QuotationVersion {
  id: string;
  version: number;
  modifiedBy: string;
  changes: string;
  date: string;
  snapshot: Quotation;
}

import { Quotation, Activity, Role, QuotationSummary } from '../types';

export function calculateUnitCost(
  role: Role,
  hoursPerMonth: number
): number {
  return role.totalCost / hoursPerMonth;
}

export function calculateActivityCost(
  activity: Activity,
  role: Role,
  hoursPerMonth: number
): { unitCost: number; totalCost: number; salePrice: number } {
  const unitCost = calculateUnitCost(role, hoursPerMonth);
  const totalCost = unitCost * activity.estimatedHours;
  const salePrice = totalCost * 1.5; // 50% margin
  
  return { unitCost, totalCost, salePrice };
}

export function calculateQuotationSummary(
  quotation: Quotation
): QuotationSummary {
  // Calculate subtotal from all activities in all groups
  const subtotalBase = quotation.activityGroups.reduce(
    (sum, group) => sum + group.activities.reduce((s, activity) => s + activity.salePrice, 0),
    0
  );

  // Apply factors
  const testing = subtotalBase * (quotation.testingFactor / 100);
  const pm = subtotalBase * (quotation.pmFactor / 100);
  const securityMargin = subtotalBase * (quotation.securityMargin / 100);

  const beforeDiscount = subtotalBase + testing + pm + securityMargin;

  // Apply discount
  let discount = 0;
  if (quotation.discountType === 'percentage') {
    discount = beforeDiscount * (quotation.discountValue / 100);
  } else {
    discount = quotation.discountValue;
  }

  const totalFinal = beforeDiscount - discount;

  // Currency conversion
  let totalUSD = totalFinal;
  let totalLocal = totalFinal;

  if (quotation.currency === 'COP') {
    totalUSD = totalFinal / quotation.trm;
  } else {
    totalLocal = totalFinal * quotation.trm;
  }

  return {
    subtotalBase,
    testing,
    pm,
    securityMargin,
    beforeDiscount,
    discount,
    totalFinal,
    totalUSD,
    totalLocal,
  };
}

export function calculateGroupSubtotal(activities: Activity[]): number {
  return activities.reduce((sum, activity) => sum + activity.salePrice, 0);
}

export function formatCurrency(amount: number, currency: 'USD' | 'COP'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } else {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export function generateQuotationCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100;
  return `COT-${year}-${random}`;
}

export function calculateRoleTotalCost(role: Role): number {
  return role.baseCost * (1 + role.benefits / 100);
}

export function estimateDays(hours: number, hoursPerDay: number = 8): number {
  return Math.ceil(hours / hoursPerDay);
}

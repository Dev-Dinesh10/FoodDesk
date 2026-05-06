/**
 * @file src/utils/formatters.ts
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatTokenNumber = (num: string): string => {
  return num.padStart(3, '0');
};

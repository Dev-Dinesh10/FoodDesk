/**
 * @file src/utils/helpers.ts
 */

import { OrderStatus } from '../types';
import { COLORS } from '../constants/colors';

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'ready':
    case 'collected':
      return COLORS.success;
    case 'preparing':
    case 'accepted':
      return COLORS.warning;
    case 'rejected':
      return COLORS.error;
    default:
      return COLORS.info;
  }
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

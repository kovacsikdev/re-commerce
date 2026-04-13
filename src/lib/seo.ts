import { type Category } from './types';

export const SITE_NAME = 'RE Commerce';
export const SITE_DESCRIPTION =
  'Resident Evil inspired tactical e-commerce store for survival equipment, upgrades, and rapid deployment checkout.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const DEFAULT_OG_IMAGE = '/backgrounds/lab_1.webp';

const CATEGORY_LABELS: Record<Category, string> = {
  weapon: 'Weapons',
  melee: 'Melee',
  medical: 'Medical',
  ammunition: 'Ammunition',
  parts: 'Parts',
};

export const getCategoryLabel = (category: Category): string => CATEGORY_LABELS[category] ?? category;
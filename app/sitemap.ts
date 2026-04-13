import type { MetadataRoute } from 'next';
import { fetchCategory } from '../src/lib/product-api';
import { type Category } from '../src/lib/types';
import { SITE_URL } from '../src/lib/seo';

const CATEGORIES: Category[] = ['weapon', 'melee', 'medical', 'ammunition', 'parts'];

const baseEntries = (): MetadataRoute.Sitemap => [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${SITE_URL}/checkout`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.2,
  },
  ...CATEGORIES.map((category) => ({
    url: `${SITE_URL}/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  })),
];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const entries = baseEntries();

  try {
    const itemsByCategory = await Promise.all(
      CATEGORIES.map(async (category) => fetchCategory(category)),
    );
    const itemIds = new Set(itemsByCategory.flat().map((item) => item.id));

    itemIds.forEach((itemId) => {
      entries.push({
        url: `${SITE_URL}/item/${encodeURIComponent(itemId)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch {
    // Keep sitemap available even if item API is temporarily unavailable.
  }

  return entries;
};

export default sitemap;
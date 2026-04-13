import type { MetadataRoute } from 'next';
import { SITE_URL } from '../src/lib/seo';

const isProd = process.env.NODE_ENV === 'production';

const robots = (): MetadataRoute.Robots => ({
  rules: isProd
    ? {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout'],
      }
    : {
        userAgent: '*',
        disallow: '/',
      },
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;
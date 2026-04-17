import { MetadataRoute } from 'next';
import { getPackages } from '@/app/actions/packages';

const locales = ['en', 'sw', 'es', 'fr', 'de', 'zh', 'ar'];
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asiliyetusafaris.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: packages } = await getPackages();

  const routes = ['', '/about', '/packages'].flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  const packageRoutes = (packages || []).flatMap((pkg) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/packages/${pkg.id}`,
      lastModified: new Date(pkg.updated_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...routes, ...packageRoutes];
}

import { MetadataRoute } from 'next';
import { getPackages } from '@/app/actions/packages';
import { getDestinations } from '@/app/actions/destinations';

const locales = ['en', 'sw', 'es', 'fr', 'de', 'zh', 'ar'];
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asiliyetusafaris.com';
const staticDestinationIds = ['serengeti', 'ngorongoro', 'tarangire', 'kilimanjaro', 'manyara', 'zanzibar'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packagesRes, destinationsRes] = await Promise.all([
    getPackages(),
    getDestinations()
  ]);

  const packages = packagesRes.data || [];
  const destinations = destinationsRes.data || [];

  const routes = ['', '/about', '/packages', '/destinations', '/culture', '/gallery', '/fleet', '/guides'].flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  const packageRoutes = packages.flatMap((pkg) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/packages/${pkg.id}`,
      lastModified: new Date(pkg.updated_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  const destinationIds = Array.from(new Set([
    ...staticDestinationIds,
    ...destinations.map((dest) => dest.id).filter(Boolean),
  ]));

  const destinationRoutes = destinationIds.flatMap((id) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/destinations/${id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...routes, ...packageRoutes, ...destinationRoutes];
}

import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['en', 'sw', 'es', 'fr', 'de', 'zh', 'ar'], // Expanded global language support
  defaultLocale: 'en'
});
 
// Lightweight wrappers around Next.js' navigation APIs
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);

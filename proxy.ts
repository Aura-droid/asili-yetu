import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";

const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 0. Check Maintenance Mode
  const isMaintenancePage = pathname.includes('/maintenance');
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/portal');

  if (!isAdminPath && !isMaintenancePage) {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from("settings")
      .select("is_maintenance_mode")
      .eq("id", 1)
      .single();

    if (settings?.is_maintenance_mode) {
      // Find current locale from pathname or default to 'en'
      const segments = pathname.split('/');
      const locale = routing.locales.includes(segments[1] as any) ? segments[1] : 'en';
      return Response.redirect(new URL(`/${locale}/maintenance`, request.url));
    }
  }

  // 1. Run Supabase Auth Logic
  const supabaseResponse = await updateSession(request);

  // If Supabase forced a redirect (e.g. unauthenticated access to /admin), respect it immediately
  if (supabaseResponse.status >= 300 && supabaseResponse.status < 400) {
    return supabaseResponse;
  }

  // 2. Run i18n Routing Logic ONLY for public routes
  const isPublicRoute = 
    !request.nextUrl.pathname.startsWith('/admin') && 
    !request.nextUrl.pathname.startsWith('/sitemap.xml') && 
    !request.nextUrl.pathname.startsWith('/manifest.json') && 
    !request.nextUrl.pathname.startsWith('/robots.txt');

  if (!isPublicRoute) {
    return supabaseResponse;
  }

  const intlResponse = handleI18nRouting(request);

  // 3. Merge Supabase's fresh tokens/cookies into the i18n response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};

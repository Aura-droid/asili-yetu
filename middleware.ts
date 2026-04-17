import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run Supabase Auth Logic
  const supabaseResponse = await updateSession(request);

  // If Supabase forced a redirect (e.g. unauthenticated access to /admin), respect it immediately
  if (supabaseResponse.status >= 300 && supabaseResponse.status < 400) {
    return supabaseResponse;
  }

  // 2. Run i18n Routing Logic ONLY for public routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

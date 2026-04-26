import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./utils/supabase/middleware";
import { type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Handle Admin routes first
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return await updateSession(request);
  }

  // Handle i18n for others
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the last locale for these paths
    '/(ar|de|en|es|fr|sw|zh)/:path*',

    // Do not localized the admin routes
    '/admin/:path*'
  ],
};

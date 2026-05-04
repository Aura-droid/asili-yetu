"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * ConnectivityGuard watches for browser 'offline' events.
 * It provides a seamless transition to our premium offline experiences.
 */
export default function ConnectivityGuard({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      // Determine if we are in admin or public space
      if (pathname.includes("/admin")) {
        router.push("/admin/offline");
      } else {
        // Find current locale from pathname or default to /en/offline
        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        router.push(`/${locale}/offline`);
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Auto-refresh or redirect back can be handled here
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Initial check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [pathname, router]);

  return <>{children}</>;
}

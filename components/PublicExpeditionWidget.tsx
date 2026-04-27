"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PublicExpeditionWidget() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Jotform embeds its widget directly into the body.
    // If we transition to an admin route, we should hide their injected container.
    // Jotform agents typically use an iframe or a specific div ID. We'll add a global class to the body.
    if (isAdmin) {
      document.body.classList.add("hide-jotform-widget");
    } else {
      document.body.classList.remove("hide-jotform-widget");
    }
  }, [isAdmin]);

  // We only mount the script if the user arrives on a public page.
  // If they reload on an admin page, it never loads.
  if (isAdmin) return null;

  return (
    <Script 
      src="https://cdn.jotfor.ms/agent/embedjs/019d8623ecab70c8a6beeea09498e2e00664/embed.js"
      strategy="lazyOnload"
    />
  );
}

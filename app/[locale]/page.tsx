import Hero from "@/components/Hero";
import InstagramFeed from "@/components/InstagramFeed";
import FunFactBanner from "@/components/FunFactBanner";
import ReviewMarquee from "@/components/ReviewMarquee";
import SafariShowcase from "@/components/SafariShowcase";

import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero />
      <SafariShowcase />
      <FunFactBanner />
      <ReviewMarquee />
      <Suspense fallback={<div className="h-96 flex items-center justify-center bg-foreground/5 animate-pulse rounded-3xl mx-6 md:mx-12 my-24"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
        <InstagramFeed />
      </Suspense>
    </main>
  );
}

import Hero from "@/components/Hero";
import InstagramFeed from "@/components/InstagramFeed";
import FunFactBanner from "@/components/FunFactBanner";
import ReviewMarquee from "@/components/ReviewMarquee";
import SafariShowcase from "@/components/SafariShowcase";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import FeaturedCulture from "@/components/FeaturedCulture";
import FeaturedGallery from "@/components/FeaturedGallery";

import { Suspense } from "react";
import { getPackages } from "@/app/actions/packages";
import { getDestinations } from "@/app/actions/destinations";
import { getCultureStories } from "@/app/actions/culture";
import { getManualGallery } from "@/app/actions/gallery";

export default async function Home() {
  const [
    packagesRes,
    destinationsRes,
    storiesRes,
    galleryRes
  ] = await Promise.all([
    getPackages(),
    getDestinations(),
    getCultureStories(),
    getManualGallery()
  ]);

  // Filter masterpieces
  const featuredPackages = (packagesRes.data || []).filter(p => p.is_featured);
  const featuredDestinations = (destinationsRes.data || []).filter(d => d.is_featured);
  const featuredStories = (storiesRes || []).filter(s => s.is_featured);
  const featuredItems = (galleryRes.data || []).filter(i => i.is_featured);

  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero featuredPackages={featuredPackages || []} />
      <FeaturedDestinations destinations={featuredDestinations || []} />
      <FeaturedGallery items={featuredItems || []} />
      <SafariShowcase />
      <FeaturedCulture stories={featuredStories || []} />
      <FunFactBanner />
      <ReviewMarquee />
      <Suspense fallback={<div className="h-96 flex items-center justify-center bg-foreground/5 animate-pulse rounded-3xl mx-6 md:mx-12 my-24"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
        <InstagramFeed />
      </Suspense>
    </main>
  );
}

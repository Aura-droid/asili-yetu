import Hero from "@/components/Hero";
import FeaturedPackagesMarquee from "@/components/FeaturedPackagesMarquee";
import InstagramFeed from "@/components/InstagramFeed";
import FunFactBanner from "@/components/FunFactBanner";
import ReviewMarquee from "@/components/ReviewMarquee";
import SafariShowcase from "@/components/SafariShowcase";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import FeaturedCulture from "@/components/FeaturedCulture";
import FeaturedGallery from "@/components/FeaturedGallery";
import WhyUs from "@/components/WhyUs";
import ResponsibleTourism from "@/components/ResponsibleTourism";

import { Suspense } from "react";
import { getPackages } from "@/app/actions/packages";
import { getDestinations } from "@/app/actions/destinations";
import { getCultureStories } from "@/app/actions/culture";
import { getManualGallery } from "@/app/actions/gallery";

import ScrollReveal from "@/components/ScrollReveal";

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
      
      <ScrollReveal>
        <FeaturedPackagesMarquee packages={featuredPackages || []} />
      </ScrollReveal>
      
      <ScrollReveal>
        <FeaturedDestinations destinations={featuredDestinations || []} />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <FeaturedGallery items={featuredItems || []} />
      </ScrollReveal>

      <ScrollReveal>
        <SafariShowcase />
      </ScrollReveal>

      <ScrollReveal>
        <WhyUs />
      </ScrollReveal>

      <ScrollReveal>
        <FeaturedCulture stories={featuredStories || []} />
      </ScrollReveal>

      <ScrollReveal>
        <ResponsibleTourism />
      </ScrollReveal>

      <ScrollReveal>
        <FunFactBanner />
      </ScrollReveal>

      <ScrollReveal>
        <ReviewMarquee />
      </ScrollReveal>

      <ScrollReveal>
        <Suspense fallback={<div className="h-96 flex items-center justify-center bg-foreground/5 animate-pulse rounded-3xl mx-6 md:mx-12 my-24"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
          <InstagramFeed />
        </Suspense>
      </ScrollReveal>
    </main>
  );
}

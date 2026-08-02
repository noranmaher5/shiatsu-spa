import type { Metadata } from "next";
import { HeroSection, AboutTeaser } from "@/features/settings";
import { FeaturedServicesSection } from "@/features/services";
import { BranchesSection } from "@/features/branches";
import { TestimonialsSection } from "@/features/testimonials";
import { GallerySection } from "@/features/gallery";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shiatsu Spa Kuwait — Professional Japanese therapeutic massage, body treatments, and luxury wellness across two Kuwait branches.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutTeaser />
      <FeaturedServicesSection />
      <BranchesSection />
      <TestimonialsSection />
      <GallerySection />
      
    </>
  );
}

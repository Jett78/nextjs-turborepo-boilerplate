import { getPageSeoForMetadata } from "@/actions/page-seo-action";
import type { Metadata } from "next";
import StatsSection from "@/components/sections/about/stats-section";
import StorySection from "@/components/sections/about/story-section";
import FeaturesSection from "@/components/sections/about/features-section";
import WhyChooseSection from "@/components/sections/about/why-choose-section";
import CTASection from "@/components/sections/about/cta-section";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoForMetadata("/about");

  return {
    title: seo?.metaTitle ?? "About Us",
    description: seo?.metaDescription ?? "",
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? "About Us",
      description: seo?.ogDescription ?? seo?.metaDescription ?? "",
      images: seo?.ogImageKey ? [{ url: seo.ogImageKey }] : [],
    },
  };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <StorySection />
      <StatsSection />
      <FeaturesSection />
      <WhyChooseSection />
      <CTASection />
    </div>
  );
}

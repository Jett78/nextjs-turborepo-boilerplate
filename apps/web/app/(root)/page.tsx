import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Testimonials } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq-section";
import StorySection from "@/components/sections/about/story-section";
import BlogSection from "@/components/sections/blog-section";
import { getBlogs } from "@/actions/blog-action";

export default async function Home() {
  const posts = await getBlogs({ take: 3, isActive: true });

  return (
    <>
      <Hero />
      <StorySection />
      <Features />
      <BlogSection posts={posts} />
      <Testimonials />
      <FaqSection />
    </>
  );
}

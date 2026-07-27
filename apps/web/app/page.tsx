import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Blog } from "@/components/sections/blog";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Blog />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

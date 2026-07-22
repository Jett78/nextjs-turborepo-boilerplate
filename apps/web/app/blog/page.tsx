import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog-card";
import { getBlogs } from "@/actions/blog-action";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export const metadata = {
  title: "Blog | Page",
  description: "Read our latest blog posts and insights.",
};

export default async function BlogPage() {
  const posts = await getBlogs({ take: 50, isActive: true });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Blog
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              All Posts
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Insights, tutorials, and updates from our team.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} blog={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

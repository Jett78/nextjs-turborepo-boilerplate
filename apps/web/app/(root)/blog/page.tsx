import PageBanner from "@/components/page-banner";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog-card";
import { getBlogs } from "@/actions/blog-action";

export const metadata = {
  title: "Blog | Page",
  description: "Read our latest blog posts and insights.",
};

export default async function BlogPage() {
  const posts = await getBlogs({ take: 50, isActive: true });

  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        img="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Blog"
        path="blog"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
    </div>
  );
}

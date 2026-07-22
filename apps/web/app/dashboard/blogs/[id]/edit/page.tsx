import { Button } from "@/components/ui/button";
import { BlogForm } from "@/components/dashboard/blog-form";
import Link from "next/link";

async function getBlog(id: string) {
  const res = await fetch(`http://localhost:4000/blogs/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Blog Not Found</h1>
            <p className="text-muted-foreground">The blog you're looking for doesn't exist.</p>
          </div>
          <Link href="/dashboard/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Blog</h1>
          <p className="text-muted-foreground">Update blog post</p>
        </div>
        <Link href="/dashboard/blogs">
          <Button variant="outline">Back to Blogs</Button>
        </Link>
      </div>
      <BlogForm blog={blog} />
    </div>
  );
}

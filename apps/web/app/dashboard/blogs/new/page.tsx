import { Button } from "@/components/ui/button";
import { BlogForm } from "@/components/dashboard/blog-form";
import Link from "next/link";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Blog</h1>
          <p className="text-muted-foreground">Add a new blog post</p>
        </div>
        <Link href="/dashboard/blogs">
          <Button variant="outline">Back to Blogs</Button>
        </Link>
      </div>
      <BlogForm />
    </div>
  );
}

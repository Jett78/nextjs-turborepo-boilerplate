import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogList } from "@/components/dashboard/blog-list";

export default function BlogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/blogs/new">
          <Button>Create Blog</Button>
        </Link>
      </div>
      <BlogList />
    </div>
  );
}

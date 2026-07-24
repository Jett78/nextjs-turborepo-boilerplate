import { BlogForm } from "@/components/dashboard/blog-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getBlog(id: string) {
  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
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
        <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Blog Not Found</h1>
          <BreadCrumbs path="blogs" page="Edit" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog</h1>
        <BreadCrumbs path="blogs" page="Edit" />
      </div>
      <BlogForm blog={blog} />
    </div>
  );
}

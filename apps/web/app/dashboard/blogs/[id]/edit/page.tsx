import { getBlogById } from "@/actions/blog-action";
import { BlogForm } from "@/components/dashboard/blog-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Blog</h2>
        <BreadCrumbs path="blogs" page="Edit" />
      </div>
      {blog ? <BlogForm blog={blog} /> : <NoData title="Blog" />}
    </div>
  );
}

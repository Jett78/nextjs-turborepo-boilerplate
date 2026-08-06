import { BlogForm } from "@/components/dashboard/blog-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Create New Blog</h2>
        <BreadCrumbs path="blogs" page="Add" />
      </div>
      <BlogForm />
    </div>
  );
}

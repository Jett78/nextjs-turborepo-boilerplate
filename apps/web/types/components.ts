export interface GetBlogsParams {
  skip?: number;
  take?: number;
  search?: string;
  isActive?: boolean;
}

export interface BlogFormProps {
  blog?: import("./blog").Blog;
}

export interface DeleteBlogButtonProps {
  id: string;
}

export interface BlogCardProps {
  blog: import("./blog").Blog;
  variant?: "default" | "featured";
}

export interface FileUploadProps {
  onSuccess?: (value: string) => void;
  defaultImage?: string;
  className?: string;
  returnType?: "url" | "key";
  accept?: string;
}

export interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export interface TestimonialFormProps {
  testimonial?: import("./testimonial").Testimonial;
}

export interface DeleteTestimonialButtonProps {
  id: string;
}

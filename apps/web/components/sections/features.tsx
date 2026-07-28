import PageHeader from "@/components/ui/page-header";
import {
  Zap,
  Code2,
  Palette,
  Layers,
  Database,
  Shield,
  Globe,
  Box,
  Cpu,
  Cloud,
  FileText,
  FormInput,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Next.js 16",
    description: "App Router, Server Components, and Turbopack for blazing fast performance.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description: "End-to-end type safety across frontend and backend with strict mode.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Palette,
    title: "Tailwind CSS 4",
    description: "Utility-first CSS with PostCSS integration and theme support.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Layers,
    title: "Turborepo",
    description: "Monorepo with incremental builds, caching, and workspace management.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Database,
    title: "Drizzle ORM",
    description: "Type-safe SQL ORM for PostgreSQL with migrations and studio.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Shield,
    title: "Better Auth",
    description: "Authentication with JWT tokens, refresh tokens, and session management.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Globe,
    title: "NestJS API",
    description: "Backend with modules, controllers, services, guards, and Swagger docs.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Cpu,
    title: "React Query",
    description: "TanStack React Query for server state, caching, and mutations.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: FormInput,
    title: "React Hook Form",
    description: "Performant forms with validation, field-level errors, and Zod schemas.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Cloud,
    title: "AWS S3 Upload",
    description: "File uploads with presigned URLs and S3 bucket integration.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    icon: FileText,
    title: "TipTap Editor",
    description: "Rich text editor with tables, images, placeholders, and extensions.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Box,
    title: "Shadcn UI",
    description: "Reusable components with Radix primitives and Tailwind styling.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Built with modern tools"
          subtitle="Tech Stack"
          desc="A production-ready boilerplate with everything you need to build scalable web applications."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border bg-background p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg} ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

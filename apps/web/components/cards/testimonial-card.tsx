import { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "from-violet-500 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-fuchsia-500 to-purple-600",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index]!;
}

const TestimonialCard = ({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "group  relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6  transition-all duration-300",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="text-primary/20 group-hover:text-primary/40 absolute top-6 right-6 h-10 w-10 transition-colors"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2z"
          clipRule="evenodd"
        />
      </svg>

      <div className="flex items-center gap-4">
        <div className="relative">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={56}
              height={56}
              className="ring-primary/20 h-14 w-14 rounded-full object-cover ring-2"
            />
          ) : (
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ring-2 ring-primary/20",
                getAvatarColor(testimonial.name)
              )}
            >
              {getInitials(testimonial.name)}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">
            {testimonial.name}
          </p>
          {testimonial.designation && (
            <p className="text-muted-foreground text-xs">
              {testimonial.designation}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-700 md:text-sm">
        &ldquo;{testimonial.message}&rdquo;
      </p>
    </div>
  );
};

export default TestimonialCard;

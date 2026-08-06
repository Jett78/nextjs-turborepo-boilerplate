import { notFound } from "next/navigation";
import { getTeamMemberBySlug } from "@/actions/team-action";
import { MessageCircle, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) return { title: "Team Member Not Found" };

  return {
    title: `${member.name} - Team`,
    description: member.message || `Meet ${member.name}${member.designation ? `, ${member.designation}` : ""}`,
    openGraph: {
      title: member.name,
      description: member.message || "",
      images: member.avatar ? [{ url: member.avatar }] : [],
    },
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) notFound();

  return (
    <section className="py-24 sm:py-32 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primarymain transition-colors mb-12"
        >
          <ArrowLeft className="size-4" />
          Back to About
        </Link>

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-950/5 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Profile Picture - Right Side (visually on larger screens) */}
            <div className="relative bg-gradient-to-br from-primarymain to-indigo-700 p-12 lg:p-16 flex items-center justify-center order-1 lg:order-2">
              <div className="relative">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={288}
                    height={288}
                    className="size-64 sm:size-72 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl"
                  />
                ) : (
                  <div className="size-64 sm:size-72 rounded-2xl bg-white/10 flex items-center justify-center text-white font-bold text-7xl ring-4 ring-white/20 shadow-2xl">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {member.whatsappUrl && (
                  <a
                    href={member.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -bottom-3 -right-3 size-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="size-6" />
                  </a>
                )}
              </div>
            </div>

            {/* Message - Left Side (visually on larger screens) */}
            <div className="p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  {member.name}
                </h1>

                {member.designation && (
                  <p className="mt-2 text-lg font-semibold text-primarymain">
                    {member.designation}
                  </p>
                )}

                {member.joinedDate && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="size-4" />
                    <span>
                      Joined{" "}
                      {new Date(member.joinedDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {member.message && (
                <div className="mt-8">
                  <div className="w-12 h-1 rounded-full bg-primarymain mb-6" />
                  <p className="text-base leading-relaxed text-slate-600 whitespace-pre-line">
                    {member.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

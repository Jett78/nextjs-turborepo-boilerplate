import { MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { TeamMember } from "@/types/team";

interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <Link
      href={`/about/team/${member.slug}`}
      className="group block relative bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-950/5 hover:shadow-lg hover:ring-primarymain/20 transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {member.avatar ? (
            <Image
              src={member.avatar}
              alt={member.name}
              width={96}
              height={96}
              className="size-24 rounded-full object-cover ring-4 ring-white shadow-md"
            />
          ) : (
            <div className="size-24 rounded-full bg-gradient-to-br from-primarymain to-indigo-600 flex items-center justify-center text-white font-bold text-3xl ring-4 ring-white shadow-md">
              {member.name.charAt(0).toUpperCase()}
            </div>
          )}
          {member.whatsappUrl && (
            <span className="absolute -bottom-1 -right-1 size-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <MessageCircle className="size-4" />
            </span>
          )}
        </div>

        <h3 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-primarymain transition-colors">
          {member.name}
        </h3>

        {member.designation && (
          <p className="mt-1 text-sm font-medium text-primarymain">
            {member.designation}
          </p>
        )}

        {member.joinedDate && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="size-3.5" />
            <span>
              Joined{" "}
              {new Date(member.joinedDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

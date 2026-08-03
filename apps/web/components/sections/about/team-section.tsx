import { getTeamMembers } from "@/actions/team-action";
import TeamCard from "./team-card";
import AnimatedCard from "./animated-card";

export default async function TeamSection() {
  const teamMembers = await getTeamMembers();

  if (teamMembers.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
            Our Team
          </span>
          <h2 className="mt-8 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Meet the people behind
            <span className="block text-primarymain">our success.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto">
            A dedicated team of professionals committed to delivering excellence
            and driving innovation forward.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member, i) => (
            <AnimatedCard key={member.id} index={i}>
              <TeamCard member={member} />
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}

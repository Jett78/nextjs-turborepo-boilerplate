import { getTeamMemberById } from "@/actions/team-action";
import { TeamMemberForm } from "@/components/dashboard/team-member-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teamMember = await getTeamMemberById(id);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Team Member</h2>
        <BreadCrumbs path="team" page="Edit" />
      </div>
      {teamMember ? <TeamMemberForm teamMember={teamMember} /> : <NoData title="Team Member" />}
    </div>
  );
}

import { TeamMemberForm } from "@/components/dashboard/team-member-form";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { TeamMember } from "@/types/team";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiClient<{ data: TeamMember }>(
    `${API_ROUTES.TEAM}/${id}`,
    { next: { tags: [`team-member-${id}`] } }
  );

  const teamMember = res.data;

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Team Member</h2>
        <BreadCrumbs path="team" page="Edit" />
      </div>
      <TeamMemberForm teamMember={teamMember} />
    </div>
  );
}

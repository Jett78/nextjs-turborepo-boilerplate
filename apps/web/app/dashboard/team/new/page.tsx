import { TeamMemberForm } from "@/components/dashboard/team-member-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Add New Team Member</h1>
        <BreadCrumbs path="team" page="Add" />
      </div>
      <TeamMemberForm />
    </div>
  );
}

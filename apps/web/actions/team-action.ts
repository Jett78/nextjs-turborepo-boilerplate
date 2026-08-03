"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { TeamMember, TeamMembersApiResponse, TeamMemberApiResponse } from "@/types/team";

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await apiClient<TeamMembersApiResponse>(
      `${API_ROUTES.TEAM}?sortBy=sortOrder&sortOrder=asc`,
      { next: { tags: ["team-members"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const response = await apiClient<TeamMemberApiResponse>(
      `${API_ROUTES.TEAM}/slug/${slug}`,
      { next: { tags: [`team-member-${slug}`] } }
    );

    if (!response || !response.success || !response.data) return null;
    return response.data || null;
  } catch (error) {
    console.error("Error fetching team member:", error);
    return null;
  }
}

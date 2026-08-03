import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface TeamMember extends BaseEntity {
  name: string;
  slug: string;
  designation?: string;
  joinedDate?: Date;
  message?: string;
  avatar?: string;
  whatsappUrl?: string;
  sortOrder: number;
}

export interface TeamMembersApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TeamMember[];
}

export interface TeamMemberApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TeamMember;
}

export type TeamMemberListResponse = CommonResponse<PaginatedResponse<TeamMember>>;
export type TeamMemberResponse = CommonResponse<TeamMember>;

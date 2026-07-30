import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  image: string | null;
  phone?: string;
  address?: string;
}

export type UserListResponse = CommonResponse<PaginatedResponse<User>>;
export type UserResponse = CommonResponse<User>;

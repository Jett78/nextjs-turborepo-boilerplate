import { BaseEntity } from "./base-entity";

export interface Redirect extends BaseEntity {
  fromPath: string;
  toPath: string;
  isActive: boolean;
}

export interface RedirectResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Redirect;
}

export interface RedirectListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Redirect[];
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

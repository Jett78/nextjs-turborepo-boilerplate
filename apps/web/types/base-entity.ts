export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommonResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      role: string;
    };
    token: string;
  };
}

export interface LoginResult {
  success: boolean;
  token?: string;
  error?: string;
}

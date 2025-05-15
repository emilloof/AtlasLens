import { apiRequest, ApiResponse } from "./api-clients";

interface LoginCredentials {
  id: string;
  password: string;
}

interface LoginResponse {
  userId: string;
  token?: string;
}

interface RegisterData {
  user_name: string;
  id: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> =>
    apiRequest<LoginResponse>("login", {
      method: "POST",
      body: credentials,
    }),
};

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
  userName: string;
  id: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> =>
    apiRequest<LoginResponse>("login", {
      method: "POST",
      body: credentials,
    }),

  signup: (userData: RegisterData): Promise<ApiResponse<LoginResponse>> =>
    apiRequest<LoginResponse>("signup", {
      method: "POST",
      body: userData,
    }),

  signout: (): Promise<ApiResponse<void>> =>
    apiRequest<void>("logout", {
      method: "POST",
      body: {},
    }),
};

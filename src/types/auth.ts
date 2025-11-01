export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  theme?: "LIGHT" | "DARK";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    theme: string;
    createdAt: string;
  };
  token: string;
}

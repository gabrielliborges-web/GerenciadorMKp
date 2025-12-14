export interface SignupRequest {
  nome: string;
  email: string;
  senha: string;
  theme?: "LIGHT" | "DARK";
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  usuario: {
    id: number;
    nome: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
    theme?: "DARK" | "LIGHT" | null;
    ativo: boolean;
    criadoEm: string;
    atualizadoEm: string;
  };
  token: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

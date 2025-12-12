export interface LoginRequest {
  email: string | null;
  password: string | null;
}

export interface RegisterRequest {
  email: string | null;
  password: string | null;
  personName: string | null;
  gender: Gender;
}

export interface AuthenticationResponse {
  userID: string;
  email: string;
  personName: string | null;
  gender: string | null;
  token: string;
  success: boolean;
}

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}

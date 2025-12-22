export interface LoginRequest {
  email: string | null;
  password: string | null;
}

export interface RegisterRequest {
  email: string | null;
  password: string | null;
  personName: string | null;
  gender: Gender;
  roleName: string;
}

export interface AuthenticationResponse {
  userID: string;
  email: string;
  personName: string | null;
  gender: string | null;
  token: string;
  success: boolean;
  roles?: string[];
}

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Manager = 'Manager'
}

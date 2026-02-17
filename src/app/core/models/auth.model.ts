export interface AuthResponse {
  token: string;
}

export interface PayloadAuth {
 username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  position: string;
  imgProfile: string;
  dateJoined: string;
  roles: string[];
}

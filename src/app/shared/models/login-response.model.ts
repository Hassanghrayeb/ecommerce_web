export interface LoginResponse {
    access_token: string;
    expires_in: string;
    refresh_token: string;
    token_type: string;
    user_validation: UserValidation;
    user_profile: UserProfile;
}

export interface UserProfile {
    id: number;
    username: string;
    roles: Role[];
    person: Person;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
    type?: string;
}

export interface Permission {
    id: number;
    name: string;
    description: string;
}

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserValidation {
  missingRequiredFieldList: string[];
  message: string;
}


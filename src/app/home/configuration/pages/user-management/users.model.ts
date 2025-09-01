import { Role } from 'src/app/shared/models/login-response.model';

export interface UserModel {
  username: string;
  password?: string;
  enabled?: boolean;
  id?: number;
  person?: PersonModel;
  roles?: Role[] | number[];
  updateTimestamp?: string;
}

export interface UserOverviewModel {
  username: string;
  id: number;
  added?: boolean;
}

export interface PersonModel {
  mobileNumber?: string;
  email?: string;
}

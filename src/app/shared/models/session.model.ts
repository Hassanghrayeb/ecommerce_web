import { Role } from "./login-response.model";

export class SessionModel {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  token_type: string;
  roles: Role[];
  user_id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;

  get tokenType(): string {
    return this.token_type;
  }
  get accessToken(): string {
    return this.access_token;
  }
  get expiresIn(): string {
    return this.expires_in;
  }
  get usetId(): number {
    return this.user_id;
  }
  get refreshToken(): string {
    return this.refresh_token;
  }
  get userName(): string {
    return this.username;
  }
}

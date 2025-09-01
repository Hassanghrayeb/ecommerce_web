export interface UserRegistrationModel{
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    confirmPassword: string;
  }


export interface UserRegistrationResponse {
  userRegistrationDTO: UserRegistrationModel;
}
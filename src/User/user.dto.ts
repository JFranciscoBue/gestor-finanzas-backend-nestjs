export interface IuserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IuserLoginDto {
  email: string;
  password: string;
}

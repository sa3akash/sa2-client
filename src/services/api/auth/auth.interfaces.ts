export interface ISigninData {
  username: string;
  password: string;
}

export interface ISignUpData {
  email: string;
  username: string;
  password: string;
  avatarColor: string;
  avatarImage: string;
}
export interface IResetPasswordData {
  password: string;
  confirmPassword: string;
}

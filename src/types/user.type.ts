export default interface IUser {
  id?: Number,
  username: string,
  email: string,
  password: string,
  confirmPassword?: string,
  agreeTerms?: boolean,
  agreePrivacy?: boolean,
  roles?: Array<string>
  rememberMe: boolean,
}
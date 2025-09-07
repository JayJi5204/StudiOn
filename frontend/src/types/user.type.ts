export default interface IUser {
  id?: number | null,
  username: string,
  email: string,
  password: string,
  roles?: Array<string>
}
export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface IPost {
  id: string;
  content: string;
  userId: string;
  user?: IUser
}

export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  profileType: "PUBLIC" | "PRIVATE";
  _count?: {
    followers: number;
    following: number;
    posts: number;
  };
}

export interface IPost {
  id: string;
  content: string;
  userId: string;
  user?: IUser;
  image?: string;
  likes?: IUser[];
  _count?: {
    likes: number;
    comments: number;
  };
}

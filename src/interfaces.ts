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
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: string;
  upatedAt: string;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  userId: string;
  user?: IUser;
  post?: IPost;
  _count: {
    replies: number;
  };
}

export interface ICommentReply {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: IUser;
  parentCommentId: string;
}

export interface IRequestUser extends IUser {
  followers: {
    id: string;
    isFollowing: "TRUE" | "PENDING" | "FALSE";
  }[];
}

export interface IFollowUser {
  id: string;
  requestBy?: IRequestUser;
  requestTo?: IRequestUser;
}

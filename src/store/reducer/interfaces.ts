export interface UserDoc {
  _id: string;
  authId: string;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: any[];
  blockedBy: any[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  createdAt?: Date;
}
export interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

export interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

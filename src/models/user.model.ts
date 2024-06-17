import { PostModel } from './post.model';

export class UserModel {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: PostModel[];
  following?: UserModel[];
  followers?: UserModel[];
}

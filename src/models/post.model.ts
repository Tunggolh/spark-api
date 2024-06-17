import { UserModel } from './user.model';

export class PostModel {
  id: number;
  content: string;
  author: UserModel;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  likers?: UserModel[];
}

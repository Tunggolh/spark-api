import { UserModel } from './user.model';

export class PostModel {
  id: number;
  content: string;
  creator: UserModel;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  likers?: UserModel[];
}

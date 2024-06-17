import { PostModel } from './post.model';
import { UserModel } from './user.model';

export class LikeModel {
  id: number;
  post: PostModel;
  user: UserModel;
}

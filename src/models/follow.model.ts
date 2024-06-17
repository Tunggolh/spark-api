import { UserModel } from './user.model';

export class FollowModel {
  id: number;
  follower: UserModel;
  following: UserModel;
}

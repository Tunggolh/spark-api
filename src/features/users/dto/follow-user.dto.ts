import { IsNumber } from 'class-validator';

export class FollowUserDto {
  @IsNumber()
  user: number;

  @IsNumber()
  follower: number;
}

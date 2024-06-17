import { IsEnum, IsNumber } from 'class-validator';
import { FollowActionEnum } from 'src/common/enums/follow-action.enum';

export class FollowUserDto {
  @IsNumber()
  follower: number;

  @IsEnum(FollowActionEnum)
  action: number;
}

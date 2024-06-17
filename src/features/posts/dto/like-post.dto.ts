import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { LikeActionEnum } from 'src/common/enums/like-action.enum';

export class LikePostDto {
  @IsNotEmpty()
  @IsNumber()
  liker: number;

  @IsEnum(LikeActionEnum)
  action: number;
}

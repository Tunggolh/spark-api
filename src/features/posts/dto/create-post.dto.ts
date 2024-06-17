import { IsNumber, IsString } from 'class-validator';
import { UpdatePostDto } from './update-post.dto';

export class CreatePostDto extends UpdatePostDto {
  @IsNumber()
  author: number;
}

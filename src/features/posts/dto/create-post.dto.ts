import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsNumber()
  author: number;
}

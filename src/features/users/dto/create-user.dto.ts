import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { isUnique } from 'src/common/decorators/unique.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @isUnique({ tableName: 'user', column: 'username' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @isUnique({ tableName: 'user', column: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

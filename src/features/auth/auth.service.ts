import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser({ username, password }: AuthDto) {
    const user = await this.userService.findOneBy({ username });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const userPayload = { id: user.id, username: user.username };
      return this.jwtService.sign(userPayload);
    }
  }
}

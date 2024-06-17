import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const user = await this.authService.validateUser(authDto);

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    return user;
  }
}

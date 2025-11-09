import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IsPublic } from '../common/decorator/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @IsPublic()
  signUp(@Body() body: RegisterUserDto) {
    return this.authService.registerUser(body);
  }

  @Post('sign-in')
  @IsPublic()
  signIn(@Body() body: LoginUserDto) {
    return this.authService.loginWithEmail(body);
  }
}

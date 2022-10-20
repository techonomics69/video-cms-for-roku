import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto, CreateUserDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'user logged in successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'invalid credentials',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }
}

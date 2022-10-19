import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('')
  getAllUsers() {
    return this.userService.getAll();
  }

  @Get('me')
  getCurrentUser(@Req() req: Request) {
    return req.user;
  }
}

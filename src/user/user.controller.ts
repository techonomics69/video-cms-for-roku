import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from './user.model';
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
  getCurrentUser(@GetUser('') user): User {
    return user;
  }
}

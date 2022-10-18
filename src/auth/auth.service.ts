import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { MongoError } from 'mongodb';
import { Model } from 'mongoose';

import { CreateUserDto, UserLoginDto } from './dto';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async login(dto: UserLoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
        HttpStatus.FORBIDDEN,
      );
    }
    const isMatch = await argon.verify(user.password, dto.password);

    if (!isMatch) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.signInToken(user._id, user.email);
  }

  async signup(dto: CreateUserDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = new this.userModel({
        fullName: dto.fullName,
        password: hash,
        email: dto.email,
      });
      const result = await user.save();
      return this.signInToken(result._id, result.email);
    } catch (err) {
      if (err instanceof MongoError) {
        if (err.code === 11000) {
          throw new BadRequestException('this email is already registered');
        }
      } else {
        throw err;
      }
    }
  }

  async signInToken(userId: number, email: string): Promise<{ token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    return { token: token };
  }
}

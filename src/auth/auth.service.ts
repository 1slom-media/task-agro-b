import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UsersEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { compare } from '../utils/compare';
import { hashed } from 'src/utils/hashed';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expire refresh token');
    }

    const userExists = await this.usersService.findOne(payload.sub);

    if (!userExists) {
      throw new BadRequestException('User no longer exists');
    }

    const expiresIn = 15000;
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      { ...payload, expiration },
      { secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') },
    );
    res.cookie('access_token', accessToken, { httpOnly: true });
    return accessToken;
  }

  private async issueToken(user: UsersEntity, res: Response) {
    const payload = { username: user.fullname, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '150sec',
      },
    );
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
    if (payload.role === 'admin') {
      res.cookie('admin', payload.role, { httpOnly: true });
    }
    res.cookie('access_token', accessToken, { httpOnly: true });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    return { user };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findEmail(loginDto.email);
    if (user && (await compare(loginDto.password, user.password))) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto, res: Response) {
    const existingUser = await this.usersService.findEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException({ email: 'Email already in use' });
    }
    const password = await hashed(registerDto.password);
    const user = await this.usersService.createUsers(
      registerDto.fullname,
      registerDto.email,
      password,
      registerDto.role,
    );

    return this.issueToken(user, res);
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new BadRequestException({
        invalidCredentials: 'Invalid credentials',
      });
    }
    return this.issueToken(user, res);
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return 'Successfully logged out';
  }
}

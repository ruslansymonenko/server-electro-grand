import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ITokens } from '../types/auth.types';
import { IUserReturnInfo, UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';

interface IAuthService {
  login(dto: AuthDto): Promise<IAuthServiceResponse>;
  register(dto: AuthDto): Promise<IAuthServiceResponse>;
  getNewTokens(refreshToken: string): Promise<IAuthServiceResponse>;
  createTokens(userId: number): Promise<ITokens>;
  addRefreshTokenToResponse(res: Response, refreshToken: string): void;
  removeRefreshTokenFromResponse(res: Response): void;
  validateUser(dto: AuthDto): Promise<User | null>;
  returnUserFields(user: User): IUserReturnInfo;
}

export interface IAuthServiceResponse {
  user: IUserReturnInfo;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService implements IAuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto): Promise<IAuthServiceResponse> {
    try {
      const user = await this.validateUser(dto);

      if (!user) throw new BadRequestException('Wrong data!');

      const tokens: ITokens = await this.createTokens(user.id);

      return {
        user: this.returnUserFields(user),
        ...tokens,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Authorization error: ${error.message}`,
        error.message,
      );
    }
  }

  async register(dto: AuthDto): Promise<IAuthServiceResponse> {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (isUser) throw new BadRequestException('User already exists');

      const newUser: User | null = await this.userService.create(dto);

      if (!newUser) throw new BadGatewayException('User was not created, please try later');

      const tokens: ITokens = await this.createTokens(newUser.id);

      return {
        user: this.returnUserFields(newUser),
        ...tokens,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Authorization error: ${error.message}`,
        error.message,
      );
    }
  }

  async getNewTokens(refreshToken: string): Promise<IAuthServiceResponse> {
    try {
      let result;
      try {
        result = await this.jwt.verifyAsync(refreshToken);
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token');
        } else {
          throw error;
        }
      }

      if (!result) throw new UnauthorizedException('Invalid token');

      const isUser = await this.userService.findById(result.id);

      if (!isUser) throw new NotFoundException('User not found');

      const tokens = await this.createTokens(isUser.id);

      return {
        user: this.returnUserFields(isUser),
        ...tokens,
      };
    } catch (error) {
      throw new InternalServerErrorException('Server error', error.message);
    }
  }

  async createTokens(userId: number): Promise<ITokens> {
    try {
      const user = await this.userService.findById(userId);
      const data: { id: number; role: string } = { id: userId, role: user.userRole };

      const accessToken: string = this.jwt.sign(data, { expiresIn: '1h' });
      const refreshToken: string = this.jwt.sign(data, { expiresIn: '7d' });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException('Server error', error.message);
    }
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn: Date = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      //lax if production
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response): void {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      //lax if production
      sameSite: 'none',
    });
  }

  async validateUser(dto: AuthDto): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      const isValid = await verify(user.password, dto.password);

      if (!isValid) throw new UnauthorizedException('Invalid password');

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Wrong user data', error.message);
    }
  }

  returnUserFields(user: User): IUserReturnInfo {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}

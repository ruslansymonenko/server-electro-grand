import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthAdminDto, AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ITokens } from '../types/auth.types';
import { IUserReturnInfo, UserService } from '../user/user.service';
import { EnumUserRoles, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import { sign } from 'jsonwebtoken';

interface IAuthService {
  login(dto: AuthDto): Promise<IAuthServiceResponse>;
  register(dto: AuthDto): Promise<IAuthServiceResponse>;
  registerAdmin(dto: AuthAdminDto): Promise<IAuthServiceResponse>;
  loginAdmin(dto: AuthAdminDto): Promise<IAuthServiceResponse>;
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
  staffInfo?: any;
}

@Injectable()
export class AuthService implements IAuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';
  ADMIN_TOKEN_NAME = 'adminToken';

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

  async registerAdmin(dto: AuthAdminDto): Promise<IAuthServiceResponse> {
    try {
      if (dto.secretKey !== process.env.SECRET_KEY) {
        throw new BadRequestException('Invalid secret key');
      }

      const isUser = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (isUser) throw new BadRequestException('User already exists');

      const newUser: User | null = await this.userService.createAdmin(dto);

      if (!newUser) throw new BadGatewayException('User was not created, please try later');

      const tokens: ITokens = await this.createTokens(newUser.id);
      const adminToken = this.createAdminToken(newUser.id, newUser.userRole);

      return {
        user: this.returnUserFields(newUser),
        ...tokens,
        staffInfo: {
          adminToken: adminToken,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Authorization error: ${error.message}`,
        error.message,
      );
    }
  }

  async loginAdmin(dto: AuthAdminDto): Promise<IAuthServiceResponse> {
    try {
      if (dto.secretKey !== process.env.SECRET_KEY) {
        throw new BadRequestException('Invalid secret key');
      }

      const user = await this.validateUser(dto);

      if (!user) throw new BadRequestException('Wrong data!');

      const tokens: ITokens = await this.createTokens(user.id);
      const adminToken = this.createAdminToken(user.id, user.userRole);

      return {
        user: this.returnUserFields(user),
        ...tokens,
        staffInfo: {
          adminToken: adminToken,
        },
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

  addAdminTokenToResponse(res: Response, adminToken: string): void {
    const expiresIn: Date = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.ADMIN_TOKEN_NAME, adminToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      //lax if production
      sameSite: 'none',
    });
  }

  removeAdminTokenFromResponse(res: Response): void {
    res.cookie(this.ADMIN_TOKEN_NAME, '', {
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

  createAdminToken(userId: number, userRole: EnumUserRoles): string {
    const payload = { id: userId, userRole: userRole };
    const options = { expiresIn: '1h' };
    return sign(payload, process.env.SECRET_ADMIN_KEY_CLIENT, options);
  }
}

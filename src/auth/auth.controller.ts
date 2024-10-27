import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthAdminDto, AuthDto } from './dto/auth.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.register(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register-admin')
  async registerAdmin(@Body() dto: AuthAdminDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.registerAdmin(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login-admin')
  async loginAdmin(@Body() dto: AuthAdminDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, staffInfo, ...response } = await this.authService.loginAdmin(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);
    this.authService.addAdminTokenToResponse(res, staffInfo.adminToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('access-token')
  async getNewTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { refreshToken, ...response } =
      await this.authService.getNewTokens(refreshTokenFromCookies);

    if (!refreshToken) {
      throw new UnauthorizedException('Server error');
    }

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    this.authService.removeAdminTokenFromResponse(res);

    return true;
  }
}

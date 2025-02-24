import { Body, Controller, Get, HttpCode, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/user.dto';
import { EnumUserRoles } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('by-id')
  async getById(@CurrentUser('id') id: number) {
    const { password, userRole, ...user } = await this.userService.findById(id);

    return { ...user };
  }

  @Auth(EnumUserRoles.ADMIN)
  @Get('get-all')
  async getAll() {
    const users = await this.userService.getAll();

    return users;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('update')
  async update(@CurrentUser('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
}

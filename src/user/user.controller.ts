import { Body, Controller, Get, HttpCode, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('by-id')
  async getById(@CurrentUser('id') id: number) {
    const { password, userRole, ...user } = await this.userService.findById(id);

    return { ...user };
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('update')
  async update(@CurrentUser('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
}

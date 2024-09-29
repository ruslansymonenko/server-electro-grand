import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { EnumUserRoles } from '@prisma/client';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: EnumUserRoles[]) => {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
};

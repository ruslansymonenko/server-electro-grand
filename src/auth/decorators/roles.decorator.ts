import { SetMetadata } from '@nestjs/common';
import { EnumUserRoles } from '@prisma/client';

export const Roles = (...roles: EnumUserRoles[]) => SetMetadata('roles', roles);

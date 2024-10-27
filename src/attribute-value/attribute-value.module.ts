import { Module } from '@nestjs/common';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValueController } from './attribute-value.controller';
import { PrismaService } from '../prisma.service';
import { AttributeService } from '../attribute/attribute.service';

@Module({
  controllers: [AttributeValueController],
  providers: [AttributeValueService, PrismaService, AttributeService],
})
export class AttributeValueModule {}

import { Module } from '@nestjs/common';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValueController } from './attribute-value.controller';
import { AttributeService } from '../attribute/attribute.service';

@Module({
  controllers: [AttributeValueController],
  providers: [AttributeValueService, AttributeService],
})
export class AttributeValueModule {}

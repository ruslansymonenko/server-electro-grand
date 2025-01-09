import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendCallbackFormDto } from './dto/mailer.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/callback-form')
  async create(@Body() dto: SendCallbackFormDto): Promise<void> {
    return this.mailerService.sendUserCallbackForm(dto);
  }
}

import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendCallbackFormDto, SendContactFormDto } from './dto/mailer.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/callback-form')
  async callback(@Body() dto: SendCallbackFormDto): Promise<boolean> {
    try {
      const success: boolean = await this.mailerService.sendUserCallbackForm(dto);
      return success;
    } catch (error) {
      throw new InternalServerErrorException('Помилка при відправленні форми');
    }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/contact-form')
  async contact(@Body() dto: SendContactFormDto): Promise<boolean> {
    try {
      const success: boolean = await this.mailerService.sendUserContactForm(dto);
      return success;
    } catch (error) {
      throw new InternalServerErrorException('Помилка при відправленні форми');
    }
  }
}

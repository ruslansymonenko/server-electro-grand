import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendCallbackFormDto } from './dto/mailer.dto';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('SYSTEM_EMAIL'),
        pass: this.configService.get('SYSTEM_EMAIL_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  async sendUserCallbackForm(dto: SendCallbackFormDto): Promise<void> {
    try {
      const mailOptions = {
        from: 'Elektro Grand магазин',
        to: this.configService.get('STAFF_EMAIL'),
        subject: 'Користувач сайту просить передзвонити',
        text: `Користувач сайту Elektro Grand, просить передзвонити. Телефон: ${dto.phone}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Помилка, спробуйте пізніше');
    }
  }
}

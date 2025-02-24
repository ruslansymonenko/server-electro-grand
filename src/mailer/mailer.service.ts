import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendCallbackFormDto, SendContactFormDto } from './dto/mailer.dto';

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

  async sendUserCallbackForm(dto: SendCallbackFormDto): Promise<boolean> {
    try {
      const mailOptions = {
        from: 'Elektro Grand магазин',
        to: this.configService.get('STAFF_EMAIL'),
        subject: 'Користувач сайту просить передзвонити',
        text: `Користувач сайту Elektro Grand, просить передзвонити. Телефон: ${dto.phone}`,
      };

      console.log(mailOptions);

      const result = await this.transporter.sendMail(mailOptions);

      return result.accepted.length > 0;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Помилка, спробуйте пізніше');
    }
  }

  async sendUserContactForm(dto: SendContactFormDto): Promise<boolean> {
    try {
      const mailOptions = {
        from: dto.email,
        to: this.configService.get('STAFF_EMAIL'),
        subject: dto.subject,
        text: dto.message,
      };

      console.log(mailOptions);

      const result = await this.transporter.sendMail(mailOptions);

      return result.accepted.length > 0;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Помилка, спробуйте пізніше');
    }
  }
}

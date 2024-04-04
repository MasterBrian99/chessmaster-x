import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user.sign')
  async signMail({ email, token }: { email: string; token: string }) {
    const subject = `Welcome to Company: `;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './sign',
      context: {
        token: token,
        user: 'user',
      },
    });
  }
}

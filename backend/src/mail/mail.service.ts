import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendEmail(requestAuthorEmail: string) {
    try {
      await this.mailerService.sendMail({
        to: requestAuthorEmail, // Receiver
        from: 'user@outlook.com', // Senders email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      });
    } catch (e) {
      console.log(e);
      // throw new InternalServerErrorException('Something went wrong while sending the email... Please try again later');
    }
  }
}

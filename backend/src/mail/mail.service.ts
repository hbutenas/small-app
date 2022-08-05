import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendEmail(requestAuthorEmail: string, hashedToken: string) {
    const url = 'FE-URL';
    try {
      await this.mailerService.sendMail({
        to: requestAuthorEmail, // Receiver
        from: 'user@outlook.com', // Senders email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: `<p>
        Click here to reset your password:</br>
        <a href="${url}/reset-password?token=${hashedToken}">Reset password</a>
        </p> `, // HTML body content
      });
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong while sending the email... Please try again later');
    }
  }
}

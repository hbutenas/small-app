import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        port: 1025,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

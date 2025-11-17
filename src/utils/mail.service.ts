import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtpEmail(to: string, otp: string, type: string) {
    const subject =
      type === 'verify'
        ? 'Verify your account'
        : type === 'forgot-password'
          ? 'Password reset OTP'
          : 'Your login OTP';

    const html = `
      <p>Hi,</p>
      <p>Your ${subject} code is: <b>${otp}</b></p>
      <p>This code will expire in 10 minutes.</p>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@example.com',
        to,
        subject,
        html,
      });

      this.logger.log(`Sent OTP to ${to}: ${info.messageId}`);
      return info;
    } catch (err) {
      this.logger.error(`Failed to send OTP to ${to}`, err);
      throw err;
    }
  }
}

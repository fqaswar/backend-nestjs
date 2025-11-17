import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'src/database/entities/authUser.entity';
import { Otp } from 'src/database/entities/otp.entity';
import { MailService } from 'src/utils/mail.service';
import { compareOtp, generateNumericOTP, hashOtp } from 'src/utils/otp.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser) private userRepo: Repository<AuthUser>,
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private OTP_TTL_MINUTES = 10;

  async register(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({ email, password: hashed });
    await this.userRepo.save(user);

    await this.createAndSendOtp(user.id, email, 'verify');
    return { message: 'User registered. Verify email via OTP.' };
  }

  private async createAndSendOtp(
    userId: string,
    email: string,
    type: 'verify' | 'login-2fa' | 'forgot-password',
  ) {
    // remove/expire previous OTPs of same type to avoid confusion
    await this.otpRepo.update(
      { userId, type, consumed: false },
      { consumed: true },
    );

    const otp = generateNumericOTP(6);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + this.OTP_TTL_MINUTES * 60 * 1000);

    const otpEntity = this.otpRepo.create({
      userId,
      otpHash,
      type,
      expiresAt,
      consumed: false,
    });
    await this.otpRepo.save(otpEntity);

    // send email
    await this.mailService.sendOtpEmail(email, otp, type);
    return true;
  }

  async verifyOtp(
    email: string,
    otp: string,
    type: 'verify' | 'login-2fa' | 'forgot-password',
  ) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid email');

    const otpEntity = await this.otpRepo.findOne({
      where: { userId: user.id, type, consumed: false },
      order: { createdAt: 'DESC' },
    });
    if (!otpEntity) throw new BadRequestException('OTP not found or expired');

    if (otpEntity.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const ok = await compareOtp(otp, otpEntity.otpHash);
    if (!ok) {
      otpEntity.attempts += 1;
      await this.otpRepo.save(otpEntity);
      throw new BadRequestException('Invalid OTP');
    }

    otpEntity.consumed = true;
    await this.otpRepo.save(otpEntity);

    // apply type-specific effects
    if (type === 'verify') {
      user.isEmailVerified = true;
      await this.userRepo.save(user);
      return { message: 'Email verified' };
    } else if (type === 'forgot-password') {
      // caller will allow set new password after successful verify
      return { message: 'OTP verified for password reset' };
    } else if (type === 'login-2fa') {
      // return jwt
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);
      return { accessToken: token };
    }

    return { message: 'OK' };
  }

  async resendOtp(
    email: string,
    type: 'verify' | 'login-2fa' | 'forgot-password',
  ) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid email');

    // Rate-limit logic should be here to prevent abuse (per user & per IP)
    await this.createAndSendOtp(user.id, email, type);
    return { message: 'OTP resent' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) {
      // optionally require email verify first
      await this.createAndSendOtp(user.id, email, 'verify');
      throw new ForbiddenException('Email not verified. OTP sent.');
    }

    if (user.isTwoFactorEnabled) {
      // create login-2fa OTP and return response telling client to verify OTP
      await this.createAndSendOtp(user.id, email, 'login-2fa');
      return { requires2fa: true, message: 'OTP sent to email' };
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  async requestForgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user)
      throw new BadRequestException('If the email exists, we sent OTP'); // avoid user enumeration

    await this.createAndSendOtp(user.id, email, 'forgot-password');
    return { message: 'If the email exists, we sent OTP' };
  }

  async confirmResetPassword(email: string, otp: string, newPassword: string) {
    // verify OTP first
    await this.verifyOtp(email, otp, 'forgot-password');

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid email');

    user.password = await bcrypt.hash(newPassword, 12);
    await this.userRepo.save(user);

    return { message: 'Password updated' };
  }

  // helper to validate jwt user in guards
  async validateUserById(userId: string) {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ResendOtpDto,
  NewPasswordDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp, dto.type as any);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('resend-otp')
  async resend(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.email, dto.type as any);
  }

  @Post('forgot-password')
  async forgot(@Body() body: { email: string }) {
    return this.authService.requestForgotPassword(body.email);
  }

  @Post('reset-password')
  async reset(@Body() dto: NewPasswordDto) {
    return this.authService.confirmResetPassword(
      dto.email,
      dto.otp,
      dto.newPassword,
    );
  }
}

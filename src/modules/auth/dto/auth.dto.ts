import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  type: 'verify' | 'login-2fa' | 'forgot-password';
}

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  type: 'verify' | 'login-2fa' | 'forgot-password';
}

export class NewPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

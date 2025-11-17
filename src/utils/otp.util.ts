import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export function generateNumericOTP(length = 6): string {
  // numeric OTP
  const max = 10 ** length;
  const num = Math.floor(Math.random() * (max - 1)) + max / 10;
  return String(num).slice(0, length);
}

export async function hashOtp(otp: string): Promise<string> {
  // We can bcrypt the OTP for DB storage (fast and safe)
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

export async function compareOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

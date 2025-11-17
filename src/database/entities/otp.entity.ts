import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUser } from './authUser.entity';

export type OtpType = 'verify' | 'login-2fa' | 'forgot-password';

@Entity({ name: 'otps' })
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AuthUser)
  @JoinColumn({ name: 'userId' })
  user: AuthUser;

  @Column()
  userId: string;

  @Column()
  otpHash: string;

  @Column({ type: 'varchar' })
  type: OtpType;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  consumed: boolean;

  @Column({ default: 0 })
  attempts: number;

  @CreateDateColumn()
  createdAt: Date;
}

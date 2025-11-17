import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUserService(userdata: Partial<User>) {
    const newUser = this.userRepository.create(userdata);
    return await this.userRepository.save(newUser);
  }

  async getAllUsersService() {
    return await this.userRepository.find();
  }

  async updateUserService(userData: User) {
    await this.userRepository.update(userData.id, userData);
    return `User updated successfully`;
  }

  async deleteUser(userId: string) {
    await this.userRepository.delete(userId);
    return `User deleted successfully`;
  }
}

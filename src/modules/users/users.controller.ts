import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { User } from 'src/database/entities/user.entity';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserService) {}

  @Post('/create')
  async create(@Body() userData: Partial<User>) {
    return await this.usersService.createUserService(userData);
  }

  @Get('/findAll')
  async getAllUsers() {
    return await this.usersService.getAllUsersService();
  }

  @Put('/update')
  async updateUser(@Body() userData: User) {
    return await this.usersService.updateUserService(userData);
  }

  @Delete('/delete')
  async deleteUser(@Param('id') userId: string) {
    return await this.usersService.deleteUser(userId);
  }
}

import { Module } from '@nestjs/common';
import { BookModule } from 'src/modules/book/book.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/databases/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), BookModule, UsersModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class RootModule {
  constructor() {
    console.log('Root Module is running');
  }
}

import { Module } from '@nestjs/common';
import { BookModule } from 'src/book/book.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [BookModule, UsersModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class RootModule {
  constructor() {
    console.log('Root Module is running');
  }
}

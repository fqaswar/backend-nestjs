import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BookController } from './app.controller';

@Module({
  imports: [UsersModule],
  controllers: [BookController],
  providers: [],
  exports: [],
})
export class RootModule {
  constructor() {
    console.log('Root Module is running');
  }
}

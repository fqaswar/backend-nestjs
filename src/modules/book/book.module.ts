import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServiceBook } from './book.service';
import { ControllerBook } from './book.controller';
import { BookMiddleware } from './book.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/database/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [ControllerBook],
  providers: [ServiceBook],
  exports: [],
})
export class BookModule implements NestModule {
  // middleware applied & call here
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BookMiddleware).forRoutes('book');
  }
}

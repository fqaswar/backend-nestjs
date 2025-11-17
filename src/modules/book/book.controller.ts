import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ServiceBook } from './book.service';
import { Book } from 'src/database/entities/book.entity';

@Controller('book')
export class ControllerBook {
  constructor(private bookService: ServiceBook) {}
  @Post('/addBook')
  async addBook(@Body() bookData: Partial<Book>) {
    return await this.bookService.addBookService(bookData);
  }
  @Get('/findAll')
  async getAllBooks() {
    return await this.bookService.findAllBooksService();
  }

  // @Get('/findAll')
  // async getAllBooks(@Headers('authorization') authHeader: string) {
  //   console.log(`authorization header: ${authHeader}`);
  //   return await this.bookService.findAllBooksService();
  // }

  @Put('/update')
  async updateBook(@Body() bookData: Book) {
    return await this.bookService.updateBookService(bookData);
  }
  @Delete('/deleteBook/:id')
  async deleteBook(@Param('id') bookId: string) {
    return await this.bookService.deleteBookService(bookId);
  }
}

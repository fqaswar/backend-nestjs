import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ServiceBook } from './book.service';
import type { Book } from './data/book.dto';

@Controller('book')
export class ControllerBook {
  constructor(private bookService: ServiceBook) {}

  @Get('/findAll')
  getAllBooks(): Book[] {
    return this.bookService.findAllBooksService();
  }

  @Put('/update')
  updateBook(@Body() bookData: Book): string {
    return this.bookService.updateBookService(bookData);
  }
  @Delete('/deleteBook/:id')
  deleteBook(@Param('id') bookId: string): string {
    return this.bookService.deleteBookService(bookId);
  }

  @Post('/addBook')
  addBook(@Body() bookData: Book): string {
    return this.bookService.addBookService(bookData);
  }
}

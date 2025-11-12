import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('book')
export class BookController {
  // add
  @Post('/add')
  addBook(): string {
    return 'THIS will add book';
  }
  // getBook

  @Get('/get-all')
  getAllBooks(): string {
    return 'This will get the book';
  }

  //   update book
  @Put('/update')
  updateBook(): string {
    return 'This will update the book';
  }

  //  delete book
  @Delete('/delete')
  deleteBook(): string {
    return 'This is for Deleting book';
  }
  //   setting up the dynamic route
  @Get('/findBookById/:bookId')
  findBookById(@Param() params: any): string {
    console.log(params.id);
    return `This will find a book of id #${params.bookId} cat`;
  }
}

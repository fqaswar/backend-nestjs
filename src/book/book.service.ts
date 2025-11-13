import { Injectable } from '@nestjs/common';
import { Book } from './data/book.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ServiceBook {
  public books: Book[] = [];

  // now perform the crud operations
  addBookService(book: Book): string {
    // auto generate id using uuid
    book.id = uuidv4();
    this.books.push(book);
    return `Book has been successfully added ${JSON.stringify(book)}`;
  }

  updateBookService(book: Book): string {
    let index = this.books.findIndex((currentBook) => {
      return currentBook.id === book.id;
    });
    this.books[index] = book;
    return `Book updated successfully ${JSON.stringify(book)}`;
  }

  deleteBookService(bookId: string): string {
    this.books = this.books.filter((book) => {
      return book.id !== bookId;
    });
    return `Book has been deleted`;
  }
  findAllBooksService(): Book[] {
    return this.books;
  }
}

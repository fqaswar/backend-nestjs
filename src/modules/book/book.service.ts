import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/database/entities/book.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ServiceBook {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // now perform the crud operations
  async addBookService(bookData: Partial<Book>) {
    const newBook = this.bookRepository.create(bookData);
    return await this.bookRepository.save(newBook);
  }

  async updateBookService(bookData: Book) {
    await this.bookRepository.update(bookData.id, bookData);
    return `Book updated successfully`;
  }

  async deleteBookService(bookId: string) {
    await this.bookRepository.delete(bookId);
    return `Book deleted successfully`;
  }
  async findAllBooksService() {
    return await this.bookRepository.find();
  }
}

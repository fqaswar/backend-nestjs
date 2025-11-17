import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BookMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      'This is the class based Middleware which is implemented for book module',
    );
    let protocol = req.protocol;
    let host = req.get('host');
    let originalUrl = req.originalUrl;
    let method = req.method;
    let date = new Date();
    console.log(
      `date: [${date.toISOString()}] method type:  ${method} & request to ${protocol}://${host}${originalUrl}`,
    );
    next();
  }
}

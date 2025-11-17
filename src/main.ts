import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { type NextFunction, type Request, type Response } from 'express';

// global middleware can be applied here
function globalMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`Global Middleware...`);
  next();
}

function middleware2(req: Request, res: Response, next: NextFunction) {
  console.log(`Middleware 2...`);
  next();
}
async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  app.use(globalMiddleware); // middleware applied & call here
  app.use(middleware2); // middleware applied & call here

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

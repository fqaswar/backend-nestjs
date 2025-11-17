import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'fatima',
  database: 'practice',
  autoLoadEntities: true,
  synchronize: true, // Only for development. Turn off in production!
};

import { DataSource } from 'typeorm';

const config = new DataSource({
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/database/entities/**/*{.ts,.js}'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' ? true : false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: true,
  migrations: ['src/database/migrations/**/*{.ts,.js}'],
});

export default config;

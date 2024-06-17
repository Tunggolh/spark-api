import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';

@Module({
  imports: [TypeOrmConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

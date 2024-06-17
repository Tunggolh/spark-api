import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';

@Module({
  imports: [TypeOrmConfigModule, UsersModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

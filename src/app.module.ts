import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';
import { FollowModule } from './features/follow/follow.module';
import { LikesModule } from './features/likes/likes.module';
import { LikeController } from './features/like/like.controller';

@Module({
  imports: [
    TypeOrmConfigModule,
    UsersModule,
    PostsModule,
    FollowModule,
    LikesModule,
  ],
  controllers: [LikeController],
  providers: [],
})
export class AppModule {}

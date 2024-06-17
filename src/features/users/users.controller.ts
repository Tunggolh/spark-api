import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { UserRelationsEnum } from 'src/common/enums/user-relation.enum';
import { PostEntity } from 'src/database/entities/post.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Post(':id/follow')
  async followUser(
    @Param('id') id: number,
    @Body() followUserDto: FollowUserDto,
  ) {
    return this.userService.followUser(id, followUserDto);
  }

  @Get(':id/followers')
  async getFollowers(@Param('id') id: number): Promise<User[]> {
    return this.userService.getFollowers(id);
  }

  @Get(':id/following')
  async getFollowing(@Param('id') id: number): Promise<User[]> {
    return this.userService.getFollowing(id);
  }

  @Get(':id/liked_posts')
  async getLikedPosts(@Param('id') id: number): Promise<PostEntity[]> {
    return this.userService.getLikedPosts(id);
  }
}

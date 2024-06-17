import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { FollowActionEnum } from 'src/common/enums/follow-action.enum';
import { IUserRelation } from 'src/common/interfaces/IUserRelation';
import { UserRelationsEnum } from 'src/common/enums/user-relation.enum';
import { PostEntity } from 'src/database/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number, relations?: IUserRelation): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: relations?.relations,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return this.usersRepository.save(user);
  }

  async followUser(id: number, followDto: FollowUserDto) {
    const [userToFollow, currentUser] = await Promise.all([
      this.findOne(id),
      this.findOne(followDto.follower, {
        relations: [UserRelationsEnum.FOLLOWING],
      }),
    ]);

    const isFollowing = currentUser.followings.some(
      (following) => following.id === userToFollow.id,
    );

    if (!currentUser.followings) {
      currentUser.followings = [];
    }

    switch (followDto.action) {
      case FollowActionEnum.FOLLOW:
        if (isFollowing) {
          throw new BadRequestException('Already Followed User');
        }
        currentUser.followings.push(userToFollow);
        break;

      case FollowActionEnum.UNFOLLOW:
        if (!isFollowing) {
          throw new BadRequestException(
            'Action invalid: currently not followed user',
          );
        }
        currentUser.followings = currentUser.followings.filter(
          (following) => following.id !== userToFollow.id,
        );
        break;

      default:
        throw new BadRequestException('Invalid action');
    }

    await this.usersRepository.save(currentUser);
  }

  async getFollowers(id: number): Promise<User[]> {
    const user = await this.findOne(id, {
      relations: [UserRelationsEnum.FOLLOWERS],
    });
    return user.followers;
  }

  async getFollowing(id: number): Promise<User[]> {
    const user = await this.findOne(id, {
      relations: [UserRelationsEnum.FOLLOWING],
    });
    return user.followings;
  }

  async getLikedPosts(id: number): Promise<PostEntity[]> {
    const user = await this.findOne(id, {
      relations: [UserRelationsEnum.LIKED_POSTS],
    });
    return user.likedPosts;
  }
}

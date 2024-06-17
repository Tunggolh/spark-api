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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDto);
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
      this.findOne(followDto.follower),
    ]);

    const isFollowing = currentUser.followings.some(
      (following) => following.id === userToFollow.id,
    );

    switch (followDto.action) {
      case FollowActionEnum.FOLLOW:
        if (isFollowing) {
          throw new BadRequestException('Already Followed');
        }
        currentUser.followings.push(userToFollow);
        break;

      case FollowActionEnum.UNFOLLOW:
        if (!isFollowing) {
          throw new BadRequestException(
            'Action invalid: currently not followed',
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
    const user = await this.findOne(id);
    return user.followers;
  }

  async getFollowing(id: number): Promise<User[]> {
    const user = await this.findOne(id);
    return user.followings;
  }
}

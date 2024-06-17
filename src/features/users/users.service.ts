import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';

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

  async followUser(followDto: FollowUserDto) {
    const userToFollow = await this.findOne(followDto.user);
    const currentUser = await this.findOne(followDto.follower);

    if (
      !currentUser.followings.find(
        (following) => following.id === userToFollow.id,
      )
    ) {
      currentUser.followings.push(userToFollow);
      await this.usersRepository.save(currentUser);
    }
  }

  async unfollowUser(followDto: FollowUserDto) {
    const userToFollow = await this.findOne(followDto.user);
    const currentUser = await this.findOne(followDto.follower);

    currentUser.followings = currentUser.followings.filter(
      (following) => following.id !== userToFollow.id,
    );

    await this.usersRepository.save(currentUser);
  }
}

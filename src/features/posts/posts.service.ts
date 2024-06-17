import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/database/entities/post.entity';
import { DeepPartial, Like, Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { LikePostDto } from './dto/like-post.dto';
import { LikeActionEnum } from 'src/common/enums/like-action.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return await this.postRepository.find({ order: { id: 'desc' } });
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['likers', 'author'],
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const author = await this.userService.findOne(createPostDto.author);

    const newPost: DeepPartial<PostEntity> = {
      content: createPostDto.content,
      author,
    };

    return await this.postRepository.save(newPost);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.postRepository.preload({
      id,
      ...updatePostDto,
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return await this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    this.postRepository.remove(post);
  }

  async likePost(id: number, likePostDto: LikePostDto) {
    const [post, user] = await Promise.all([
      await this.findOne(id),
      await this.userService.findOne(likePostDto.liker),
    ]);

    const isLike = post.likers.some((liker) => liker.id === user.id);

    if (!post.likers) {
      post.likers = [];
    }

    switch (likePostDto.action) {
      case LikeActionEnum.LIKE:
        if (isLike) {
          throw new BadRequestException('Already liked post');
        }
        post.likesCount++;
        post.likers.push(user);
        break;

      case LikeActionEnum.UNLIKE:
        if (!isLike) {
          throw new BadRequestException(
            'Action invalid: currently not liked post',
          );
        }
        post.likesCount--;
        post.likers = post.likers.filter((liker) => liker.id !== user.id);
        break;

      default:
        throw new BadRequestException('Invalid Action');
    }

    this.postRepository.save(post);
  }
}

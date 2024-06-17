import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/database/entities/post.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({ order: { id: 'desc' } });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const author = await this.userService.findOne(createPostDto.author);

    const newPost: DeepPartial<Post> = {
      content: createPostDto.content,
      author,
    };

    return await this.postRepository.save(newPost);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
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

  async likePost(id: number, userId: number) {
    const post = await this.findOne(id);
    const user = await this.userService.findOne(userId);

    post.likesCount++;
    post.likers.push(user);

    this.postRepository.save(post);
  }

  async unlikePost(id: number, userId: number) {
    const post = await this.findOne(id);
    const user = await this.userService.findOne(userId);

    post.likesCount--;
    post.likers.filter((liker) => liker.id !== user.id);

    this.postRepository.save(post);
  }
}

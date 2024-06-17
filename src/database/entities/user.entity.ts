import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @ManyToMany(() => User, (user) => user.followings)
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  followings: User[];
}

import { EventEntity } from '../events/events.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  email: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => EventEntity, (events) => events.user)
  events: EventEntity[];
}

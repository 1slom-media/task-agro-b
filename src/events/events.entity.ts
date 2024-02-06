import { UsersEntity } from 'src/users/user.entity';
import { CategoryEntity } from '../category/category.entity';
import { SubcategoryEntity } from '../sub_category/sub_category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  subject: string;

  @Column()
  image: string;

  @Column({ default: 'waiting' })
  status: string;

  @Column()
  fullname: string;

  @Column()
  phone: string;

  @Column()
  additional_phone: string;

  @Column()
  profession: string;

  @Column()
  day: string;

  @Column()
  time: string;

  @Column()
  event_type: string;

  @Column({ nullable: true })
  event_link: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: CategoryEntity;

  @ManyToOne(() => SubcategoryEntity, (subcategories) => subcategories.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subcategories: SubcategoryEntity;

  @ManyToOne(() => UsersEntity, (user) => user.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UsersEntity;
}

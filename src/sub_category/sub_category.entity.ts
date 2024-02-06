import { EventEntity } from '../events/events.entity';
import { CategoryEntity } from '../category/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('sub_category')
export class SubcategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories)
  category: CategoryEntity;

  @OneToMany(() => EventEntity, (events) => events.subcategories)
  events: EventEntity[];
}

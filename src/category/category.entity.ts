import { EventEntity } from '../events/events.entity';
import { SubcategoryEntity } from '../sub_category/sub_category.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_name: string;

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category)
  subcategories: SubcategoryEntity[];

  @OneToMany(() => EventEntity, (events) => events.category)
  events: EventEntity[];
}

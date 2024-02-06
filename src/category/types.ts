import { Field, ObjectType } from '@nestjs/graphql';
import { SubCategory } from '../sub_category/types';

@ObjectType()
export class Category {
  @Field()
  id: number;

  @Field()
  category_name: string;

  @Field(() => [SubCategory])
  subcategories: SubCategory;
}

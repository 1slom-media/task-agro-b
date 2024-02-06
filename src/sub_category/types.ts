import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../category/types';

@ObjectType()
export class SubCategory {
  @Field({ nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field(() => Category, { nullable: true })
  category?: Category;
}

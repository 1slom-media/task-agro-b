import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../category/types';
import { SubCategory } from '../sub_category/types';
import { User } from '../users/types';

@ObjectType()
export class Events {
  @Field({ nullable: true })
  id?: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  subject: string;

  @Field({ nullable: true })
  image: string | null;

  @Field()
  fullname: string;

  @Field()
  phone: string;

  @Field()
  additional_phone: string;

  @Field()
  profession: string;

  @Field()
  day: string;

  @Field()
  time: string;

  @Field()
  event_type: string;

  @Field()
  event_link: string | null;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => SubCategory, { nullable: true })
  subcategories?: SubCategory;

  @Field(() => User, { nullable: true })
  user?: User;
}

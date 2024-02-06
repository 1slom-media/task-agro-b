import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, IsString } from 'class-validator';
import { CategoryEntity } from '../../category/category.entity';
import { SubcategoryEntity } from '../../sub_category/sub_category.entity';
import { UsersEntity } from '../../users/user.entity';

export class EventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  image: string | null;

  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  additional_phone: string;

  @ApiProperty()
  @IsString()
  profession: string;

  @ApiProperty()
  @IsString()
  day: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsString()
  event_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  event_link: string;

  @ApiProperty()
  @IsOptional()
  @Allow()
  category: CategoryEntity;

  @ApiProperty()
  @IsOptional()
  @Allow()
  subcategories: SubcategoryEntity;

  @ApiProperty()
  @IsOptional()
  @Allow()
  user: UsersEntity;
}

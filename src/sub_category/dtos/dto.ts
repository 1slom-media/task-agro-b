import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsString } from 'class-validator';
import { CategoryEntity } from '../../category/category.entity';

export class SubCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Allow()
  category: CategoryEntity;
}

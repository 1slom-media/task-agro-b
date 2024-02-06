import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  category_name: string;
}

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  category_name: string;
}

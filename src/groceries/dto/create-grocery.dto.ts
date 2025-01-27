import {
  IsString,
  IsNotEmpty,
  Validate,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateInventoryDto {
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @IsPositive({
    message: 'minimum_quantity must be a positive number',
  })
  quantity: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @IsPositive({
    message: 'minimum_quantity must be a positive number',
  })
  minimum_quantity: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @IsPositive({
    message: 'minimum_quantity must be a positive number',
  })
  maximum_quantity: number;
}

export class CreateGroceryDto {
  @IsString()
  @IsNotEmpty()
  @Validate((value: string) => RegExp(/^[a-zA-Z0-9_-]+$/).test(value), {
    message: 'sku must be alphanumeric only with hyphen(-) and underscore(_)',
  })
  sku: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive({
    message: 'price must be a positive number',
  })
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  is_active: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateInventoryDto)
  inventory: CreateInventoryDto;
}

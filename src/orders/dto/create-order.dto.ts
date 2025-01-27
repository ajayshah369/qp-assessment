import {
  IsArray,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LineItemDto {
  @IsString()
  @IsNotEmpty()
  grocery_uuid: string;

  @IsNumber()
  @IsInt({})
  @IsNotEmpty()
  @Min(1)
  quantity: number = 1;
}

export class CreateOrderDto {
  @IsArray({
    message: 'line_items must be an array',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Array<LineItemDto>)
  line_items: LineItemDto[];
}

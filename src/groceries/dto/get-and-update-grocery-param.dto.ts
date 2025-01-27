import { IsString, IsNotEmpty } from 'class-validator';

export class GetAndUpdateGroceryParamDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

import { Controller, UseGuards, Get, Query, Param } from '@nestjs/common';

import { GroceriesService } from './groceries.service';
import { UserJwtAuthGuard } from 'src/user-jwt/jwt-auth.guard';
import { GetGroceriesQueryDto } from './dto/get-groceries-query.dto';
import { GetAndUpdateGroceryParamDto } from './dto/get-and-update-grocery-param.dto';

@Controller('groceries')
@UseGuards(UserJwtAuthGuard)
export class GroceriesController {
  constructor(private readonly groceriesService: GroceriesService) {}

  @Get()
  async getGroceries(@Query() query: GetGroceriesQueryDto) {
    const groceries = await this.groceriesService.getGroceries(query);

    return {
      message: 'Groceries fetched successfully',
      data: groceries,
    };
  }

  @Get('/:uuid')
  async getGrocery(@Param() param: GetAndUpdateGroceryParamDto) {
    const grocery = await this.groceriesService.getGrocery(param.uuid);

    return {
      message: 'Grocery fetched successfully',
      data: grocery,
    };
  }
}

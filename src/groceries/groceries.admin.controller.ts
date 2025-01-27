import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';

import { CreateGroceryDto } from './dto/create-grocery.dto';
import { GroceriesService } from './groceries.service';
import { AdminJwtAuthGuard } from 'src/admin-jwt/jwt-auth.guard';
import { GetGroceriesQueryDto } from './dto/get-groceries-query.dto';
import { GetAndUpdateGroceryParamDto } from './dto/get-and-update-grocery-param.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';

@Controller('admin/groceries')
@UseGuards(AdminJwtAuthGuard)
export class GroceriesAdminController {
  constructor(private readonly groceriesService: GroceriesService) {}

  @Post()
  async createGrocery(@Body() body: CreateGroceryDto) {
    const grocery = await this.groceriesService.createGrocery(body);

    return {
      message: 'Grocery created successfully',
      data: grocery,
    };
  }

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

  @Put('/:uuid')
  async updateGrocery(
    @Param() param: GetAndUpdateGroceryParamDto,
    @Body() body: UpdateGroceryDto,
  ) {
    const grocery = await this.groceriesService.updateGrocery(param.uuid, body);

    return {
      message: 'Grocery updated successfully',
      data: grocery,
    };
  }
}

import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  Query,
  Get,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { UserJwtAuthGuard } from 'src/user-jwt/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';

@Controller('orders')
@UseGuards(UserJwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDto, @Request() req: any) {
    const order = await this.ordersService.createOrder(
      body,
      req.user.uuid as string,
    );

    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  @Get()
  async getOrders(@Query() query: GetOrdersQueryDto, @Request() req: any) {
    const order = await this.ordersService.getOrders(
      query,
      req.user.uuid as string,
    );

    return {
      message: 'Order created successfully',
      data: order,
    };
  }
}

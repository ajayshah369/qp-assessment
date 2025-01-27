import { Controller, UseGuards, Query, Get } from '@nestjs/common';

import { OrdersAdminService } from './orders.admin.service';
import { AdminJwtAuthGuard } from 'src/admin-jwt/jwt-auth.guard';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';

@Controller('admin/orders')
@UseGuards(AdminJwtAuthGuard)
export class OrdersAdminController {
  constructor(private readonly ordersAdminService: OrdersAdminService) {}

  @Get()
  async getOrders(@Query() query: GetOrdersQueryDto) {
    const order = await this.ordersAdminService.getOrders(query);

    return {
      message: 'Order fetched successfully',
      data: order,
    };
  }
}

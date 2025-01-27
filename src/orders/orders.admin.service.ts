import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Order, UserDetail } from './orders.models';
import { OrderEntity } from './entities/order.entity';
import { OrdersMapper } from './orders.mapper';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';

@Injectable()
export class OrdersAdminService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(UserDetail)
    private readonly userDetailModel: typeof UserDetail,
  ) {}

  async getOrders(
    getOrdersQueryDto: GetOrdersQueryDto,
  ): Promise<OrderEntity[]> {
    const orders = await this.orderModel.findAll({
      include: [
        { all: true },
        {
          model: this.userDetailModel,
          as: 'user_detail', // Ensure the alias matches the one used in the where clause
          required: true,
        },
      ],
      order: [['created_at', 'desc']],
      limit: getOrdersQueryDto.limit,
      offset: (getOrdersQueryDto.page - 1) * getOrdersQueryDto.limit,
      where: {
        [Op.or]: [
          {
            '$user_detail.email$': {
              [Op.iLike]: `%${getOrdersQueryDto.text}%`,
            },
          },
          {
            '$user_detail.first_name$': {
              [Op.iLike]: `%${getOrdersQueryDto.text}%`,
            },
          },
          {
            '$user_detail.last_name$': {
              [Op.iLike]: `%${getOrdersQueryDto.text}%`,
            },
          },
          {
            order_name: {
              [Op.iLike]: `%${getOrdersQueryDto.text}%`,
            },
          },
        ],
      },
    });
    return orders.map((order) => OrdersMapper.modelToEntity(order));
  }
}

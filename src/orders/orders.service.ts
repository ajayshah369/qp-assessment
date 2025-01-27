import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Op } from 'sequelize';

import { Order, UserDetail } from './orders.models';
import { OrderEntity } from './entities/order.entity';
import { OrdersMapper } from './orders.mapper';
import { CreateOrderDto } from './dto/create-order.dto';
import { GroceriesService } from 'src/groceries/groceries.service';
import { UsersService } from 'src/users/users.service';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly groceriesService: GroceriesService,
    private readonly usersService: UsersService,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(UserDetail)
    private readonly userDetailModel: typeof UserDetail,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  private async createBodyToCreateOrder(
    createOrderDto: CreateOrderDto,
    userUuid: string,
  ) {
    const lineItems = createOrderDto.line_items;
    const groceries = await this.groceriesService.getGroceriesByUuids(
      lineItems.map((item) => item.grocery_uuid),
    );

    if (!groceries || groceries.length !== lineItems.length) {
      throw new Error('Groceries not found');
    }

    const line_items = lineItems.map((item) => {
      const grocery = groceries.find(
        (grocery) => grocery.uuid === item.grocery_uuid,
      );

      const quantity = item.quantity;
      const unit_price = grocery.price;
      const sub_total_price = unit_price * quantity;
      const tax_rate = 18;
      const total_tax = unit_price * quantity * (tax_rate / 100);

      return {
        grocery_id: grocery.id,
        quantity,
        sku: grocery.sku,
        title: grocery.title,
        unit_price,
        sub_total_price: unit_price * quantity,
        tax_rate,
        total_tax: total_tax,
        total_price: sub_total_price + total_tax,
      };
    });

    const payment_detail = {
      payment_method: 'cash',
      payment_status: 'paid',
      sub_total_price: line_items.reduce(
        (acc, item) => acc + item.sub_total_price,
        0,
      ),
      total_tax: line_items.reduce((acc, item) => acc + item.total_tax, 0),
      total_price: line_items.reduce((acc, item) => acc + item.total_price, 0),
    };

    const user = await this.usersService.findByUuid(userUuid, true);

    const user_detail = {
      user_id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return {
      line_items,
      payment_detail,
      user_detail,
    };
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userUuid: string,
  ): Promise<OrderEntity> {
    const body = await this.createBodyToCreateOrder(createOrderDto, userUuid);

    const transaction = await this.sequelize.transaction();
    try {
      const order = await this.orderModel.create(body, {
        include: [{ all: true }],
        transaction,
      });

      const data = OrdersMapper.modelToEntity(order);
      await transaction.commit();
      return data;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async getOrders(
    getOrdersQueryDto: GetOrdersQueryDto,
    userUuid: string,
  ): Promise<OrderEntity[]> {
    const user = await this.usersService.findByUuid(userUuid, true);

    const orders = await this.orderModel.findAll({
      include: [
        { all: true },
        {
          model: this.userDetailModel,
          where: { user_id: user.id },
          required: true,
        },
      ],
      order: [['created_at', 'desc']],
      limit: getOrdersQueryDto.limit,
      offset: (getOrdersQueryDto.page - 1) * getOrdersQueryDto.limit,
      where: {
        order_name: {
          [Op.iLike]: `%${getOrdersQueryDto.text}%`,
        },
      },
    });
    return orders.map((order) => OrdersMapper.modelToEntity(order));
  }
}

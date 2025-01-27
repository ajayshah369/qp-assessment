import { Order } from './orders.models';
import { OrderEntity } from './entities/order.entity';

export class OrdersMapper {
  static modelToEntity(order: Order): OrderEntity {
    return {
      uuid: order.uuid,
      order_name: order.order_name,
      line_items: order.line_items.map((lineItem) => ({
        uuid: lineItem.uuid,
        quantity: lineItem.quantity,
        sku: lineItem.sku,
        title: lineItem.title,
        unit_price: lineItem.unit_price,
        sub_total_price: lineItem.sub_total_price,
        tax_rate: lineItem.tax_rate,
        total_tax: lineItem.total_tax,
        total_price: lineItem.total_price,
      })),
      user_detail: {
        uuid: order.user_detail.uuid,
        email: order.user_detail.email,
        first_name: order.user_detail.first_name,
        last_name: order.user_detail.last_name,
      },
      payment_detail: {
        uuid: order.payment_detail.uuid,
        payment_method: order.payment_detail.payment_method,
        payment_status: order.payment_detail.payment_status,
        sub_total_price: order.payment_detail.sub_total_price,
        total_tax: order.payment_detail.total_tax,
        total_price: order.payment_detail.total_price,
      },
    };
  }
}

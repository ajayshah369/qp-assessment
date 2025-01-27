import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasOne,
  BeforeCreate,
  HasMany,
} from 'sequelize-typescript';

import { Grocery } from 'src/groceries/groceries.models';
import { User } from 'src/users/users.models';

@Table
export class LastOrderNumber extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  last_order_number: number;
}

@Table
export class Order extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  order_name: string;

  @BeforeCreate
  static async createOrderName(instance: Order, options: any) {
    const lastOrder = await LastOrderNumber.findOne({
      transaction: options.transaction,
    });
    if (lastOrder) {
      lastOrder.last_order_number += 1;
      await lastOrder.save({ transaction: options.transaction });
      instance.order_name = `O${lastOrder.last_order_number}`;
    } else {
      const newLastOrder = await LastOrderNumber.create(
        {
          last_order_number: 1001,
        },
        { transaction: options.transaction },
      );
      instance.order_name = `O${newLastOrder.last_order_number}`;
    }
  }

  @HasOne(() => PaymentDetail, { foreignKey: 'order_id', onDelete: 'CASCADE' })
  payment_detail: Partial<PaymentDetail>;

  @HasOne(() => UserDetail, { foreignKey: 'order_id', onDelete: 'CASCADE' })
  user_detail: Partial<UserDetail>;

  @HasMany(() => LineItem, { foreignKey: 'order_id', onDelete: 'CASCADE' })
  line_items: Partial<LineItem>[];
}

@Table({
  indexes: [
    {
      name: 'unique_sku_order',
      unique: true,
      fields: ['sku', 'order_id'],
    },
    {
      name: 'unique_grocery_order',
      unique: true,
      fields: ['grocery_id', 'order_id'],
    },
  ],
})
export class LineItem extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Grocery)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  grocery_id: number;

  @BelongsTo(() => Grocery, 'grocery_id')
  grocery: Grocery;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  order_id: number;

  @BelongsTo(() => Order, 'order_id')
  order: Order;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      is: RegExp(/^[a-zA-Z0-9_-]+$/),
      len: [2, 20],
    },
    set(val: string) {
      this.setDataValue('sku', val.toLowerCase());
    },
  })
  sku: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(val: string) {
      const newValue = val.charAt(0).toUpperCase() + val.slice(1);
      this.setDataValue('title', newValue);
    },
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  })
  quantity: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  unit_price: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
    defaultValue: 18,
  })
  tax_rate: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  sub_total_price: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  total_tax: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  total_price: number;
}

@Table
export class UserDetail extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  order_id: number;

  @BelongsTo(() => Order, 'order_id')
  order: Order;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    set(val: string): void {
      this.setDataValue('email', val.toLowerCase());
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(val: string) {
      const newValue = val.charAt(0).toUpperCase() + val.slice(1);
      this.setDataValue('first_name', newValue);
    },
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    set(val: string) {
      if (!val) return;
      const newValue = val.charAt(0).toUpperCase() + val.slice(1);
      this.setDataValue('last_name', newValue);
    },
  })
  last_name: string;
}

@Table
export class PaymentDetail extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  order_id: number;

  @BelongsTo(() => Order, 'order_id')
  order: Order;

  @Column({
    type: DataType.ENUM('cash', 'cod', 'card', 'upi', 'net-banking'),
    allowNull: false,
    defaultValue: 'cash',
  })
  payment_method: string;

  @Column({
    type: DataType.ENUM('paid', 'unpaid'),
    allowNull: false,
    defaultValue: 'unpaid',
  })
  payment_status: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  sub_total_price: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  total_tax: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  total_price: number;
}

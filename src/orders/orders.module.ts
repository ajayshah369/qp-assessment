import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { databaseProviders } from 'src/database/database.provider';
import {
  LastOrderNumber,
  Order,
  LineItem,
  UserDetail,
  PaymentDetail,
} from './orders.models';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from 'src/users/users.module';
import { GroceriesModule } from 'src/groceries/groceries.module';
import { OrdersAdminController } from './orders.admin.controller';
import { OrdersAdminService } from './orders.admin.service';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  imports: [
    UsersModule,
    AdminsModule,
    GroceriesModule,
    SequelizeModule.forFeature([
      LastOrderNumber,
      Order,
      LineItem,
      UserDetail,
      PaymentDetail,
    ]),
  ],
  controllers: [OrdersController, OrdersAdminController],
  providers: [...databaseProviders, OrdersService, OrdersAdminService],
})
export class OrdersModule {}

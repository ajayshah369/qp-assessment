import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grocery, Inventory } from './groceries.models';
import { GroceriesAdminController } from './groceries.admin.controller';
import { GroceriesService } from './groceries.service';
import { AdminsModule } from 'src/admins/admins.module';
import { databaseProviders } from 'src/database/database.provider';
import { UsersModule } from 'src/users/users.module';
import { GroceriesController } from './groceries.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Grocery, Inventory]),
    AdminsModule,
    UsersModule,
  ],
  controllers: [GroceriesAdminController, GroceriesController],
  providers: [...databaseProviders, GroceriesService],
  exports: [GroceriesService],
})
export class GroceriesModule {}

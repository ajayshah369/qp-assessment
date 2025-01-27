import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';

import { Grocery, Inventory } from './groceries.models';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { GroceryMapper } from './groceries.mapper';
import { GroceryEntity } from './entities/grocery.entity';
import { GetGroceriesQueryDto } from './dto/get-groceries-query.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';

@Injectable()
export class GroceriesService {
  constructor(
    @InjectModel(Grocery)
    private readonly groceryModel: typeof Grocery,
    @InjectModel(Inventory)
    private readonly inventoryModel: typeof Inventory,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  async createGrocery(
    createGroceryDto: CreateGroceryDto,
  ): Promise<GroceryEntity> {
    const groceryEntity = GroceryMapper.toEntity(createGroceryDto);
    const groceryModel = GroceryMapper.toModel(groceryEntity);
    const grocery = await this.groceryModel.create(groceryModel, {
      include: [this.inventoryModel],
    });
    return GroceryMapper.modelToEntity(grocery);
  }

  async updateGrocery(
    uuid: string,
    updateGroceryDto: UpdateGroceryDto,
  ): Promise<GroceryEntity> {
    const groceryEntity = GroceryMapper.toEntity(updateGroceryDto);
    const groceryModel = GroceryMapper.toModel(groceryEntity);

    const transaction = await this.sequelize.transaction();
    try {
      const grocery = await this.groceryModel.findOne({
        where: {
          uuid,
        },
      });

      if (!grocery) {
        throw new Error('Grocery not found');
      }

      await this.groceryModel.update(groceryModel, {
        where: {
          id: grocery.dataValues.id,
        },
        transaction,
      });

      await this.inventoryModel.update(groceryModel.inventory, {
        where: {
          grocery_id: grocery.dataValues.id,
        },
        transaction,
      });

      const updatedGrocery = await this.groceryModel.findOne({
        where: {
          uuid,
        },
        include: [this.inventoryModel],
        transaction,
      });

      transaction.commit();

      return GroceryMapper.modelToEntity(updatedGrocery);
    } catch (error) {
      console.log(error);
      transaction.rollback();
      throw error;
    }
  }

  async getGroceries(
    getGroceriesQueryDto: GetGroceriesQueryDto,
  ): Promise<GroceryEntity[]> {
    const groceries = await this.groceryModel.findAll({
      include: [this.inventoryModel],
      order: [['title', 'asc']],
      limit: getGroceriesQueryDto.limit,
      offset: (getGroceriesQueryDto.page - 1) * getGroceriesQueryDto.limit,
      where: {
        title: {
          [Op.iLike]: `%${getGroceriesQueryDto.text}%`,
        },
      },
    });
    return groceries.map((grocery) => GroceryMapper.modelToEntity(grocery));
  }

  async getGrocery(uuid: string): Promise<GroceryEntity> {
    const grocery = await this.groceryModel.findOne({
      include: [this.inventoryModel],
      where: {
        uuid,
      },
    });
    return GroceryMapper.modelToEntity(grocery);
  }

  async getGroceriesByUuids(uuids: string[]): Promise<GroceryEntity[]> {
    const groceries = await this.groceryModel.findAll({
      where: {
        uuid: {
          [Op.in]: uuids,
        },
      },
    });
    return groceries.map((grocery) =>
      GroceryMapper.modelToEntity(grocery, true),
    );
  }
}

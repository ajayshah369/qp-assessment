import { CreateGroceryDto } from './dto/create-grocery.dto';
import { Grocery } from './groceries.models';
import { GroceryEntity } from './entities/grocery.entity';

export class GroceryMapper {
  static toEntity(groceryDto: CreateGroceryDto): GroceryEntity {
    return {
      sku: groceryDto.sku,
      title: groceryDto.title,
      price: groceryDto.price,
      is_active: groceryDto.is_active,
      inventory: {
        quantity: groceryDto.inventory?.quantity,
        minimum_quantity: groceryDto.inventory?.minimum_quantity,
        maximum_quantity: groceryDto.inventory?.maximum_quantity,
      },
    };
  }

  static toModel(groceryEntity: GroceryEntity): Partial<Grocery> {
    return {
      sku: groceryEntity.sku,
      title: groceryEntity.title,
      price: groceryEntity.price,
      is_active: groceryEntity.is_active,
      inventory: {
        quantity: groceryEntity.inventory?.quantity,
        minimum_quantity: groceryEntity.inventory?.minimum_quantity,
        maximum_quantity: groceryEntity.inventory?.maximum_quantity,
      },
    };
  }

  static modelToEntity(
    grocery: Grocery,
    withId: boolean = false,
  ): GroceryEntity {
    return {
      ...(withId && { id: grocery.id }),
      uuid: grocery.uuid,
      sku: grocery.sku,
      title: grocery.title,
      price: grocery.price,
      is_active: grocery.is_active,
      inventory: grocery.inventory
        ? {
            uuid: grocery.inventory.uuid,
            quantity: grocery.inventory.quantity,
            minimum_quantity: grocery.inventory.minimum_quantity,
            maximum_quantity: grocery.inventory.maximum_quantity,
          }
        : undefined,
    };
  }
}

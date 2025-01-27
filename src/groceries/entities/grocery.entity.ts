class InventoryEntity {
  uuid?: string;
  quantity: number;
  minimum_quantity: number;
  maximum_quantity?: number;
  grocery_id?: number;
}

export class GroceryEntity {
  id?: number;
  uuid?: string;
  sku: string;
  title: string;
  price: number;
  is_active?: boolean;
  inventory?: InventoryEntity;
}

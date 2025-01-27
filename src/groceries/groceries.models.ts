import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';

@Table
export class Grocery extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
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
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    set(val: string) {
      const newValue = val.charAt(0).toUpperCase() + val.slice(1);
      this.setDataValue('title', newValue);
    },
  })
  title: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  price: number;

  @HasOne(() => Inventory, { foreignKey: 'grocery_id', onDelete: 'CASCADE' })
  inventory: Partial<Inventory>;
}

@Table
export class Inventory extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  minimum_quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
    },
  })
  maximum_quantity: number;

  @ForeignKey(() => Grocery)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    onDelete: 'CASCADE',
  })
  grocery_id: number;

  @BelongsTo(() => Grocery, 'grocery_id')
  grocery: Grocery;
}

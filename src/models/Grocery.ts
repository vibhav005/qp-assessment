import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { OrderItem } from "./OrderItem";
import { Inventory } from "./Inventory";

@Entity("groceries")
export class Grocery {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column({ nullable: true })
  category!: string;

  @Column({ nullable: true, name: "image_url" })
  imageUrl!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.grocery)
  orderItems!: OrderItem[];

  @OneToOne(() => Inventory, (inventory) => inventory.grocery)
  inventory!: Inventory;
}

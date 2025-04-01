import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./Order";
import { Grocery } from "./Grocery";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id" })
  orderId!: number;

  @Column({ name: "grocery_id" })
  groceryId!: number;

  @Column()
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2, name: "unit_price" })
  unitPrice!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @ManyToOne(() => Grocery, (grocery) => grocery.orderItems)
  @JoinColumn({ name: "grocery_id" })
  grocery!: Grocery;
}

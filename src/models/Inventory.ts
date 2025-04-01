import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Grocery } from "./Grocery";

@Entity("inventory")
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "grocery_id" })
  groceryId!: number;

  @Column()
  quantity!: number;

  @Column()
  threshold!: number;

  @Column({ name: "last_restock_date" })
  lastRestockDate!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToOne(() => Grocery)
  @JoinColumn({ name: "grocery_id" })
  grocery!: Grocery;
}

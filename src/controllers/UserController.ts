import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Grocery } from "../models/Grocery";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { Inventory } from "../models/Inventory";
import { ItemToProcess, OrderRequest, RequestWithUser } from "../types/type";

// Get available grocery items
export const getAvailableGroceries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get grocery items with inventory > 0
    const groceryRepository = AppDataSource.getRepository(Grocery);

    const groceries = await groceryRepository
      .createQueryBuilder("grocery")
      .leftJoinAndSelect("grocery.inventory", "inventory")
      .where("inventory.quantity > 0")
      .getMany();

    res.json(groceries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Book multiple grocery items (create an order)
export const createOrder = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Get userId from authenticated request
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const { items, address, phone } = req.body as OrderRequest;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Order items are required" });
      return;
    }

    // Get repositories
    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const groceryRepository = queryRunner.manager.getRepository(Grocery);
    const inventoryRepository = queryRunner.manager.getRepository(Inventory);

    // Validate all grocery items exist and have sufficient inventory
    let totalAmount = 0;
    const itemsToProcess: ItemToProcess[] = [];

    for (const itemData of items) {
      const { groceryId, quantity } = itemData;

      const grocery = await groceryRepository.findOne({
        where: { id: groceryId },
      });

      if (!grocery) {
        await queryRunner.rollbackTransaction();
        res
          .status(404)
          .json({ message: `Grocery item with ID ${groceryId} not found` });
        return;
      }

      const inventory = await inventoryRepository.findOne({
        where: { groceryId },
      });

      if (!inventory || inventory.quantity < quantity) {
        await queryRunner.rollbackTransaction();
        res.status(400).json({
          message: `Insufficient inventory for ${grocery.name}. Available: ${
            inventory?.quantity || 0
          }`,
        });
        return;
      }

      // Update total amount
      totalAmount += grocery.price * quantity;

      // Store items for processing
      itemsToProcess.push({
        grocery,
        inventory,
        quantity,
      });
    }

    // Create order
    const newOrder = orderRepository.create({
      userId,
      status: "pending",
      totalAmount,
      address,
      phone,
    });

    const savedOrder = await queryRunner.manager.save(newOrder);

    // Create order items and update inventory
    const orderItems = [];

    for (const item of itemsToProcess) {
      // Create order item
      const orderItem = orderItemRepository.create({
        orderId: savedOrder.id,
        groceryId: item.grocery.id,
        quantity: item.quantity,
        unitPrice: item.grocery.price,
      });

      orderItems.push(await queryRunner.manager.save(orderItem));

      // Update inventory
      item.inventory.quantity -= item.quantity;
      await queryRunner.manager.save(item.inventory);
    }

    await queryRunner.commitTransaction();

    res.status(201).json({
      message: "Order placed successfully",
      order: { ...savedOrder, orderItems },
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    await queryRunner.release();
  }
};

// Get user's order history
export const getOrderHistory = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const orderRepository = AppDataSource.getRepository(Order);

    const orders = await orderRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.grocery", "grocery")
      .where("order.userId = :userId", { userId })
      .orderBy("order.createdAt", "DESC")
      .getMany();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

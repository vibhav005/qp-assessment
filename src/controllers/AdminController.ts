import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Grocery } from "../models/Grocery";
import { Inventory } from "../models/Inventory";
import { GroceryItemRequest, InventoryUpdateRequest } from "../types/type";

// Add a new grocery item
export const addGroceryItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      quantity,
      threshold,
    } = req.body as GroceryItemRequest;

    const groceryRepository = AppDataSource.getRepository(Grocery);
    const inventoryRepository = AppDataSource.getRepository(Inventory);

    // Create and save the grocery item
    const grocery = groceryRepository.create({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    const savedGrocery = await groceryRepository.save(grocery);

    // Create and save inventory record
    const inventory = inventoryRepository.create({
      groceryId: savedGrocery.id,
      quantity: quantity || 0,
      threshold: threshold || 10,
      lastRestockDate: new Date(),
    });

    await inventoryRepository.save(inventory);

    res.status(201).json({
      message: "Grocery item added successfully",
      grocery: savedGrocery,
      inventory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all grocery items with inventory
export const getAllGroceryItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groceryRepository = AppDataSource.getRepository(Grocery);
    const groceries = await groceryRepository
      .createQueryBuilder("grocery")
      .leftJoinAndSelect("grocery.inventory", "inventory")
      .getMany();

    res.json(groceries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update grocery item
export const updateGroceryItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, category, imageUrl } =
      req.body as GroceryItemRequest;

    const groceryRepository = AppDataSource.getRepository(Grocery);
    const grocery = await groceryRepository.findOne({ where: { id } });

    if (!grocery) {
      res.status(404).json({ message: "Grocery item not found" });
      return;
    }

    grocery.name = name || grocery.name;
    grocery.description =
      description !== undefined ? description : grocery.description;
    grocery.price = price || grocery.price;
    grocery.category = category !== undefined ? category : grocery.category;
    grocery.imageUrl = imageUrl !== undefined ? imageUrl : grocery.imageUrl;

    await groceryRepository.save(grocery);

    res.json({ message: "Grocery item updated successfully", grocery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete grocery item
export const deleteGroceryItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const groceryRepository = AppDataSource.getRepository(Grocery);
    const grocery = await groceryRepository.findOne({ where: { id } });

    if (!grocery) {
      res.status(404).json({ message: "Grocery item not found" });
      return;
    }

    await groceryRepository.remove(grocery);

    res.json({ message: "Grocery item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update inventory
export const updateInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groceryId = parseInt(req.params.id);
    const { quantity, threshold } = req.body as InventoryUpdateRequest;

    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventory = await inventoryRepository.findOne({
      where: { groceryId },
    });

    if (!inventory) {
      res
        .status(404)
        .json({ message: "Inventory for this grocery item not found" });
      return;
    }

    if (quantity !== undefined) {
      inventory.quantity = quantity;
      inventory.lastRestockDate = new Date();
    }

    if (threshold !== undefined) {
      inventory.threshold = threshold;
    }

    await inventoryRepository.save(inventory);

    res.json({ message: "Inventory updated successfully", inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

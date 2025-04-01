// Types for all controllers
import { Request, Response } from "express";
import { Grocery } from "../models/Grocery";
import { Inventory } from "../models/Inventory";

// Types
export interface RequestWithUser extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export interface GroceryItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity?: number;
  threshold?: number;
}

export interface InventoryUpdateRequest {
  quantity?: number;
  threshold?: number;
}

export interface OrderItemRequest {
  groceryId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  address: string;
  phone: string;
}

export interface AuthRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface ItemToProcess {
  grocery: Grocery;
  inventory: Inventory;
  quantity: number;
}

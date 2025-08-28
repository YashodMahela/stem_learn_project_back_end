import { NextFunction, Request, Response } from "express";
import Address from "../infrastructure/db/entities/Address";
import Order from "../infrastructure/db/entities/Order";
import NotFoundError from "../domain/errors/not-found-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import { getAuth } from "@clerk/express";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    // const { userId } = getAuth(req);
    // res.json(data);

    // Create address and handle errors
    const address = await Address.create(data.shippingAddress);

    // Try to create the order and handle possible errors
    let order;
    try {
      order = await Order.create({
        addressId: address._id,
        items: data.orderItems,
        userId: "123",
      });
    } catch (error: any) {
      // If order creation fails, remove the created address to avoid orphan records
      await Address.findByIdAndDelete(address._id);
      throw new Error("Failed to create order: " + error.message);
    }
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = "123";

    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders for a specific user by userId query param.
 * Example: GET /orders?userId=user_31jkFTXeeiBCJyM3OvVzm7zadpJ
 */
const getOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId query parameter." });
    }

    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export { createOrder, getOrder, getOrdersByUserId };

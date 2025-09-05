import { NextFunction, Request, Response } from "express";
import Address from "../infrastructure/db/entities/Address";
import Order from "../infrastructure/db/entities/Order";
import NotFoundError from "../domain/errors/not-found-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import { getAuth } from "@clerk/express";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    
    // Get user ID from Clerk authentication
    const userId  = req.body.userId ? req.body.userId : "" ;

    // // Check if user is authenticated
    // if (!userId) {
    //   throw new UnauthorizedError("User not authenticated");
    // }
    
    // console.log("Authenticated user ID:", userId);
    
    // Validate required data
    if (!data.orderItems || !Array.isArray(data.orderItems) || data.orderItems.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }
    
    if (!data.shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }
    
    // Create address and handle errors
    const address = await Address.create(data.shippingAddress);
    console.log("Created address:", address._id);
    
    // Try to create the order and handle possible errors
    let order;
    try {
      order = await Order.create({
        addressId: address._id,
        items: data.orderItems,
        userId: userId,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod || "CREDIT_CARD",
        paymentStatus: data.paymentStatus || "PENDING",
        date: new Date(),
      });
      
      console.log("Created order:", order._id);
      
      // Return the created order
      res.status(201).json({
        success: true,
        order: {
          id: order._id,
          userId: order.userId,
          items: order.items,
          addressId: order.addressId,
        }
      });
      
    } catch (error: any) {
      console.error("Order creation failed:", error);
      // If order creation fails, remove the created address to avoid orphan records
      await Address.findByIdAndDelete(address._id);
      throw new Error("Failed to create order: " + error.message);
    }
    
  } catch (error: any) {
    console.error("Create order error:", error);
    next(error);
  }
};


const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

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

const getOrderStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: "PENDING" });
    const shippedOrders = await Order.countDocuments({ orderStatus: "SHIPPED" });
    const fulfilledOrders = await Order.countDocuments({ orderStatus: "FULFILLED" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "CANCELLED" });

    res.json({
      totalOrders,
      pendingOrders,
      shippedOrders,
      fulfilledOrders,
      cancelledOrders,
    });
  } catch (error) {
    next(error);
  }
};


const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const filter: any = {};

    // Only filter if status is provided AND not "ALL"
    if (status && status !== "ALL") {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter).populate("addressId"); // optional populate

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getDailySales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const range = Number(req.query.range) === 30 ? 30 : 7; // default 7
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (range - 1)); // include today

    // Aggregate per calendar day (based on server TZ)
    const rows = await Order.aggregate([
      {
        $match: {
          date: { $gte: start },
        },
      },
      {
        $group: {
          _id: {
            y: { $year: "$date" },
            m: { $month: "$date" },
            d: { $dayOfMonth: "$date" },
          },
          total: { $sum: 1 }, // Count orders instead of sum amount
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: { year: "$_id.y", month: "$_id.m", day: "$_id.d" },
          },
          total: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Ensure missing days show up as 0
    const byDay: Record<string, number> = {};
    rows.forEach((r) => {
      const key = new Date(r.date).toISOString().slice(0, 10); // YYYY-MM-DD
      byDay[key] = r.total;
    });

    const out: { date: string; total: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= now) {
      const key = cursor.toISOString().slice(0, 10);
      out.push({ date: key, total: byDay[key] ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.json({ range, data: out });
  } catch (err) {
    next(err);
  }
};
export { createOrder, getOrder, getOrdersByUserId, getOrderStats, getAllOrders, getDailySales };

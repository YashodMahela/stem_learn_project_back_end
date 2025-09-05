import express from "express";
import { createOrder, getAllOrders, getDailySales, getOrder, getOrdersByUserId, getOrderStats } from "./../application/order";
import isAuthenticated from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter.get("/stats", getOrderStats);
orderRouter.get("/daily-sales", getDailySales);
orderRouter.route("/").get(getAllOrders);
orderRouter.post("/",createOrder);
orderRouter.route("/:id").get(isAuthenticated,getOrder);
// Get all orders for a specific user
orderRouter.route("/:userId").get(isAuthenticated,getOrdersByUserId);

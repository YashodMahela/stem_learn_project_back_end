import express from "express";
import { createOrder, getOrder, getOrdersByUserId } from "./../application/order";
import isAuthenticated from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter.route("/").post(createOrder);
orderRouter.route("/:id").get(getOrder);

// Get all orders for a specific user
orderRouter.route("/").get(getOrdersByUserId);

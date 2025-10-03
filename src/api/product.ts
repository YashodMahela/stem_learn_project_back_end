import express from "express";
import {
  getAllProducts,
  getNewArrivalProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../application/product";
import isAuthenticated from "./middleware/authentication-middleware";

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(isAuthenticated,createProduct);
productRouter.route("/new-arrival-products").get(getNewArrivalProducts);
productRouter
  .route("/:id")
  .get(getProductById)
  .put(isAuthenticated,updateProductById)
  .delete(isAuthenticated,deleteProductById);

export default productRouter;

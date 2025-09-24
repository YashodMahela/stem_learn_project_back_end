import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../application/product";
import isAuthenticated from "./middleware/authentication-middleware";

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(isAuthenticated,createProduct);

productRouter
  .route("/:id")
  .get(getProductById)
  .put(isAuthenticated,updateProductById)
  .delete(isAuthenticated,deleteProductById);

export default productRouter;

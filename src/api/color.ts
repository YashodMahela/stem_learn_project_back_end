import express from "express";
import {
    createColor,
    deleteColorById,
    getAllColors,
    getColorById,
    updateColorById,
} from "../application/color";
import isAuthenticated from "./middleware/authentication-middleware";

const colorRouter = express.Router();

colorRouter.route("/").get(getAllColors).post(createColor);

colorRouter
  .route("/:id")
  .get(getColorById)
  .put(updateColorById)
  .delete(deleteColorById);

export default colorRouter;

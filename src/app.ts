import "dotenv/config";
import express from "express";
import productRouter from "./api/product";
import categoryRouter from "./api/category";
import reviewRouter from "./api/review";
import { connectDB } from "./infrastructure/db/index";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import cors from "cors";
import { orderRouter } from "./api/order";
import colorRouter from "./api/color";
import { clerkMiddleware } from "@clerk/express";
import serverless from "serverless-http";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); //It conversts the incomign json payload of a  request into a javascript object found in req.body

const allowedFrontendOrigin = process.env.FRONTEND_URL;
// app.use(clerkMiddleware());
app.use(cors({ origin: allowedFrontendOrigin }));


app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/colors", colorRouter);


app.use(globalErrorHandlingMiddleware);

connectDB();

const PORT = process.env.PORT;
if (PORT) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export const handler = serverless(app);


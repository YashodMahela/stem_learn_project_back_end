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
// Remove this line: import serverless from "serverless-http";
import { paymentsRouter } from "./api/payment";
import { handleWebhook } from "./application/payment";
import bodyParser from "body-parser";

const app = express();

// Connect to database
connectDB();

const corsOptions = {
    origin: 'https://fed-2-front-end-yashod.vercel.app',
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));

app.post(
    "/api/stripe/webhook",
    bodyParser.raw({ type: "application/json" }),
    handleWebhook
);
app.use(express.json());

// Routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/colors", colorRouter);
app.use("/api/payments", paymentsRouter);

// Error handling middleware should be last
app.use(globalErrorHandlingMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Remove this line: export const handler = serverless(app);
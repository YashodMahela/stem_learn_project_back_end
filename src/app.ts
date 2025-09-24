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
import { paymentsRouter } from "./api/payment";
import { handleWebhook } from "./application/payment";
import bodyParser from "body-parser";
import { clerkMiddleware } from "@clerk/express"; // ✅ Add this

const app = express();

// Connect to database
connectDB();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));

// ✅ Clerk middleware must come before routes using `getAuth`
app.use(clerkMiddleware());

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
app.use("/api/orders", orderRouter); // has isAuthenticated → needs Clerk
app.use("/api/colors", colorRouter);
app.use("/api/payments", paymentsRouter);

// Error handling middleware should be last
app.use(globalErrorHandlingMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

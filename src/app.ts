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

// IMPORTANT: Clerk middleware must be registered FIRST before any routes that use getAuth()
// app.use(clerkMiddleware({
//     // Optional: Add your publishable key for additional security
//     publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
//     // Optional: Configure JWKS endpoint
//     secretKey: process.env.CLERK_SECRET_KEY
// }));

// Middleware to parse JSON bodies
app.use(express.json());

const allowedFrontendOrigin = process.env.FRONTEND_URL;
app.use(cors({
    origin: allowedFrontendOrigin,
    credentials: true // Important for Clerk authentication
}));

// Routes - these can now use getAuth() safely
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/colors", colorRouter);

// Error handling middleware should be last
app.use(globalErrorHandlingMiddleware);

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;

if (PORT) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export const handler = serverless(app);
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
import serverless from "serverless-http";
import { paymentsRouter } from "./api/payment";
import { handleWebhook } from "./application/payment";
import bodyParser from "body-parser";

const app = express();

app.use(globalErrorHandlingMiddleware);
// Connect to database
connectDB();

// IMPORTANT: Clerk middleware must be registered FIRST before any routes that use getAuth()
// app.use(clerkMiddleware({
//     // Optional: Add your publishable key for additional security
//     publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
//     // Optional: Configure JWKS endpoint
//     secretKey: process.env.CLERK_SECRET_KEY
// }));



// const allowedFrontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
// const allowedFrontendOrigin = "https://fed-2-front-end-yashod.vercel.app";

// app.use(cors({
//     origin: allowedFrontendOrigin,
//     credentials: true
// }));
const corsOptions = {
    origin: 'https://fed-2-front-end-yashod.vercel.app', // Allow only your frontend
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true
};

app.use(cors(corsOptions));


app.post(
    "/api/stripe/webhook",
    bodyParser.raw({ type: "application/json" }),
    handleWebhook
);
app.use(express.json());

// Routes - these can now use getAuth() safely
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/colors", colorRouter);
app.use("/api/payments", paymentsRouter);

// Error handling middleware should be last
app.use(globalErrorHandlingMiddleware);



const PORT = process.env.PORT || 3000;

if (PORT) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export const handler = serverless(app);
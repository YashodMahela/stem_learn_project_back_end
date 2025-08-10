import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from "./infrastructure/db/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
    res.json({ message: 'E-commerce API is running!' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

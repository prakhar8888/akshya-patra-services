import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// --- Core Setup ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --- Database & Passport ---
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';

// --- Route Imports ---
import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import callLogRoutes from './routes/callLogRoutes.js';
import emailLogRoutes from './routes/emailLogRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import dailyReportRoutes from './routes/dailyReportRoutes.js';
import sectorRoutes from './routes/sectorRoutes.js';
import designationRoutes from './routes/designationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';
import pusherRoutes from './routes/pusherRoutes.js';

// --- Middleware Imports ---
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- ES Module Fix for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runDiagnostics = async () => {
    console.log(chalk.yellow('--- 🩺 Running Backend Diagnostics ---'));
    // ... (diagnostics logic remains the same)
    await connectDB();
    console.log(chalk.green('--- ✅ All Backend Checks Passed ---'));
};

const startServer = async () => {
    await runDiagnostics().catch(err => {
        console.error(chalk.red.bold('--- ❌ Backend diagnostics failed. Server will not start. ---'));
        console.error(err);
        process.exit(1);
    });

    // --- Global Middleware ---

    // CRITICAL FIX FOR CORS: This tells the backend to allow requests from your frontend's origin.
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // --- Passport Middleware ---
    app.use(passport.initialize());
    configurePassport(passport);

    // --- API Routes ---
    app.use('/api/auth', authRoutes);
    app.use('/api/candidates', candidateRoutes);
    app.use('/api/jobs', jobRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/call-logs', callLogRoutes);
    app.use('/api/emails', emailLogRoutes);
    app.use('/api/notes', noteRoutes);
    app.use('/api/reports', dailyReportRoutes);
    app.use('/api/sectors', sectorRoutes);
    app.use('/api/designations', designationRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/activity-logs', activityLogRoutes);
    app.use('/api/pusher', pusherRoutes);

    // --- Serve Uploaded Files Statically ---
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // --- Custom Error Handling Middleware ---
    app.use(notFound);
    app.use(errorHandler);

    // --- Start Listening ---
    app.listen(PORT, () => console.log(chalk.bold.cyan(`🚀 Server running on port ${PORT}`)));
};

startServer();


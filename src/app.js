// src/app.js

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import employeesRouter from './routes/employees.routes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

// Builds the Express app by layering middleware, feature routers, and error handlers.

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Lightweight health check so deployment platforms can verify the runtime is alive.
app.get('/health', (_req, res) => res.json({ ok: true }));

// Route grouping for employee CRUD endpoints.
app.use('/employees', employeesRouter);

// Fallback middleware order matters: 404 handler first, then error formatter.
app.use(notFound);
app.use(errorHandler);

export default app;

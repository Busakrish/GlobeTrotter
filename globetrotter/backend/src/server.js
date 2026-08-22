import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabase } from './scripts/seed.js';
import DataStore from './config/dataStore.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost frontend development ports
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health & Status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'GlobeTrotter REST API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    storeRecords: {
      destinations: DataStore.getCollection('destinations').length,
      trips: DataStore.getCollection('trips').length,
      users: DataStore.getCollection('users').length,
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', expenseRoutes);
app.use('/api', collaborationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', checklistRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Initialization & Start
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database/store has no destinations yet
    const existingDestinations = DataStore.getCollection('destinations');
    if (!existingDestinations || existingDestinations.length === 0) {
      console.log('[GlobeTrotter] Initializing database with seed travel data...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`[GlobeTrotter Backend] Server listening on http://localhost:${PORT}`);
      console.log(`[GlobeTrotter Backend] Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Server Startup Error]:', error.message);
  }
};

startServer();

export default app;

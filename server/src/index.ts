import express, { Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import blogRoutes from './routes/blog.routes';
import galleryRoutes from './routes/gallery.routes';
import authRoutes from './routes/auth.routes';
import donationRoutes from './routes/donation.routes';
import contactRoutes from './routes/contact.routes';
import joinRequestRoutes from './routes/joinRequest.routes';
import settingsRoutes from './routes/settings.routes';
import uploadRoutes from './routes/upload.routes';
import dashboardRoutes from './routes/dashboard.routes';
import tourismRoutes from './routes/tourism.routes';
import { testConnection, closePool } from './config/database';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Example root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Suban Wildlife Photography Website API');
});

// Routes
app.use('/api', authRoutes);
app.use('/api', blogRoutes);
app.use('/api', galleryRoutes);
app.use('/api', donationRoutes);
app.use('/api', contactRoutes);
app.use('/api', joinRequestRoutes);
app.use('/api', settingsRoutes);
app.use('/api', uploadRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/tourism', tourismRoutes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize database connection and start server
async function startServer() {
  try {
    console.log('🔄 Initializing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log('🚀 Suban Wildlife Photography API is ready!');
    });
    
    // Keep the server running
    process.on('SIGTERM', async () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await closePool();
        console.log('🔒 HTTP server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', async () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      server.close(async () => {
        await closePool();
        console.log('🔒 HTTP server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();


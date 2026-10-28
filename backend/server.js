import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables before initializing components
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Establish database connection before starting the HTTP server
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

import mongoose from 'mongoose';
import dns from 'dns';

/**
 * Connect to MongoDB database using Mongoose
 * Validates MONGODB_URI and avoids redundant connections
 * Handles Node.js SRV DNS resolution quirks on Windows
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  // Avoid redundant connections if already connected (1) or connecting (2)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // If Node fails resolving SRV record via local network DNS on Windows, retry with public DNS
    if (error.message?.includes('querySrv') || error.message?.includes('ECONNREFUSED')) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
        return conn;
      } catch (retryError) {
        console.error(`MongoDB connection failed on retry: ${retryError.message}`);
        throw retryError;
      }
    }

    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;

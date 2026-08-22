import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/globetrotter';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`[MongoDB] Connection Notice: ${error.message}`);
    console.log(`[GlobeTrotter] Using persistent DataStore engine for database records.`);
    return false;
  }
};

export const getIsMongoConnected = () => isMongoConnected;

export default connectDB;

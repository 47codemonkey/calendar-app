import mongoose from 'mongoose';

const connectDB = async (): Promise<boolean> => {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {
      connectTimeoutMS: 10000,
    });
    console.log('Mongodb connected');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false;
  }
};

export default connectDB;

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected Successfully")
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err)
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected')
        });

        const conn = await mongoose.connect(process.env.MONGODB_URI + '/imagify', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        return conn;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        throw error;
    }
}

export default connectDB;
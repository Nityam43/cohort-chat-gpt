const mongoose = require('mongoose');


async function connectDb() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("Connected to MongoDB successfully");
        return true;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        throw err; // Re-throw to be handled by caller
    }
}


module.exports = connectDb;
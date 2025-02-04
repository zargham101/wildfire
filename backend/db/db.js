const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, config.options);
        console.log(' MongoDB Connected Successfully');
    } catch (err) {
        console.error(' MongoDB Connection Error:', err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;

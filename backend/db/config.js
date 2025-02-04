require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGO_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
};

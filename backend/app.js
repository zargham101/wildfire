const express = require('express');
const cors = require('cors');
const connectDb = require ('./db/db')
const routes = require('./route/index')
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

connectDb();

app.use("/api/user", routes.user)
app.use("/api/review", routes.review)
app.use("/api/chat", routes.chat)
app.use("/api/prediction", routes.prediction)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

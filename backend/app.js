const express = require('express');
const cors = require('cors');
const passport = require("passport");
const connectDb = require ('./db/db')
const routes = require('./route/index')
const session = require("express-session");
require('dotenv').config();

const passportConfig = require("./config/passport");
passportConfig(passport);

const app = express();

app.use(express.json());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

connectDb();

app.use("/api/user", routes.user);
app.use("/api/review", routes.review);
app.use("/api/chat", routes.chat);
app.use("/api/prediction", routes.prediction);
app.use("/api/admin", routes.admin);
app.use("/api/agency", routes.agency);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

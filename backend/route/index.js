const user = require('./userRoute/index');
const review = require('./reviewRoute/index');
const chat = require("./chatRoute/chatRoute");
const prediction = require("./predictionRoute/predictionRoute");

module.exports = {
  user,
  review,
  chat,
  prediction
}
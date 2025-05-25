const user = require('./userRoute/index');
const review = require('./reviewRoute/index');
const chat = require("./chatRoute/chatRoute");
const prediction = require("./predictionRoute/predictionRoute");
const admin = require("../admin/route/adminoutes");

module.exports = {
  user,
  review,
  chat,
  prediction,
  admin
}
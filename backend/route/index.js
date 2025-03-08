const user = require('./userRoute/index')
const review = require('./reviewRoute/index')
const chat = require("./chatRoute/chatRoute");


module.exports = {
  user,
  review,
  chat
}
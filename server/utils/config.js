require('dotenv').config()

const PORT = 5000

const MONGODB_URI = "mongodb+srv://pradnyeshjain:Pradnyesh@cluster0.unpt62k.mongodb.net/?retryWrites=true&w=majority"
const SECRET = "secret"
// process.env.NODE_ENV === 'test'
//   ? process.env.TEST_MONGODB_URI
//   : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}

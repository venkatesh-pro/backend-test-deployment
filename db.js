const mongoose = require('mongoose')

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE)
    console.log(`Connected to Db`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDb

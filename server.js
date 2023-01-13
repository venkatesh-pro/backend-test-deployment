const express = require('express')
const cors = require('cors')
const { readdirSync } = require('fs')
const connectDb = require('./db')
const cookieParser = require('cookie-parser')

const dotenv = require('dotenv').config({
  path: './.env',
})

const app = express()

app.use(
  cors({
    origin: 'https://frontend-test-deployment-8ycd.vercel.app',
    credentials: true,
  })
)

app.use(express.json({ limit: '1000mb' }))
app.use(cookieParser())

// db
connectDb()

// routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App is Running on PORT => ${PORT}`)
})

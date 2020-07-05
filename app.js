const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
.then(() => console.log('MONGODB Connected!'))
.catch((e) => console.log('MONGODB Connection Error', e))


// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api', userRoutes)


app.listen(process.env.PORT, () => {
  console.log(`Server on port ${process.env.PORT}`)
})
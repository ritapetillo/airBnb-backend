const express = require('express')
const listingRoutes = require('./services/listings')
const bookingRoutes = require('./services/bookings')
const userRoutes = require('./services/users')
const reviewsRoutes = require('./services/reviews')


const server = express()
const mongoose = require('mongoose')
const  error_handler = require('node-error-handler');
const reviewsRouter = require('./services/reviews')


//connect to database
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>console.log('connected to mongo'))

server.use(express.json())
server.use('/listings',listingRoutes)
server.use('/bookings',bookingRoutes)
server.use('/users',userRoutes)
server.use('/reviews',reviewsRouter)




server.use(error_handler({ log: true, debug: true }));

const PORT = process.env.PORT || 3001

server.listen(PORT,()=>console.log('connected to',PORT))
const express = require('express')
const placesRouter = require('./services/places')
const server = express()
const placesRoutes = require('./services/places')
const mongoose = require('mongoose')
const  error_handler = require('node-error-handler');


//connect to database
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>console.log('connected to mongo'))

server.use(express.json())
server.use('/places',placesRoutes)

server.use(error_handler({ log: true, debug: true }));

const PORT = process.env.PORT || 3001

server.listen(PORT,()=>console.log('connected to',PORT))
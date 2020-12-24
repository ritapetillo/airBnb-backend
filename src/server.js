const express = require('express')
const placesRouter = require('./services/places')
const server = express()
const placesRoutes = require('./services/places')

server.use('/places',placesRoutes)

const PORT = process.env.PORT || 3001

server.listen(PORT,()=>console.log('connected to',PORT))
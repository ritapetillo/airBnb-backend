const express = require('express')
const housesRouter = express.Router()

housesRouter.get('/',async(req,res,next)=>{
    res.send('those are all the houses')
})


module.exports = housesRouter
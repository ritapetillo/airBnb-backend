const express = require('express')
const Booking = require('../../models/Booking')
const bookingRouter = express.Router()

bookingRouter.get('/', async(req,res,next)=>{
try{
    const bookings = await Booking.find()
    res.send(bookings)
} catch(err){
    const  error = new  Error('It was not possible to update the listing');
    error.code = 400;
    next(error);

}
})

bookingRouter.post('/', async(req,res,next)=>{
    try{
        const bookings = await Booking.find()
        res.send(bookings)
    } catch(err){
        const  error = new  Error('It was not possible to update the listing');
        error.code = 400;
        next(error);
    
    }
    })

module.exports = bookingRouter
const express = require('express')
const Booking = require('../../models/Booking')
const bookingRouter = express.Router()

bookingRouter.get('/', async(req,res,next)=>{
try{
    const bookings = await Booking.find().populate('reviewFromGuest').populate('reviewFromHost')
    res.send(bookings)
} catch(err){
    const  error = new  Error('It was not possible to update the listing');
    error.code = 400;
    next(error);

}
})

bookingRouter.post('/', async(req,res,next)=>{
    try{
        const newBooking = await new Booking({
            ...req.body,
            createdAt:Date.now(),
            updatedAt:Date.now()
        })
        await newBooking.save()
        res.send(newBooking)
    } catch(err){
        const  error = new  Error('It was not possible to create a new booking');
        error.code = 400;
        next(error);
    
    }
    })

    
module.exports = bookingRouter
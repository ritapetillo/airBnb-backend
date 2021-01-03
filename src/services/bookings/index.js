const express = require('express')
const Booking = require('../../models/Booking')
const User = require('../../models/User')
const bookingRouter = express.Router()
const auth = require('../../lib/privateRoutes')
const Listing = require('../../models/Listing')


//GET /bookings
//get all bookings
bookingRouter.get('/', auth,async(req,res,next)=>{
try{
    const bookings = await Booking.find().populate('reviewFromGuest').populate('reviewFromHost')
    res.send(bookings)
} catch(err){
    const  error = new  Error('It was not possible to find any bookings');
    error.code = 400;
    next(error);

}
})


//GET /bookings/:id
//get booking by booking id
bookingRouter.get('/:id', async(req,res,next)=>{
    const {id} = req.params
    try{
        const booking = await Booking.findById(id).populate('reviewFromGuest').populate('reviewFromHost')
        res.send(booking)
    } catch(err){
        const  error = new  Error('It was not possible to find the booking');
        error.code = 400;
        next(error);
    
    }
    })

//POST /bookings
//post a booking
bookingRouter.post('/', async(req,res,next)=>{
    try{
        const newBooking = await new Booking({
            ...req.body,
            createdAt:Date.now(),
            updatedAt:Date.now()
        })
        await newBooking.save()
        const listing = await Listing.findById(newBooking.listing)
        await listing.bookings.push(newBooking._id)
        await listing.save()
        res.send(newBooking)
    } catch(err){
console.log(err)
        const  error = new  Error('It was not possible to create a new booking');
        error.code = 400;
        next(error);
    
    }
    })

//PUT /bookings/id
//edit a booking by id
bookingRouter.put('/:id', async(req,res,next)=>{
    const {id} = req.params
    try{
    const editedBooking = await Booking.findByIdAndUpdate(id,
       {
            ...req.body,
            updatedAt:Date.now()
        })
        res.send(editedBooking)
    } catch(err){
        const  error = new  Error('It was not possible to edit this booking');
        error.code = 400;
        next(error);
    
    }
    })

//DELETE /bookings/id
//delete a booking by id or all
bookingRouter.delete('/:id', async(req,res,next)=>{
    const {id} = req.params
    try{
        if(id ==- 'all'){
            await Booking.deleteMany()
            res.send('deleted all bookings')
        } else
    {const deletedBooking = await Booking.findByIdAndDelete(id)
        res.send(deletedBooking)}
    } catch(err){
        const  error = new  Error('It was not possible to delete this booking');
        error.code = 400;
        next(error);
    
    }
    })
    
module.exports = bookingRouter
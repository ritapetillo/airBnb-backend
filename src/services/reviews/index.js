const express = require('express')
const Listing = require('../../models/Listing')
const Booking = require('../../models/Booking')
const Review = require('../../models/Review')

const reviewsRouter = express.Router()

//GET /reviews/
//get all reviews
reviewsRouter.get('/',async(req,res,next)=>{
    try{
const reviews = await Review.find()
res.send(reviews)

    } catch(err){
        console.log(err)
        next(err)
    }
})

//POST /reviews/guest
//guest post review for booking/listing
reviewsRouter.post('/guest',async(req,res,next)=>{
    const {booking_id,author} = req.body
    try{
        //check if the user who leaves the reviews is the same that made the booking and that the user didn't leave a review for this booking yet
        const booking = await Booking.findById(booking_id)
        console.log(booking.reviewFromGuest)
        // console.log(author)
        if(booking.guest != author || booking.reviewFromGuest !== undefined){
            //if not, then don't let user to leave the review
            const error = new Error("You cannot review this listing")
            error.code = 400
            return next(error)
        } else{
            //if yes, then user can leave the review
            const review = await new Review({
                ...req.body,
                createAt:Date.now(),
                updatedAt:Date.now()
            })
            const reviewLeft = await review.save()
            booking.reviewFromGuest = reviewLeft._id
            await booking.save()
            res.send({review: reviewLeft, booking:booking})

        }


    } catch(err){
        console.log(err)
        next(err)
    }
})

//POST /reviews/host
//host post a review for the guest/booking
reviewsRouter.post('/host',async(req,res,next)=>{
    const {booking_id,author} = req.body
    try{
        //check if the user who leaves the reviews is the same that made the booking and that the user didn't leave a review for this booking yet
        const booking = await Booking.findById(booking_id).populate('listing')
        console.log(booking)
        // console.log(author)
        if(booking.listing.host != author || booking.reviewFromHost !== undefined){
            //if not, then don't let user to leave the review
            const error = new Error("You cannot review this listing")
            error.code = 400
            return next(error)
        } else{
            //if yes, then user can leave the review
            const review = await new Review({
                ...req.body,
                createAt:Date.now(),
                updatedAt:Date.now()
            })
            const reviewLeft = await review.save()
            booking.reviewFromHost = reviewLeft._id
            await booking.save()
            res.send({review: reviewLeft, booking:booking})

        }


    } catch(err){
        console.log(err)
        next(err)
    }
})

//PUT /reviews/:id
//modify a review by id
reviewsRouter.put('/:id',async(req,res,next)=>{
    const {author} = req.body
    const {id} = req.params
    console.log(id)
    try{
        //find the review by ID
        let review = await Review.findById(id)
        console.log(review)
        if(review == undefined || review == null) {
            const error = new Error("Review not found")
            error.code = 404
            return next(error)
        } else{
        //make sure who edits the review is the author of review
        if(review.author != author){
            const error = new Error("You cannot review this listing")
            error.code = 400
            return next(error)
        } else{
            //if yes, then user can leave the review
            review = {
                ...req.body,
                createAt:Date.now(),
                updatedAt:Date.now()
            }

            const reviewEdited = await Review.findByIdAndUpdate(id,review)
            res.send(reviewEdited)}

        }


    } catch(err){
        console.log(err)
        next(err)
    }
})

//DELETE /reviews/all
//delete all reviews
reviewsRouter.delete('/all',async(req,res,next)=>{
    try{
const reviewsToDelete = await Review.deleteMany()
res.send(reviewsToDelete)

    } catch(err){
        console.log(err)
        next(err)
    }
})

//DELETE /reviews/:id
//delete a review by id
reviewsRouter.delete('/:id',async(req,res,next)=>{
    const {id} = req.params
    try{
const reviewToDelete = await Review.findByIdAndDelete(id)

res.send(reviewToDelete)

    } catch(err){
        console.log(err)
        next(err)
    }
})

module.exports = reviewsRouter

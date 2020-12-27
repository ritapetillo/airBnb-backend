const express = require('express')
const Listing = require('../../models/Listing')
const listingRouter = express.Router()
const Post = require('../../models/Listing')

listingRouter.get('/',async(req,res,next)=>{
    try{
        const posts = await Post.find()
        res.send(posts)

    } catch(err){
        console.log(err)
    }
})

// GET /listings/:id
//get a plae by id
listingRouter.get('/:id',async(req,res,next)=>{
    try{
    const {id} = req.params;
    const Listing = await Listing.findById(id)
    res.send(listing)

    } catch(err){
        const  error = new  Error('Listing not found');
        error.code = 404;
        next(error);
    }
})

// POST /listings/ 
//create new listing
listingRouter.post('/',async(req,res,next)=>{

    try{
        const newListing = new Listing({
            ...req.body,
            createdAt:Date.now(),
            updatedAt:Date.now()
        })
newListing.save()
res.send(newListing)

    } catch(err){
        console.log(err)
    }
})

// PUT /listings/:id
//edit existing listing by id
listingRouter.put('/:id',async(req,res,next)=>{
    const {id} = req.params;
    try{
        const editedListing = {
            ...req.body,
            createdAt:Date.now(),
            updatedAt:Date.now()
        }
        const listingToEdit = await Listing.findByIdAndUpdate(id,editedListing)
res.send(editedListing)

    } catch(err){
        const  error = new  Error('It was not possible to update the listing');
        error.code = 400;
        next(error);
    }
})

// DELETE /listings/:id
//delete existing listing by id
listingRouter.delete('/:id',async(req,res,next)=>{
    const {id} = req.params;
    try{
        const listingToDelete = await Listing.findByIdAndDelete(id)
         res.send({
             deleted:listingToDelete,
             meg:'correctly deleted'
         })

    } catch(err){
        const  error = new  Error('It was not possible to update the listing');
        error.code = 400;
        next(error);
    }
})



module.exports = listingRouter
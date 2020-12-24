const express = require('express')
const Place = require('../../models/Place')
const placesRouter = express.Router()
const Post = require('../../models/Place')

placesRouter.get('/',async(req,res,next)=>{
    try{
        const posts = await Post.find()
        res.send(posts)

    } catch(err){
        console.log(err)
    }
})

// GET /places/:id
//get a plae by id
placesRouter.get('/:id',async(req,res,next)=>{
    try{
    const {id} = req.params;
    const place = await Place.findById(id)
    res.send(place)

    } catch(err){
        const  error = new  Error('Place not found');
        error.code = 404;
        next(error);
    }
})

// POST /places/ 
//create new place
placesRouter.post('/',async(req,res,next)=>{

    try{
        const newPlace = new Place({
            ...req.body,
            createdAt:Date.now(),
            updatedAt:Date.now()
        })
newPlace.save()
res.send(newPlace)

    } catch(err){
        console.log(err)
    }
})

// PUT /places/:id
//edit existing place by id
placesRouter.put('/:id',async(req,res,next)=>{
    const {id} = req.params;
    try{
        const editedPlace = {
            ...req.body,
            createdAt:Date.now(),
            updatedAt:Date.now()
        }
        const placeToEdit = await Place.findByIdAndUpdate(id,editedPlace)
res.send(editedPlace)

    } catch(err){
        const  error = new  Error('It was not possible to update the place');
        error.code = 400;
        next(error);
    }
})

// DELETE /places/:id
//delete existing place by id
placesRouter.delete('/:id',async(req,res,next)=>{
    const {id} = req.params;
    try{
        const placeToDelete = await Place.findByIdAndDelete(id)
         res.send({
             deleted:placeToDelete,
             meg:'correctly deleted'
         })

    } catch(err){
        const  error = new  Error('It was not possible to update the place');
        error.code = 400;
        next(error);
    }
})



module.exports = placesRouter
const express = require('express')
const Listing = require('../../models/Listing')
const Booking = require('../../models/Booking')
const auth = require('../../lib/provateRoutes')
const listingRouter = express.Router()
const Post = require('../../models/Listing')
const multer = require('multer')
const cloudinary = require('../../lib/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
let nodeGeocoder = require('node-geocoder');
let options = {
    provider: 'openstreetmap'
  };
   
  let geoCoder = nodeGeocoder(options);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'listing',
    //   format: async (req, file) => 'png', // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  });
   
  const parser = multer({ storage: storage });

// GET /listings
//get all the listings
listingRouter.get('/',async(req,res,next)=>{
    try{
        const posts = await Post.find().populate('host')
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
listingRouter.post('/',auth,parser.array('images'),async(req,res,next)=>{
    const imagesUris = []
if(req.files){
    const files = req.files
    files.map(file=>imagesUris.push(file.path))
}
if (req.file && req.file.path) {// if only one image uploaded
    imagesUris = req.file.path; // add the single  
};
 const {street,city,state,country,zip} = req.body
    try{
        const address = await geoCoder.geocode(`${street} ${city} ${zip} ${state} ${country} `)
        const newListing = new Listing({
            ...req.body,
            images:imagesUris,
            host:req.user.id,
            address,
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
//delete existing listing by id (or all id id===all)
listingRouter.delete('/:id',async(req,res,next)=>{
    const {id} = req.params;
    try{
        if(id === 'all'){
      await Listing.deleteMany()
        } else{

        const listingToDelete = await Listing.findByIdAndDelete(id)
         res.send({
             deleted:listingToDelete,
             meg:'correctly deleted'
         })
        }
    } catch(err){
        const  error = new  Error('It was not possible to update the listing');
        error.code = 400;
        next(error);
    }
})

 //GET /listings/:id/bookings
 //get all bookings for a listing by listing id
 listingRouter.get('/:id/bookings',async(req,res,next)=>{
    try{
    const {id} = req.params;
    const bookings = await Booking.find({listing:id})
    res.send(bookings)

    } catch(err){
        const  error = new  Error('There is an error finding the booking for this listing');
        error.code = 404;
        next(error);
    }
})

listingRouter.get('/search/city',async(req,res,next)=>{
    try{
        const result = await geoCoder.geocode('18041 biscayne blvd aventura florida 33160')
        console.log(result[0].latitude)
        res.send(result)
     
    }catch(err){
        next(err)
    }
})





module.exports = listingRouter
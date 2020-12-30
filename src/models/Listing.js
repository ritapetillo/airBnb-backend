const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ListingSchema = new mongoose.Schema({

name: String,
location:{
    type: { type: String },
    coordinates: []
   },
type:String,
address:Object,
guests:Number,
bedrooms: Number,
beds:Number,
bathrooms:Number,
amenities:Array,
description:String,
images:Array,
rate:Number,
host:{ type: Schema.Types.ObjectId, ref: 'users' },
// bookings:{ type: Schema.Types.ObjectId, ref: 'bookings' },
createdAt:Date,
updatedAt:Date,
reviews:[{ type: Schema.Types.ObjectId, ref: 'reviews' }]



})

ListingSchema.index({ location: "2d" });


module.exports = mongoose.model('listings',ListingSchema)
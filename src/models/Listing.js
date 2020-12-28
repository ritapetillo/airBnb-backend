const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ListingSchema = new mongoose.Schema({

name: String,
location:Object,
type:String,
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

module.exports = mongoose.model('listings',ListingSchema)
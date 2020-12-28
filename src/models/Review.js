const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new mongoose.Schema({

booking_id:{ type: Schema.Types.ObjectId, ref: 'booking' },
author:{ type: Schema.Types.ObjectId, ref: 'users' },
rate:Number,
title:String,
text:String,
createdAt:Date,
updatedAt:Date
})

module.exports = mongoose.model('reviews',ReviewSchema)
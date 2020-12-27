const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookingSchema = new mongoose.Schema({

listing:{ type: Schema.Types.ObjectId, ref: 'listings' },
guest:{ type: Schema.Types.ObjectId, ref: 'users' },
checkin:Date,
checkout:Date,
totalAmount:Number,
createdAt:Date,
updatedAt:Date
})

module.exports = mongoose.model('bookings',BookingSchema)
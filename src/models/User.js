const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({

firstName: String,
lastName: String,
email:String,
password:String,
address:Object,
about:String,
avatar:String,
bookings:{ type: Schema.Types.ObjectId, ref: 'bookings' },
listings:{ type: Schema.Types.ObjectId, ref: 'listings' },
createdAt:Date,
updatedAt:Date,
reviews:[{ type: Schema.Types.ObjectId, ref: 'reviews' }]

})

module.exports = mongoose.model('users',UserSchema)
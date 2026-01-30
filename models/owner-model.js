const mongoose = require('mongoose');


const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: String,
    password: String,
    contact: Number,
    cart: [],
    picture: String
})

module.exports = mongoose.model('owner', ownerSchema);
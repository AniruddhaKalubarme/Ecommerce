const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const isOwner = require('../middleware/isOwner')
const { ownerRegister } = require('../controllers/authController')

router.get('/', function (req, res) {
    res.send("This is Owner")
})

router.get('/admin', isOwner, function (req, res) {
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("createproducts", {error, success, owner: true})
})

console.log("NODE_ENV is:", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
    router.post('/create', ownerRegister)
}

module.exports = router
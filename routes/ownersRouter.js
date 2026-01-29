const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

router.get('/', function (req, res) {
    res.send("This is Owner")
})

router.get('/admin', function (req, res) {
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("createproducts", {error, success})
})

console.log("NODE_ENV is:", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
    router.post('/create', async function (req, res) {
        let owners = await ownerModel.find();

        if(owners.length>=1) return res.status(500).send("You dont have permission to create Owner!!!");

        const {fullname, email, password} = req.body;
        let owner = await ownerModel.create({
                fullname,
                email,
                password,
        })
        res.status(201).send(owner)
    })
}

module.exports = router
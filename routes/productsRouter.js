const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const productModel = require('../models/product-model');

router.post('/create', upload.single('image'), async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
        let image = req.file;

        if (!name || !price || !discount || !bgcolor || !textcolor || !panelcolor || !image) {
            req.flash("error", "All fields are required");
            return res.redirect("/owners/admin");
        }

        let product = await productModel.create({
            image: image.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        })

        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    } catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong");
        res.redirect("/owners/admin");
    }
})

module.exports = router
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/', function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, isLoggedIn: false });
});

router.get('/shop', isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get('/cart', isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
    let total = user.cart.reduce((acc, product) => acc + product.price, 0);
    let discount = total*0.1;
    let MRP = total - discount;
    res.render("cart", { user, isLoggedIn: true, total, discount, MRP });
});

router.get('/addToCart/:id', isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success", "Product added to cart successfully");
    res.redirect("/shop");
})
module.exports = router;
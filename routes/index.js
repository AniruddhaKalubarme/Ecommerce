const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const ownerModel = require('../models/owner-model');

router.get('/', function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, isLoggedIn: false });
});

router.get('/shop', isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    let owner = req.user instanceof ownerModel;
    res.render("shop", { products, success, owner });
});

router.get('/cart', isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");
    if (!user) {
        req.flash("error", "You are not authorized to view this page");
        return res.redirect("/shop");
    }
    if (!user.cart.length) {
        req.flash("error", "Your cart is empty");
        res.redirect("/shop");
    }
    let total = user.cart.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
    let discount = Math.round(total * 0.05);
    let MRP = total - discount;
    res.render("cart", { user, isLoggedIn: true, total, discount, MRP });
});

router.get('/addToCart/:id', isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let from = req.query.from;

        if (!user) {
            req.flash("error", "You are not authorized to add items to the cart");
            return res.redirect("/shop");
        }
        let productIndex = user.cart.findIndex(item => item.product && item.product.toString() === req.params.id);
        if (productIndex !== -1) {
            user.cart[productIndex].quantity += 1;
        } else {
            user.cart.push({ product: req.params.id, quantity: 1 });
        }
        await user.save();
        req.flash("success", "Product added to cart successfully");
        if(from === "cart") return res.redirect("/cart");
        res.redirect("/shop");
    } catch (error) {
        console.log("Error adding to cart:", error);
        req.flash("error", "Something went wrong while adding to cart");
        res.redirect("/shop");
    }
})

router.get('/removeFromCart/:id', isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            req.flash("error", "You are not authorized to add items to the cart");
            return res.redirect("/shop");
        }
        let productIndex = user.cart.findIndex(item => item.product && item.product.toString() === req.params.id);
        if (productIndex !== -1) {
            user.cart[productIndex].quantity -= 1;
            if(user.cart[productIndex].quantity === 0){
                user.cart.splice(productIndex, 1);
            }
        }
        await user.save();
        req.flash("success", "Product removed from cart successfully");
        res.redirect("/cart");
    } catch (error) {
        console.log("Error adding to cart:", error);
        req.flash("error", "Something went wrong while adding to cart");
        res.redirect("/shop");
    }
})

module.exports = router;
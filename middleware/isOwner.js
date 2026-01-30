const jwt = require('jsonwebtoken');
const ownerModel = require('../models/owner-model');

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/");
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let owner = await ownerModel.findOne({ email: decoded.email }).select('-password');
        if (!owner) {
            req.flash("error", "You dont have permission to access this page");
            return res.redirect("/");
        }
        req.owner = owner;
        next();
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
}
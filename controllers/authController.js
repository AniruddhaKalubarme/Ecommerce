const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { genrateToken } = require('../utils/genrateToken');

console.log("SOMe error occured")
module.exports.registerUser = async (req, res) => {

    try {
        let { fullname, email, password } = req.body;

        let user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).send("User already exists")
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.status(500).send(err);


                let user = await userModel.create({
                    fullname,
                    email,
                    password: hash,
                })

                let token = genrateToken(user);
                res.cookie("token", token);

                res.send("user created Successfully");
            });
        })

    }
    catch (err) {

        console.log(err)
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }

        let result = await bcrypt.compare(password, user.password);
        if (result) {
            let token = genrateToken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        }
        else {
            res.status(400).send("Invalid password");
        }
    }
    catch (err) {
        console.log("While login some error occured");
        res.status(500).send(err.message);
    }
}

module.exports.logout = async (req, res) => {
    await res.clearCookie("token");
    res.redirect("/");
}

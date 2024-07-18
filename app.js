const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const authModel = require("./models/user");
const { hash } = require("crypto");


const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get('/', (req, res) => {

    res.render("index");
})

app.post('/create', (req, res) => {
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let data = await authModel.create({
                username,
                email,
                password: hash,
                age
            });


            // Generating Token
            let token = jwt.sign({ email }, "M0hdFaraz");
            res.cookie("token", token);

            res.redirect('login');
        })
    })


})

app.get('/login', (req, res) => {
    res.render("login")
})

app.post('/login', async (req, res) => {
    let user = await authModel.findOne({ email: req.body.email })
    if (!user) return res.redirect('/');

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (!result) return res.redirect('/');
        else {
            // Generating Token
            let token = jwt.sign({email: user.email }, "M0hdFaraz");
            res.cookie("token", token);
            res.render('logout', { user })
        }




    })
})

app.get('/logout', (req, res) => {
    res.cookie("token", '');
    res.redirect('/');
})

app.listen(port, () => {
    console.log("Server is running on port 3000");

})
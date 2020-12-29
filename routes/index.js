var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Book = require("../models/books");
var Comment = require("../models/comments");

router.get("/", function(req, res){
    res.redirect("/books");
});


// register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle the sign up logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           req.flash("error", err.message );
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome "+ user.username);
           res.redirect("/books");
       })
   });
});

// login form
router.get("/login", function(req, res){
    res.render("login");
});

// handle login login
router.post("/login", passport.authenticate("local",{
    successRedirect: "/books",
    failureRedirect: "/login"
}), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logout!");
    res.redirect("/books");
});


module.exports = router;
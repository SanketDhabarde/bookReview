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
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
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
    res.redirect("/books");
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// authorization
// for books
function checkBookOwnership(req, res, next){
    // check if user login
    if(req.isAuthenticated()){
        Book.findById(req.params.id, function(err, foundBook){
            if(err){
                res.redirect("back");
            }else{
                // check if user own book
                if(foundBook.user.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("/login");
    }
}

// for comments
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                res.redirect("back");
            }else{
                // check if user own comment
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("/login");
    }
}

module.exports = router;
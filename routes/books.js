var express = require("express");
var router = express.Router();
var Book = require("../models/books");


// INDEX - list all the books
router.get("/books", function(req, res){
    Book.find({}, function(err, allBooks){
        if(err){
            console.log(err);
        }else{
            res.render("books/index", {books: allBooks});
        }
    });
});

// NEW - form to add the new book
router.get("/books/new", isLoggedIn, function(req, res){
    res.render("books/new");
});

// CREATE - create the new book
router.post("/books", isLoggedIn, function(req, res){
    Book.create(req.body.book, function(err, newBook){
        if(err){
            console.log(err);
        }else{
            // save the user
            newBook.user.username = req.user.username;
            newBook.user.id = req.user._id;
            newBook.save();
            req.flash("success", "Successfully submitted!");
            res.redirect("/books");
        }
    });
});

// SHOW - show more info about books
router.get("/books/:id", function(req, res){
   Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
       if(err){
           console.log(err);
       }else{
           res.render("books/show",{book: foundBook});
       }
   }); 
});

// EDIT - show the edit form of the book
router.get("/books/:id/edit", checkBookOwnership, function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            console.log(err);
        }else{
            res.render("books/edit", {book: foundBook});
        }
    });
});

// UPDATE - update the book info
router.put("/books/:id", checkBookOwnership, function(req, res){
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Successfully Updated!");
            res.redirect("/books/"+ req.params.id);
        }
    });
});

// DELETE - remove the book from the database
router.delete("/books/:id", checkBookOwnership, function(req, res){
    Book.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/books");
        }else{
            req.flash("success", "Successfully deleted!");
            res.redirect("/books");
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to login first!");
    res.redirect("/login");
}

// authorization
// for books
function checkBookOwnership(req, res, next){
    // check if user login
    if(req.isAuthenticated()){
        Book.findById(req.params.id, function(err, foundBook){
            if(err){
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }else{
                // check if user own book
                if(foundBook.user.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You are not authorized to to that!");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "You need to login first!");
        res.redirect("/login");
    }
}


module.exports = router;
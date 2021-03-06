var express = require("express");
var router = express.Router();
var Book = require("../models/books");
var Comment = require("../models/comments");

//NEW- form to add new comment
router.get("/books/:id/comments/new", isLoggedIn, function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {book: foundBook});
        }
    });
});

// CREATE - create the comment
router.post("/books/:id/comments", isLoggedIn, function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    // save the user
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    // add comment to book db
                    foundBook.comments.push(comment);
                    foundBook.save();
                    req.flash("success", "Successfully added your review!");
                    res.redirect("/books/"+ foundBook._id);
                }
            });
        }
    });
});

// EDIT - edit the comment
router.get("/books/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        }else{
            var book_id=req.params.id;
            res.render("comments/edit",{comment: foundComment, book_id});
        }
    });
});

// UPDATE - update the edited comment
router.put("/books/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Successfully Updated!");
            res.redirect("/books/"+ req.params.id);
        }
    });
});

// DELETE - delete the comment
router.delete("/books/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/books/"+ req.params.id);
        }else{
            req.flash("success", "Successfully Deleted!");
            res.redirect("/books/"+ req.params.id);
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

// for comments
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }else{
                // check if user own comment or he is admin
                if(comment.author.id.equals(req.user._id) || (req.user.username === "SanketDhabarde")){
                    next();
                }else{
                    req.flash("error", "you are not authorized to do that!");
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
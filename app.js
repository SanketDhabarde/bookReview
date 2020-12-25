const books = require("./models/books");

var express = require("express"),
     app = express(),
     mongoose = require("mongoose"),
     methodOverride = require("method-override"),
     Book = require("./models/books"),
     Comment = require("./models/comments"),
     bodyParser = require("body-parser");


// app config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

// DB config
mongoose.connect('mongodb://localhost:27017/book_review', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});


app.get("/", function(req, res){
    res.redirect("/books");
});

// =======
// ROUTES
// =======

// INDEX - list all the books
app.get("/books", function(req, res){
    Book.find({}, function(err, allBooks){
        if(err){
            console.log(err);
        }else{
            res.render("books/index", {books: allBooks});
        }
    });
});

// NEW - form to add the new book
app.get("/books/new", function(req, res){
    res.render("books/new");
});

// CREATE - create the new book
app.post("/books", function(req, res){
    Book.create(req.body.book, function(err, newBook){
        if(err){
            console.log(err);
        }else{
            res.redirect("/books");
        }
    });
});

// SHOW - show more info about books
app.get("/books/:id", function(req, res){
   Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
       if(err){
           console.log(err);
       }else{
           res.render("books/show",{book: foundBook});
       }
   }); 
});

// EDIT - show the edit form of the book
app.get("/books/:id/edit", function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            console.log(err);
        }else{
            res.render("books/edit", {book: foundBook});
        }
    });
});

// UPDATE - update the book info
app.put("/books/:id", function(req, res){
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
        if(err){
            console.log(err);
        }else{
            res.redirect("/books/"+ req.params.id);
        }
    });
});

// DELETE - remove the book from the database
app.delete("/books/:id", function(req, res){
    Book.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/books");
        }else{
            res.redirect("/books");
        }
    });
});

// ==============
// comment routes
// ==============

//NEW- form to add new comment
app.get("/books/:id/comments/new", function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {book: foundBook});
        }
    });
});

// CREATE - create the comment
app.post("/books/:id/comments", function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    // add comment to book db
                    foundBook.comments.push(comment);
                    foundBook.save();
                    res.redirect("/books/"+ foundBook._id);
                }
            });
        }
    });
});

// EDIT - edit the comment
app.get("/books/:id/comments/:comment_id/edit", function(req, res){
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
app.put("/books/:id/comments/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }else{
            res.redirect("/books/"+ req.params.id);
        }
    });
});

// DELETE - delete the comment
app.delete("/books/:id/comments/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/books/"+ req.params.id);
        }else{
            res.redirect("/books/"+ req.params.id);
        }
    });
});


app.listen(3000, function(){
    console.log("server is started....");
});
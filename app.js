var express = require("express"),
     app = express(),
     mongoose = require("mongoose"),
     methodOverride = require("method-override"),
     bodyParser = require("body-parser");


// app config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

// DB config
mongoose.connect('mongodb://localhost:27017/book_review', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

var booksSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    author: String,
    description: String
});

var Book = mongoose.model("Book", booksSchema);

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
            res.render("index", {books: allBooks});
        }
    });
});

// NEW - form to add the new book
app.get("/books/new", function(req, res){
    res.render("new");
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
   Book.findById(req.params.id, function(err, foundBook){
       if(err){
           console.log(err);
       }else{
           res.render("show",{book: foundBook});
       }
   }); 
});

// EDIT - show the edit form of the book
app.get("/books/:id/edit", function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {book: foundBook});
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

app.listen(3000, function(){
    console.log("server is started....");
});
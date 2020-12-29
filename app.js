var express = require("express"),
     app = express(),
     mongoose = require("mongoose"),
     methodOverride = require("method-override"),
     Book = require("./models/books"),
     Comment = require("./models/comments"),
     User = require("./models/user"),
     passport = require("passport"),
     localStrategy = require("passport-local"),
     flash = require("connect-flash"),
     bodyParser = require("body-parser");

const { use } = require("./routes/books");
var bookRoutes = require("./routes/books");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

// app config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

// DB config
mongoose.connect('mongodb://localhost:27017/book_review', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

// passport config
app.use(require("express-session")({
    secret:"hello world",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// routes

app.use(bookRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


app.listen(3000, function(){
    console.log("server is started....");
});
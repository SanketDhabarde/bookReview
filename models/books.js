var mongoose = require("mongoose");

var booksSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    author: String,
    description: String
});

module.exports = mongoose.model("Book", booksSchema);
var mongoose = require("mongoose");

var booksSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    author: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Book", booksSchema);
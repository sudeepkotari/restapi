const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productschema = new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
});

const Product = mongoose.model('product',productschema);
module.exports = Product;
const createError = require('http-errors');
const mongoose = require('mongoose');
const Product = require('../models/productModel')
module.exports = {
getAllProducts : async(req,res,next)=>{
    try{  
       const results = await Product.find({},{__v:0,});
       res.send(results);
   
    }catch(error){
     console.log(error.message);
    }
   },

createNewProduct : async(req,res,next)=>{
    try{
        const product = new Product(req.body);
        const result = await product.save();
        res.send(result);

    }catch(error){
     console.log(error.message);
     if(error.name === 'ValidationError'){
      next(createError(422,error.message));
      return
     }
     next(error);
    }
    // const product = new Product({
    //     name:req.body.name,
    //     price:req.body.price
    // });
    // product.save()
    // .then(result=>{
    //     console.log(result);
    //     res.send(result);
    // })
    // .catch(err=>{
    //     console.log(err.message);
    // })
},

updateProduct:async(req,res,next)=>{
    try{
    const id = req.params.id;
    const updates = req.body;
    const options ={new:true};//tp return updated result
   const result = await Product.findByIdAndUpdate(id,updates,options);
   if(!result){
    throw createError(404,'Not Found')
   }
   res.send(result);
  }catch(error){
      console.log(error.message);
      if(error instanceof mongoose.CastError){
        next(createError(400,'Invalid Product ID'));
        return;
    }
    next(error);
  }
},

deleteProduct: async(req,res,next)=>{
    const id = req.params.id;
    try{
        const result = await Product.findByIdAndDelete(id,{__v:0});
        if(!result){
            throw createError(404,'product does not exist...');
        }
        res.send(result);
    }catch(error){
     console.log(error.message);
     if(error instanceof mongoose.CastError){
        next(createError(400,'Invalid Product ID'));
        return;
    }
    next(error);
    }
    },

findProductById : async(req,res,next)=>{
    const id = req.params.id;
    try{
    const result = await Product.findById(id,{__v:0});
    if(!result){
        throw createError(404,'product does not exist...');
    }
    res.send(result);
    }catch(error){
        console.log(error.message);
        if(error instanceof mongoose.CastError){
            next(createError(400,'Invalid Product ID'));
            return;
        }
        next(error);
    }
    
}

}
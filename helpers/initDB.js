const mongoose = require('mongoose');


    mongoose.connect(process.env.MONGODB_URI,{
 dbName :process.env.DB_NAME,
 user: process.env.DB_USER,
 pass:process.env.DB_PWD,
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify:false,
useCreateIndex:true
})
.then(()=>{
    console.log("mongodb connected...");
}).catch(err => console.log(err.message));

mongoose.connection.on('connected',()=>{
    console.log('Mongoose connected to database...');
});

mongoose.connection.on('error',()=>{
    console.log(error.message);
});

mongoose.connection.on('disconnected',()=>{
  console.log('Mongoose is disconnected.....')
});

process.on('SIGINT',async()=>{
    await mongoose.connection.close(()=>{
        console.log("Mongoose connection disconneted due to app termination");
    });
    process.exit(0);
});

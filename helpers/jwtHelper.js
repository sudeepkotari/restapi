const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { token } = require('morgan');
const client = require('./initRedis');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject)=>{
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "30s",
                issuer: "viralitt.com",  //website name 
                audience: userId
            }
            JWT.sign(payload,secret,options, (err,token)=>{
                if(err) { 
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                 resolve(token);
            })
        })
    },
    verifyAccessToken: (req,res,next) =>{
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
            if(err){
            //     if(err.name === 'JsonWebTokenError'){
            //         return next(createError.Unauthorized());
            //    }else{
            //        return next(createError.Unauthorized(err.message));
            //    }
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject)=>{
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "1y",
                issuer: "viralitt.com",  //website name 
                audience: userId
            }
            JWT.sign(payload,secret,options, (err,token)=>{
                if(err) { 
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                client.SET(userId,token,'EX',365*24*60*60,(err , reply)=>{
                    if(err){
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return;
                    } 
                    resolve(token);
                });
            })
        })
    },
    verifyRefreshToken: (refreshToken)=>{
        return new Promise((resolve,reject)=>{
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
                if(err) return reject(createError.Unauthorized());
                const usedId = payload.aud;
                 client.GET(usedId,(err,result)=>{
                     if(err){
                         console.log(err.message)
                         reject(createError.InternalServerError());
                         return
                     }
                     if(refreshToken === result) return resolve(usedId);
                     reject(createError.Unauthorized());
                })
            })
        })
    }
}
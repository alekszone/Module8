const express = require ("express")
const axios = require("axios")
const {authorize} = require("../midelwares/authorize")
const userSchema =require("../users/schema")

const userRouter = express.Router()

userRouter.get("/weatherCity/:city",authorize,async(req,res,next)=>{
try{
    
    axios("https://community-open-weather-map.p.rapidapi.com/find?type=link%252C%20accurate&units=imperial%252C%20metric&q="+ req.params.city, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": process.env.API
        }
    })
    .then(response => response.data  )
    .then(data=>{
      res.send(data)   
    })
    .catch(err => {
        console.log(err);
    });
}catch(error){
    next(error)
}




})




module.exports=userRouter

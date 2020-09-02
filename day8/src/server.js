const express = require("express")
const fetch = require("node-fetch")
require("dotenv").config()
const routers = require("./router/routers")

const backend = express()
backend.use("/routers",routers)

backend.listen(process.argv[2],async()=>{
console.log(`Running on port ${process.argv[2]}`)

const newRegistration = await fetch( process.env.URL+"addport",{
    method:"POST",
    header:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        url:"http://localhost:"+process.argv[2]
    })
}) 
if(newRegistration.ok){
    console.log("You are in")
}else{
    console.log("Api is not Working")
}
})
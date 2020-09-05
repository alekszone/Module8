const express = require("express")
const cors = require("cors")
const {join} = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const userRouter = require("../src/routers/users")
const weatherRouter = require ("../src/routers/fetchWeather")


const server = express()

server.use(cors())
server.use(express.json())

server.use("/users",userRouter)
server.use("/fetchWeather",weatherRouter)
console.log(listEndpoints(server))

const port = process.env.PORT
mongoose.connect("mongodb://localhost:27017/weather-app",{
    useNewUrlParser: true,
    useUnifiedTopology: true,})
.then(
server.listen(port,()=>{
    console.log("RUnning on port",port)
})
)
.catch((err)=>console.log(err))
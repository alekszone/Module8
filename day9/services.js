const http = require("http")
const express = require("express")
const socketio = require("socket.io")
// const mongoose = require("mongoose")


const server = express()
const app = http.createServer(server)
const io = socketio(app)
let users = []
io.on('connect', (socket)=>{
    console.log("New WEBSocket connection",socket.id)


socket.on("sendUsername",async (username)=>{
   await users.push({...username,id:socket.id})
    io.emit('usersOnline',(users))
})
socket.on("message",async (message)=>{
    const messages =await users.find((user)=>user.username===message.to)
    io.to(messages.id).emit("mess", message)
})
console.log(users)
})

app.listen(4000,()=>{
    console.log(4000,`this is port ${4000}`)
})


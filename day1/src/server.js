const express = require("express")
const cors = require("cors")
// const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const passaport = require("passport")
const google =  require("./services/users/google")

const usersRouter = require("./services/users")

const {
  notFoundHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers")

const server = express()
const port = process.env.PORT
server.use(cors())
server.use(express.json())
server.use(morgan())
server.use(passaport.initialize())




server.use("/users", usersRouter)

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

mongoose
  .connect("mongodb://localhost:27017/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))
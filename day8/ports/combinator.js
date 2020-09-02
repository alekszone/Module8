const express =  require ("express")
const fs = require("fs-extra")
const writeJson = "./services.json"
const cors = require("cors")
const fetch = require("node-fetch")


const server = express()

server.use(cors())
server.use(express.json())

server.post("/addport",async(req,res)=>{
const port = JSON.parse(await fs.readFile(writeJson))
if(!port.find(x=>x===req.body.url)){
    port.push(req.body.url)
    console.log("Port Added " + req.body.url)
await fs.writeFile(writeJson,JSON.stringify(port))
}
res.send(port)

})



server.get("/:containerName", async(req,res)=>{
let chances=10
do{
const port = JSON.parse(await fs.readFile(writeJson))
if(port.length===0)
return res.status(500).send("No avaible Localhosts")

const randomPorts = Math.floor(Math.random()*port.length)
const chosePort =port[randomPorts]
const url =port + "/files/" + req.params.containerName
try{
const resp = await fetch(url)
if(resp.ok){
    const data = await resp.json
return res.send(data)

 }else{
     const removed =  port.filter(port =>port!==chosePort)
     await fs.writeFile(writeJson,JSON.stringify(removed))
     console.log("this is the removed port " , chosePort)
 }
}
catch{
    const removed =  port.filter(port =>port!==chosePort)
    await fs.writeFile(writeJson,JSON.stringify(removed))
    console.log("this is the removed port " , chosePort)
result--

}
}while(chances>0)
})

server.listen(4800, () => console.log("Server listening on 4800"))

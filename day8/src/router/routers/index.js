const express = require("express")
const multer = require("multer")
require("dotenv").config()
const { BlobServiceClient, StorageSharedKeyCredential, BlobLeaseClient} = require("@azure/storage-blob")
let MulterAzureStrorage = require('multer-azure-storage')
const { Router } = require("express")

console.log(process.env.STORAGE_KEY)
const keys = new StorageSharedKeyCredential("newnetflix",process.env.STORAGE_KEY)
const blobClient = new BlobServiceClient ("https://newnetflix.blob.core.windows.net/",keys)


const server = express.Router()

server.get("/",async(req,res)=>{
const datas = await blobClient.listContainers()
const toGet =[]
for await (const data of datas)
toGet.push(data.name)
res.send(toGet)
})



const multerData = multer({
  storage : new MulterAzureStrorage({
azureStorageConnectionString:process.env.STORAGE_CS,
containerName: 'movies',
containerSecurity:'container'

  })  
})

server.post("/checkUpload",multerData.single("movie"),async(req,res)=>{
    res.send(req.file.url)
})

server.post("/:containerName",async(req,res)=>{
const container =await blobClient.createContainer(req.params.containerName,{

access:"container"
})
res.send(container)

})

const amulter = new multer({})
server.post("/:containerName/upload",amulter.single("movies"),async(req,res)=>{
try{
const container = await blobClient.getContainerClient(req.params.containerName)
const file = await container.uploadBlockBlob(req.file.originalname,req.file.buffer,req.file.size)
res.send(file)

}catch(error){
    res.status(500).send(error)
}
})

server.get("/:containerName",async(req,res)=>{
const container = await blobClient.getContainerClient(req.params.containerName)
const files = await container.listBlobsFlat()
console.log(files)
const toGet=[]
for await(const data of files)
toGet.push(data.name)
res.send(toGet)
})

server.delete("/:containerName/:movieName",async(req,res)=>{
  const container = await blobClient.getContainerClient(req.params.containerName)  
await container.deleteBlob(req.params.movieName)

res.send("the movie is Deleted")
})


module.exports=server
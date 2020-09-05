const express = require("express")
const qtm = require("query-to-mongo")
const {authenticate,refreshToken} = require("./authTools")
const {authorize} = require("../midelwares/authorize")


const dataMongo  = require ("./schema")

const userRouter = express.Router()


userRouter.get("/",authorize,async(req,res,next)=>{
try{
    const query = qtm(req.query)
    const user = await dataMongo.find(query.criteria,query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
    res.send(user)

}catch(err){
    next(err)
console.log(err)
}
} )
userRouter.get("/data",authorize,async(req,res,next)=>{
   try{
       res.send(req.user)
   }catch(error){
       next(error)
   } 
})




userRouter.post("/register",async(req,res,next)=>{
try{
    const newUser = new dataMongo(req.body)
    const {_id} = await newUser.save()
res.status(201).send(_id)
}catch(error){
    next(error)
    console.log(error)
}
})
userRouter.post("/login" , async(req,res,next)=>{
 try {
  const {email, password} = req.body 
  const user = await dataMongo.findByCredentials(email,password)
  const token = await authenticate(user) 
res.send(token)
 }catch(error){
     next(error)
     console.log(error)
 }   
})
userRouter.get("/cityList",authorize,async(req,res,next)=>{
    try{
        res.send(req.user.cityList)
    }catch(error){
        next(error)
    } 

})


userRouter.post("/addCity",authorize,async(req,res,next)=>{
    try{
    const {_id,cityList} = req.user
    console.log(cityList)
    const findCity = await cityList.find((city)=>city.toLowerCase()===req.body.cityList)
    console.log(req.body)  
console.log(req.body.cityList)
console.log(findCity,"finded")

if(findCity){
    res.send("City already Exist")
}else{
          cityList.push(req.body.cityList)      
         await dataMongo.findByIdAndUpdate(_id,{cityList})
        res.status(201).send(cityList)
   
}
 
   
}catch(error){
    next(error)
}
})
userRouter.delete("/deleteCity/:name",authorize,async(req,res,next)=>{
const {_id,cityList} = req.user
const removeCity = cityList.find((city)=>city.toLowerCase()!==req.params.name)
if(removeCity){
await dataMongo.findByIdAndUpdate(_id,{cityList:removeCity})
res.send("City is Removed")
}else{
    res.send("City dont Exist")
}
})



userRouter.post("/logout", authorize, async (req, res, next) => {
    try {
      req.user.refreshTokens = req.user.refreshTokens.filter(
        (t) => t.token !== req.body.refreshToken
      )
      await req.user.save()
      res.send("You are out")
    } catch (err) {
      next(err)
    }
  })




module.exports= userRouter




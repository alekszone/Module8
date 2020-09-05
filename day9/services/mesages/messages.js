const {Schema} =require("mongoose")
const mongoose = require("mongoose")

const mesageSchema = new Schema(
{
text:{
    type:String,
    required:true,
},
sender:String
},
{ timestamps : true} 

)
const messa

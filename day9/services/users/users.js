const {Schema} = require("mongose")
const mongoose = require("mongoose")


const usersSchema = new Schema(
{
    username:{
        type:String,
        required:true,
        isUnique:true,
},
members:[
    {
        username:String,
        id:String,
    }
]
},
{timestamps:true}
)

const usersSchema = mongoose.model("users",usersSchema)
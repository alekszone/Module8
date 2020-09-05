const {Schema} = require("mongoose")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const v =require("validator") 
const userSchema  = new Schema (
    {
name:{
    type:String,
    required:true,
},
surname:{
    type:String,
    required:true,
},
password: {
    type: String,
    required: true,
    minlength: 7,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: async (value) => {
        if (!v.isEmail(value)) {
          throw new Error("Email is invalid")
        }
      },
    },
  },
  cityList:[
      { 
 type:String    
      }
  ],
 
  refreshTokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
},
{ timestamps: true }
)

userSchema.methods.toJSON = function () {
const user = this
const userObject = user.toObject()

delete userObject.password
delete userObject.__v

return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
const user = await userModel.findOne({ email })
const isMatch = await bcrypt.compare(password, user.password)
if (!isMatch) {
  const err = new Error("Unable to login")
  err.httpStatusCode = 401
  throw err
}

return user
}

userSchema.pre("save", async function (next) {
const user = this

if (user.isModified("password")) {
  user.password = await bcrypt.hash(user.password, 8)
}

next()
})

userSchema.post("save", function (error, doc, next) {
if (error.name === "MongoError" && error.code === 11000) {
  error.httpStatusCode = 400
  next(error)
} else {
  next()
}
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel